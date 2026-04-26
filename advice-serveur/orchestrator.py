"""
orchestrator.py
────────────────
Main entry point. Orchestrates:
  1. Download ranking Excel (skip if unchanged)
  2. Scrape all 10 competitors
  3. Inject data into MCP server
  4. Run Claude agent analysis
  5. Save structured report + dashboard JSON

Can be run:
  • Manually:    python orchestrator.py
  • On schedule: python orchestrator.py --daemon   (uses APScheduler)
  • Via API:     POST /run to the FastAPI endpoint (api/server.py)
"""

import os
import json
import logging
import asyncio
import argparse
import hashlib
from pathlib import Path
from datetime import datetime, timezone

from dotenv import load_dotenv
load_dotenv()

from scraper.ranking_downloader import RankingDownloader
from scraper.competitor_scraper import scrape_all_competitors_async
from agent.ranking_agent import run_analysis
from agent.improvement_engine import build_fast_analysis, merge_analysis
import mcp_server.ranking_mcp_server as mcp_store

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("orchestrator")

# ── Config from environment ────────────────────────────────────────────────────
UCAR_NAME    = os.getenv("UCAR_NAME", "University of Carthage")
COMPETITORS  = [c.strip() for c in os.getenv("COMPETITORS", "").split(",") if c.strip()]
DATA_DIR     = os.getenv("DATA_DIR", "./data")
REPORTS_DIR  = os.getenv("REPORTS_DIR", "./reports")
EXCEL_URL    = os.getenv("WEBOMETRICS_EXCEL_URL")
CRON         = os.getenv("CRON_SCHEDULE", "0 6 * * 1")
COMPETITOR_CACHE_TTL_HOURS = float(os.getenv("COMPETITOR_CACHE_TTL_HOURS", "24"))
MAX_AGENT_ITERATIONS = int(os.getenv("MAX_AGENT_ITERATIONS", "30"))

_PIPELINE_LOCK = asyncio.Lock()

Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
Path(REPORTS_DIR).mkdir(parents=True, exist_ok=True)

# Default competitors if not configured
DEFAULT_COMPETITORS = [
    "Université de Tunis El Manar",
    "Université de Sfax",
    "Université de Monastir",
    "Université de Sousse",
    "Université de Gabès",
    "Mohammed V University in Rabat",
    "Alexandria University",
    "University of Annaba",
    "Lebanese American University",
    "Cairo University",
]


def _normalize_competitor_names(competitors: list[str]) -> list[str]:
    return sorted({c.strip().casefold() for c in competitors if c and c.strip()})


def _competitor_fingerprint(competitors: list[str]) -> str:
    normalized = "|".join(_normalize_competitor_names(competitors))
    return hashlib.md5(normalized.encode("utf-8")).hexdigest()


def _is_qs_like_url(url: str | None) -> bool:
    text = str(url or "").strip().lower()
    return "topuniversities.com" in text or "qs" in text


def _load_cached_competitor_profiles(
    cache_file: Path,
    competitors: list[str],
    max_age_hours: float,
) -> list[dict] | None:
    if not cache_file.exists():
        return None

    age_hours = (datetime.now(timezone.utc).timestamp() - cache_file.stat().st_mtime) / 3600
    if age_hours >= max_age_hours:
        return None

    try:
        raw = json.loads(cache_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        logger.warning("Competitor cache is corrupted (%s). Re-scraping.", exc)
        return None

    expected_fp = _competitor_fingerprint(competitors)

    # Backward compatibility: legacy cache was a plain list.
    if isinstance(raw, list):
        if competitors and not raw:
            logger.info("Legacy competitor cache is empty while competitors are expected. Re-scraping.")
            return None
        logger.info("Using legacy cached competitor profiles (%.1fh old).", age_hours)
        return raw

    if not isinstance(raw, dict):
        return None

    meta = raw.get("meta") or {}
    cached_fp = str(meta.get("competitor_fingerprint", ""))
    profiles = raw.get("profiles")

    if cached_fp and cached_fp != expected_fp:
        logger.info("Competitor list changed. Invalidating cached profiles.")
        return None
    if not isinstance(profiles, list):
        return None

    if competitors and not profiles:
        logger.info("Cached competitor profiles are empty while competitors are expected. Re-scraping.")
        return None

    logger.info("Using cached competitor profiles (%.1fh old).", age_hours)
    return profiles


def _write_cached_competitor_profiles(
    cache_file: Path,
    competitors: list[str],
    profiles: list[dict],
) -> None:
    payload = {
        "meta": {
            "cached_at": datetime.now(timezone.utc).isoformat(),
            "competitor_fingerprint": _competitor_fingerprint(competitors),
            "competitors_count": len(competitors),
        },
        "profiles": profiles,
    }
    cache_file.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")


async def _run_pipeline_impl(force_download: bool = False, skip_agent: bool = False) -> dict:
    """
    Full pipeline: download → scrape → analyze → save report.
    Returns the final analysis dict.
    """
    competitors = COMPETITORS[:] if COMPETITORS else []
    logger.info(f"Pipeline start. UCAR='{UCAR_NAME}', competitors_configured={len(competitors)}")
    pipeline_started = datetime.now(timezone.utc)

    # ── Step 1: Download ranking Excel ────────────────────────────────────────
    logger.info("Step 1: Downloading ranking data...")
    downloader = RankingDownloader(
        data_dir=DATA_DIR,
        ucar_name=UCAR_NAME,
        custom_url=EXCEL_URL,
        competitors=competitors,
    )

    try:
        updated, excel_path = downloader.download_if_updated()
        ranking_data = downloader.parse(excel_path)

        # If using a QS-like custom source and UCAR is missing, retry with default
        # Webometrics candidates to avoid null-heavy ranking snapshots.
        if _is_qs_like_url(EXCEL_URL):
            ucar_rank = (ranking_data.get("ucar") or {}).get("world_rank")
            if ucar_rank is None:
                logger.warning(
                    "UCAR not found in configured ranking source (%s). "
                    "Retrying parse using default Webometrics candidates.",
                    EXCEL_URL,
                )
                fallback_downloader = RankingDownloader(
                    data_dir=DATA_DIR,
                    ucar_name=UCAR_NAME,
                    custom_url=None,
                    competitors=competitors,
                )
                fb_updated, fb_excel_path = fallback_downloader.download_if_updated()
                fallback_ranking_data = fallback_downloader.parse(fb_excel_path)
                fb_ucar_rank = (fallback_ranking_data.get("ucar") or {}).get("world_rank")
                if fb_ucar_rank is not None:
                    ranking_data = fallback_ranking_data
                    updated = updated or fb_updated
                    downloader = fallback_downloader
                    logger.info("Fallback ranking source resolved UCAR rank=%s", fb_ucar_rank)

        # If COMPETITORS is empty in .env, auto-pick top 10 institutions above UCAR rank.
        if not competitors:
            auto_competitors = downloader.suggest_top_competitors_above_ucar(ranking_data, top_n=10)
            if auto_competitors:
                competitors = auto_competitors
                downloader.competitors = competitors
                ranking_data = downloader.parse(excel_path)
                logger.info("Auto-selected competitors from ranking file: "
                            f"{', '.join(competitors)}")
            else:
                competitors = DEFAULT_COMPETITORS
                downloader.competitors = competitors
                ranking_data = downloader.parse(excel_path)
                logger.warning("Could not auto-select competitors above UCAR. "
                               "Falling back to default competitors list.")

        ucar_row = ranking_data.get("ucar") or {}
        logger.info(f"Ranking data: UCAR rank={ucar_row.get('world_rank')}, "
                    f"file_updated={updated}")
    except Exception as e:
        logger.error(f"Ranking download failed: {e}. Continuing with empty ranking data.")
        ranking_data = {"ucar": {"name": UCAR_NAME}, "competitors": [], "error": str(e)}

    # ── Step 2: Scrape competitors ─────────────────────────────────────────────
    logger.info("Step 2: Scraping competitor profiles...")
    cache_file = Path(DATA_DIR) / "competitor_profiles.json"

    competitor_profiles = None if force_download else _load_cached_competitor_profiles(
        cache_file=cache_file,
        competitors=competitors,
        max_age_hours=COMPETITOR_CACHE_TTL_HOURS,
    )

    if competitor_profiles is None:
        scrape_started = datetime.now(timezone.utc)
        competitor_profiles = await scrape_all_competitors_async(competitors)
        _write_cached_competitor_profiles(cache_file, competitors, competitor_profiles)
        scrape_duration = (datetime.now(timezone.utc) - scrape_started).total_seconds()
        logger.info(
            "Scraped %s competitor profiles in %.2fs, cached.",
            len(competitor_profiles),
            scrape_duration,
        )

    # ── Step 3: Inject data into MCP server (in-process) ──────────────────────
    logger.info("Step 3: Loading data into agent context...")
    mcp_store.set_data(ranking_data, competitor_profiles)

    # ── Step 4: Run Claude agent ───────────────────────────────────────────────
    if skip_agent:
        logger.info("Step 4: Skipping Claude agent analysis (--skip-agent).")
        result = build_fast_analysis(
            ranking_data=ranking_data,
            competitor_profiles=competitor_profiles,
            ucar_name=UCAR_NAME,
        )
        result["analysis"]["notes"] = (
            str(result["analysis"].get("notes", ""))
            + " Agent step skipped for local pipeline test (--skip-agent)."
        ).strip()
    else:
        logger.info("Step 4: Running Claude agent analysis...")
        llm_result = await run_analysis(max_iterations=MAX_AGENT_ITERATIONS)
        fallback_result = build_fast_analysis(
            ranking_data=ranking_data,
            competitor_profiles=competitor_profiles,
            ucar_name=UCAR_NAME,
        )
        result = merge_analysis(llm_result, fallback_result)

    # ── Step 5: Save report ────────────────────────────────────────────────────
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    report_base = Path(REPORTS_DIR) / f"ucar_ranking_report_{timestamp}"

    # Full JSON report (for your UCAR dashboard to consume)
    full_report = {
        "meta": {
            "generated_at": result["generated_at"],
            "ucar_name": UCAR_NAME,
            "competitors_analyzed": len(competitor_profiles),
            "agent_iterations": result["iterations"],
            "ranking_file_updated": updated if 'updated' in dir() else None,
            "pipeline_duration_seconds": (datetime.now(timezone.utc) - pipeline_started).total_seconds(),
        },
        "ranking_snapshot": ranking_data,
        "competitor_profiles": competitor_profiles,
        "analysis": result["analysis"],
        "executive_summary": result["executive_summary"],
    }

    json_path = report_base.with_suffix(".json")
    json_path.write_text(json.dumps(full_report, indent=2, default=str))

    # Markdown report (human-readable)
    md_path = report_base.with_suffix(".md")
    _write_markdown_report(md_path, full_report)

    # Latest symlink / copy for the dashboard to always find
    latest_json = Path(REPORTS_DIR) / "latest_report.json"
    latest_json.write_text(json_path.read_text())

    logger.info(f"Reports saved: {json_path}, {md_path}")
    logger.info(f"Pipeline complete. Analysis has "
                f"{len(result['analysis'].get('critical_gaps', []))} critical gaps identified.")

    return full_report


async def run_pipeline(force_download: bool = False, skip_agent: bool = False) -> dict:
    if _PIPELINE_LOCK.locked():
        logger.warning("Pipeline already running. Waiting for lock to avoid MCP data races...")
    async with _PIPELINE_LOCK:
        return await _run_pipeline_impl(force_download=force_download, skip_agent=skip_agent)


def _write_markdown_report(path: Path, report: dict):
    analysis = report.get("analysis", {})
    meta     = report.get("meta", {})
    gaps     = analysis.get("critical_gaps", [])
    quick    = analysis.get("quick_wins", [])
    ucar_pos = analysis.get("ucar_current_position") or {}

    lines = [
        f"# UCAR Competitive Intelligence Report",
        f"**Generated:** {meta.get('generated_at', '')}  ",
        f"**Competitors Analyzed:** {meta.get('competitors_analyzed', 0)}  ",
        f"**Agent Iterations:** {meta.get('agent_iterations', 0)}",
        "",
        "---",
        "",
        "## UCAR Current Position",
        "",
    ]

    for k, v in ucar_pos.items():
        lines.append(f"- **{k}**: {v}")

    lines += [
        "",
        "---",
        "",
        f"## Competitor Summary",
        "",
        "| University | World Rank | Beats UCAR In |",
        "|------------|-----------|---------------|",
    ]
    for comp in analysis.get("competitor_summary", []):
        beats = ", ".join(comp.get("beats_ucar_in", [])) or "—"
        lines.append(f"| {comp.get('name', '')} | {comp.get('world_rank', '?')} | {beats} |")

    lines += [
        "",
        "---",
        "",
        f"## Critical Gaps & Action Plans",
        "",
    ]
    for gap in gaps:
        lines += [
            f"### {gap.get('rank', '?')}. {gap.get('dimension', '')} — {gap.get('gap_description', '')}",
            "",
            f"- **UCAR metric:** {gap.get('ucar_metric', 'N/A')}",
            f"- **Best competitor:** {gap.get('best_competitor_name', '')} ({gap.get('best_competitor_metric', 'N/A')})",
            f"- **Estimated rank improvement:** {gap.get('estimated_rank_improvement', 'TBD')}",
            "",
            "**Actions:**",
        ]
        for action in gap.get("actions", []):
            lines.append(f"  - [{action.get('effort','?').upper()} effort | "
                          f"{action.get('timeline','')} | "
                          f"Impact: {action.get('impact','')}] "
                          f"{action.get('action','')}")
        lines.append("")

    if quick:
        lines += ["---", "", "## Quick Wins (< 3 months)", ""]
        for qw in quick:
            lines.append(f"- **{qw.get('pillar_affected', '')}** "
                          f"({qw.get('timeline', '')}): {qw.get('action', '')}")

    lines += [
        "",
        "---",
        "",
        "## Executive Summary (French)",
        "",
        report.get("executive_summary", "_Not available._"),
    ]

    path.write_text("\n".join(lines), encoding="utf-8")


def run_daemon():
    """Run pipeline on a cron schedule using APScheduler."""
    try:
        from apscheduler.schedulers.blocking import BlockingScheduler
        from apscheduler.triggers.cron import CronTrigger
    except ImportError:
        logger.error("APScheduler not installed. Run: pip install apscheduler --break-system-packages")
        return

    # Parse cron string
    parts = CRON.split()
    if len(parts) == 5:
        minute, hour, day, month, day_of_week = parts
    else:
        minute, hour, day, month, day_of_week = "0", "6", "*", "*", "1"

    def job():
        asyncio.run(run_pipeline())

    scheduler = BlockingScheduler()
    scheduler.add_job(
        job,
        CronTrigger(minute=minute, hour=hour, day=day, month=month, day_of_week=day_of_week),
        id="ucar_ranking_analysis",
        name="UCAR Ranking Analysis",
    )
    logger.info(f"Scheduler started. Cron: {CRON}. Next run: {scheduler.get_jobs()[0].next_run_time}")
    # Run once immediately on start
    job()
    scheduler.start()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UCAR Ranking Intelligence Agent")
    parser.add_argument("--daemon", action="store_true", help="Run on schedule (APScheduler)")
    parser.add_argument("--force", action="store_true", help="Force re-download and re-scrape")
    parser.add_argument("--skip-agent", action="store_true",
                        help="Skip Anthropic analysis to test download/scrape/report pipeline")
    args = parser.parse_args()

    if args.daemon:
        run_daemon()
    else:
        result = asyncio.run(run_pipeline(force_download=args.force, skip_agent=args.skip_agent))
        print(f"\nDone. Critical gaps identified: {len(result.get('analysis', {}).get('critical_gaps', []))}")
        print(f"Reports saved to: {REPORTS_DIR}/")
