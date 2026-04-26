"""
scraper/competitor_scraper.py
──────────────────────────────
Concurrent scraper for competitor university public data.

Performance goals:
  • No fixed per-request sleep
  • Shared HTTP client + connection pooling
  • Bounded concurrency to remain polite and stable
  • Retry transient failures with backoff
"""

import asyncio
import logging
import os
import re
from dataclasses import asdict, dataclass
from typing import Any, Optional
from urllib.parse import urlencode, quote

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; UCAR-ResearchBot/1.0; +https://ucar.tn/bot)"
}

HTTP_TIMEOUT = float(os.getenv("SCRAPER_TIMEOUT_SECONDS", "15"))
SCRAPER_CONCURRENCY = int(os.getenv("SCRAPER_CONCURRENCY", "6"))
SCRAPER_MAX_RETRIES = int(os.getenv("SCRAPER_MAX_RETRIES", "2"))
SCRAPER_RETRY_BACKOFF_SECONDS = float(os.getenv("SCRAPER_RETRY_BACKOFF_SECONDS", "0.35"))


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


async def _get_text(client: httpx.AsyncClient, url: str) -> Optional[str]:
    for attempt in range(SCRAPER_MAX_RETRIES + 1):
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.text
        except Exception as exc:
            if attempt >= SCRAPER_MAX_RETRIES:
                logger.warning("GET %s failed after retries: %s", url, exc)
                return None
            await asyncio.sleep(SCRAPER_RETRY_BACKOFF_SECONDS * (attempt + 1))
    return None


async def _get_json(client: httpx.AsyncClient, url: str) -> Optional[dict[str, Any]]:
    text = await _get_text(client, url)
    if not text:
        return None
    try:
        import json
        return json.loads(text)
    except Exception:
        return None


def _extract_field(text: str, field: str) -> Optional[str]:
    pattern = rf"\|\s*{field}\s*=\s*([^\|\n\}}]+)"
    match = re.search(pattern, text, re.IGNORECASE)
    if not match:
        return None
    value = re.sub(r"\[\[([^\|\]]+\|)?([^\]]+)\]\]", r"\2", match.group(1))
    value = re.sub(r"\{\{[^\}]+\}\}", "", value)
    return value.strip()


async def scrape_wikipedia(client: httpx.AsyncClient, name: str) -> dict[str, Any]:
    """Query Wikipedia API for a university infobox summary."""
    search_url = "https://en.wikipedia.org/w/api.php?" + urlencode(
        {
            "action": "query",
            "list": "search",
            "srsearch": f"{name} university",
            "srlimit": 1,
            "format": "json",
        }
    )
    data = await _get_json(client, search_url)
    if not data:
        return {}

    results = data.get("query", {}).get("search", [])
    if not results:
        return {}

    title = results[0].get("title")
    if not title:
        return {}
    snippet = BeautifulSoup(results[0].get("snippet", ""), "html.parser").get_text()

    parse_url = (
        "https://en.wikipedia.org/w/api.php?"
        + urlencode(
            {
                "action": "parse",
                "page": title.replace(" ", "_"),
                "prop": "wikitext",
                "format": "json",
            }
        )
    )
    parsed = await _get_json(client, parse_url)
    if not parsed:
        return {"wiki_title": title, "wiki_summary": snippet}

    wikitext = parsed.get("parse", {}).get("wikitext", {}).get("*", "")
    founded = _extract_field(wikitext, "established") or _extract_field(wikitext, "founded")
    students = _extract_field(wikitext, "students") or _extract_field(wikitext, "student")
    staff = _extract_field(wikitext, "academic_staff") or _extract_field(wikitext, "faculty")

    return {
        "wiki_title": title,
        "wiki_url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}",
        "wiki_summary": snippet[:400],
        "founded": founded,
        "students": students,
        "academic_staff": staff,
    }


async def scrape_openalex(client: httpx.AsyncClient, name: str) -> dict[str, Any]:
    """Scrape OpenAlex institution summary data."""
    url = f"https://api.openalex.org/institutions?search={quote(name)}&per_page=1"
    data = await _get_json(client, url)
    if not data:
        return {}

    results = data.get("results", [])
    if not results:
        return {}

    institution = results[0]
    summary_stats = institution.get("summary_stats", {})
    return {
        "openalex_id": institution.get("id"),
        "openalex_display_name": institution.get("display_name"),
        "openalex_country": institution.get("country_code"),
        "openalex_type": institution.get("type"),
        "openalex_works_count": institution.get("works_count"),
        "openalex_cited_by_count": institution.get("cited_by_count"),
        "openalex_h_index": summary_stats.get("h_index"),
        "openalex_i10_index": summary_stats.get("i10_index"),
        "openalex_2yr_mean_citedness": summary_stats.get("2yr_mean_citedness"),
        "openalex_homepage": institution.get("homepage_url"),
        "openalex_ror": institution.get("ror"),
    }


async def scrape_homepage(client: httpx.AsyncClient, url: Optional[str]) -> dict[str, Any]:
    """Basic homepage analysis for web-presence signal extraction."""
    if not url:
        return {"homepage_reachable": False}

    try:
        response = await client.get(url)
        response.raise_for_status()
    except Exception as exc:
        logger.warning("Homepage GET failed for %s: %s", url, exc)
        return {"homepage_reachable": False}

    html = response.text
    soup = BeautifulSoup(html, "lxml")
    text_lower = html.lower()
    return {
        "homepage_reachable": True,
        "homepage_status_code": response.status_code,
        "homepage_has_english": (
            "english" in text_lower
            or "en/" in text_lower
            or bool(soup.find("a", href=re.compile(r"/en[/\?]?$", re.I)))
        ),
        "homepage_has_research_section": any(
            keyword in text_lower for keyword in ["research", "recherche", "بحث"]
        ),
        "homepage_has_international_section": any(
            keyword in text_lower for keyword in ["international", "erasmus", "exchange", "mobility"]
        ),
        "homepage_title": soup.title.string.strip() if soup.title and soup.title.string else None,
    }


async def scrape_competitor(
    client: httpx.AsyncClient,
    semaphore: asyncio.Semaphore,
    name: str,
    homepage_url: Optional[str] = None,
) -> UniversityProfile:
    """Aggregate scraping for a single competitor with bounded global concurrency."""
    async with semaphore:
        profile = UniversityProfile(name=name, homepage_url=homepage_url)
        logger.info("Scraping: %s", name)

        try:
            wiki = await scrape_wikipedia(client, name)
            profile.wikipedia_url = wiki.get("wiki_url")
            profile.wiki_summary = wiki.get("wiki_summary")
            profile.founded = wiki.get("founded")
            profile.students = wiki.get("students")
            profile.academic_staff = wiki.get("academic_staff")
        except Exception as exc:
            logger.warning("Wikipedia error for %s: %s", name, exc)

        try:
            openalex = await scrape_openalex(client, name)
            profile.openalex_works_count = openalex.get("openalex_works_count")
            profile.openalex_cited_by_count = openalex.get("openalex_cited_by_count")
            profile.openalex_h_index = openalex.get("openalex_h_index")
            profile.openalex_i10_index = openalex.get("openalex_i10_index")
            profile.openalex_2yr_mean_citedness = openalex.get("openalex_2yr_mean_citedness")
            if not profile.homepage_url:
                profile.homepage_url = openalex.get("openalex_homepage")
        except Exception as exc:
            logger.warning("OpenAlex error for %s: %s", name, exc)

        try:
            homepage = await scrape_homepage(client, profile.homepage_url)
            profile.homepage_reachable = homepage.get("homepage_reachable", False)
            profile.homepage_has_english = homepage.get("homepage_has_english", False)
            profile.homepage_has_research_section = homepage.get("homepage_has_research_section", False)
            profile.homepage_has_international_section = homepage.get("homepage_has_international_section", False)
        except Exception as exc:
            logger.warning("Homepage error for %s: %s", name, exc)

        return profile


async def scrape_all_competitors_async(
    competitors: list[str], homepage_map: Optional[dict[str, str]] = None
) -> list[dict]:
    """Scrape all competitors concurrently with stable ordering."""
    cleaned = [name.strip() for name in competitors if name and name.strip()]
    if not cleaned:
        return []

    limits = httpx.Limits(max_connections=max(10, SCRAPER_CONCURRENCY * 2), max_keepalive_connections=10)
    timeout = httpx.Timeout(HTTP_TIMEOUT)
    semaphore = asyncio.Semaphore(max(1, SCRAPER_CONCURRENCY))

    async with httpx.AsyncClient(headers=HEADERS, timeout=timeout, follow_redirects=True, limits=limits) as client:
        tasks = [
            scrape_competitor(
                client,
                semaphore,
                name,
                (homepage_map or {}).get(name),
            )
            for name in cleaned
        ]
        profiles = await asyncio.gather(*tasks)

    results: list[dict[str, Any]] = []
    for profile in profiles:
        results.append(asdict(profile))
        logger.info(
            "Done: %s — works=%s, citations=%s",
            profile.name,
            profile.openalex_works_count,
            profile.openalex_cited_by_count,
        )
    return results


def scrape_all_competitors(
    competitors: list[str], homepage_map: Optional[dict[str, str]] = None
) -> list[dict]:
    """Sync wrapper for environments that are not already running an event loop."""
    return asyncio.run(scrape_all_competitors_async(competitors, homepage_map))


if __name__ == "__main__":
    import json

    logging.basicConfig(level=logging.INFO)

    test_competitors = [
        "University of Tunis El Manar",
        "University of Sfax",
        "Mohamed V University",
    ]
    results = asyncio.run(scrape_all_competitors_async(test_competitors))
    print(json.dumps(results, indent=2, default=str))
