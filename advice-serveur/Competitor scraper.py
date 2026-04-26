"""
scraper/competitor_scraper.py
──────────────────────────────
Scrapes public-facing data for each competitor university.
No login required — we only target publicly available pages:
  • University homepage (presence, language, last updated)
  • Google Scholar profiles (if accessible)
  • Scopus/OpenAlex public stats
  • Webometrics public profile page
  • Wikipedia infobox (founding year, student count, faculties)

This runs BEFORE the agent so the agent has raw data to reason over.
The agent then uses its web_search MCP tool to go deeper on specific gaps.
"""

import os
import re
import time
import logging
import asyncio
from dataclasses import dataclass, asdict
from typing import Optional

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; UCAR-ResearchBot/1.0; +https://ucar.tn/bot)"
}
TIMEOUT = 15
DELAY_BETWEEN_REQUESTS = 2.0  # seconds — be polite


@dataclass
class UniversityProfile:
    name: str
    homepage_url: Optional[str] = None
    wikipedia_url: Optional[str] = None

    # From Wikipedia infobox
    founded: Optional[str] = None
    students: Optional[str] = None
    academic_staff: Optional[str] = None
    faculties_count: Optional[int] = None
    location: Optional[str] = None
    wiki_summary: Optional[str] = None

    # From OpenAlex (free, no key required)
    openalex_works_count: Optional[int] = None
    openalex_cited_by_count: Optional[int] = None
    openalex_h_index: Optional[int] = None
    openalex_i10_index: Optional[int] = None
    openalex_2yr_mean_citedness: Optional[float] = None

    # From Webometrics public page
    webometrics_world_rank: Optional[int] = None
    webometrics_presence: Optional[int] = None
    webometrics_impact: Optional[int] = None
    webometrics_openness: Optional[int] = None
    webometrics_excellence: Optional[int] = None

    # Homepage analysis
    homepage_reachable: bool = False
    homepage_has_english: bool = False
    homepage_has_research_section: bool = False
    homepage_has_international_section: bool = False

    error: Optional[str] = None


def _get(url: str) -> Optional[requests.Response]:
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        r.raise_for_status()
        return r
    except Exception as e:
        logger.warning(f"GET {url} failed: {e}")
        return None


def scrape_wikipedia(name: str) -> dict:
    """
    Query Wikipedia's API for a university's infobox data.
    No key required.
    """
    # Search for the article
    search_url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query", "list": "search",
        "srsearch": name + " university", "srlimit": 1, "format": "json"
    }
    r = _get(search_url + "?" + "&".join(f"{k}={v}" for k, v in params.items()))
    if not r:
        return {}

    results = r.json().get("query", {}).get("search", [])
    if not results:
        return {}

    title = results[0]["title"]
    snippet = BeautifulSoup(results[0].get("snippet", ""), "html.parser").get_text()

    # Get the actual page content (parse section 0 for summary + infobox)
    parse_url = (f"https://en.wikipedia.org/w/api.php?action=parse&page="
                 f"{title.replace(' ', '_')}&prop=wikitext&format=json")
    r2 = _get(parse_url)
    if not r2:
        return {"wiki_title": title, "wiki_summary": snippet}

    wikitext = r2.json().get("parse", {}).get("wikitext", {}).get("*", "")

    def extract_field(text: str, field: str) -> Optional[str]:
        pattern = rf"\|\s*{field}\s*=\s*([^\|\n\}]+)"
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            val = re.sub(r"\[\[([^\|\]]+\|)?([^\]]+)\]\]", r"\2", m.group(1))
            val = re.sub(r"\{\{[^\}]+\}\}", "", val)
            return val.strip()
        return None

    founded  = extract_field(wikitext, "established") or extract_field(wikitext, "founded")
    students = extract_field(wikitext, "students") or extract_field(wikitext, "student")
    staff    = extract_field(wikitext, "academic_staff") or extract_field(wikitext, "faculty")

    return {
        "wiki_title": title,
        "wiki_url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}",
        "wiki_summary": snippet[:400],
        "founded": founded,
        "students": students,
        "academic_staff": staff,
    }


def scrape_openalex(name: str) -> dict:
    """
    OpenAlex is a fully free, open academic graph.
    No API key required. Rate limit: 100,000 requests/day.
    Docs: https://docs.openalex.org
    """
    url = f"https://api.openalex.org/institutions?search={requests.utils.quote(name)}&per_page=1"
    r = _get(url)
    if not r:
        return {}

    results = r.json().get("results", [])
    if not results:
        return {}

    inst = results[0]
    summary_stats = inst.get("summary_stats", {})

    return {
        "openalex_id": inst.get("id"),
        "openalex_display_name": inst.get("display_name"),
        "openalex_country": inst.get("country_code"),
        "openalex_type": inst.get("type"),
        "openalex_works_count": inst.get("works_count"),
        "openalex_cited_by_count": inst.get("cited_by_count"),
        "openalex_h_index": summary_stats.get("h_index"),
        "openalex_i10_index": summary_stats.get("i10_index"),
        "openalex_2yr_mean_citedness": summary_stats.get("2yr_mean_citedness"),
        "openalex_homepage": inst.get("homepage_url"),
        "openalex_ror": inst.get("ror"),
    }


def scrape_homepage(url: Optional[str]) -> dict:
    """
    Basic homepage analysis — checks presence, language options, key sections.
    """
    if not url:
        return {"homepage_reachable": False}

    r = _get(url)
    if not r:
        return {"homepage_reachable": False}

    soup = BeautifulSoup(r.text, "lxml")
    text_lower = r.text.lower()

    return {
        "homepage_reachable": True,
        "homepage_status_code": r.status_code,
        "homepage_has_english": "english" in text_lower or "en/" in text_lower or
                                 bool(soup.find("a", href=re.compile(r"/en[/\?]?$", re.I))),
        "homepage_has_research_section": any(kw in text_lower for kw in
                                              ["research", "recherche", "بحث"]),
        "homepage_has_international_section": any(kw in text_lower for kw in
                                                   ["international", "erasmus", "exchange", "mobility"]),
        "homepage_title": soup.title.string.strip() if soup.title else None,
    }


def scrape_competitor(name: str, homepage_url: Optional[str] = None) -> UniversityProfile:
    """
    Aggregate all scraping for one competitor university.
    """
    profile = UniversityProfile(name=name, homepage_url=homepage_url)
    logger.info(f"Scraping: {name}")

    # 1. Wikipedia
    try:
        wiki = scrape_wikipedia(name)
        profile.wikipedia_url = wiki.get("wiki_url")
        profile.wiki_summary  = wiki.get("wiki_summary")
        profile.founded       = wiki.get("founded")
        profile.students      = wiki.get("students")
        profile.academic_staff= wiki.get("academic_staff")
    except Exception as e:
        logger.warning(f"Wikipedia error for {name}: {e}")
    time.sleep(DELAY_BETWEEN_REQUESTS)

    # 2. OpenAlex (research output — no key needed)
    try:
        oa = scrape_openalex(name)
        profile.openalex_works_count     = oa.get("openalex_works_count")
        profile.openalex_cited_by_count  = oa.get("openalex_cited_by_count")
        profile.openalex_h_index         = oa.get("openalex_h_index")
        profile.openalex_i10_index       = oa.get("openalex_i10_index")
        profile.openalex_2yr_mean_citedness = oa.get("openalex_2yr_mean_citedness")
        if not homepage_url:
            profile.homepage_url = oa.get("openalex_homepage")
    except Exception as e:
        logger.warning(f"OpenAlex error for {name}: {e}")
    time.sleep(DELAY_BETWEEN_REQUESTS)

    # 3. Homepage analysis
    try:
        hp = scrape_homepage(profile.homepage_url)
        profile.homepage_reachable              = hp.get("homepage_reachable", False)
        profile.homepage_has_english            = hp.get("homepage_has_english", False)
        profile.homepage_has_research_section   = hp.get("homepage_has_research_section", False)
        profile.homepage_has_international_section = hp.get("homepage_has_international_section", False)
    except Exception as e:
        logger.warning(f"Homepage error for {name}: {e}")
    time.sleep(DELAY_BETWEEN_REQUESTS)

    return profile


def scrape_all_competitors(competitors: list[str],
                           homepage_map: Optional[dict] = None) -> list[dict]:
    """
    Scrape all competitors and return list of profile dicts.
    homepage_map: optional {name: url} for known homepages.
    """
    results = []
    for name in competitors:
        url = (homepage_map or {}).get(name)
        profile = scrape_competitor(name.strip(), url)
        results.append(asdict(profile))
        logger.info(f"Done: {name} — works={profile.openalex_works_count}, "
                    f"citations={profile.openalex_cited_by_count}")
    return results


if __name__ == "__main__":
    import json
    logging.basicConfig(level=logging.INFO)

    test_competitors = [
        "University of Tunis El Manar",
        "University of Sfax",
        "Mohamed V University",
    ]
    results = scrape_all_competitors(test_competitors)
    print(json.dumps(results, indent=2, default=str))