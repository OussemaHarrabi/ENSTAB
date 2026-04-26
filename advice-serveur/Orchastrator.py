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
from pathlib import Path
from datetime import datetime, timezone

from dotenv import load_dotenv
load_dotenv()

from scraper.ranking_downloader import RankingDownloader
from scraper.competitor_scraper import scrape_all_competitors
from agent.ranking_agent import run_analysis
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

Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
Path(REPORTS_DIR).mkdir(parents=True, exist_ok=True)

# Default competitors if not configured
DEFAULT_COMPETITORS = [
    "University of Tunis El Manar",
    "University of Sfax",
    "University of Monastir",
    "University of Sousse",
    "University of Gabes",
    "Mohamed V University",
    "Alexandria University",
    "Annaba University",
    "Lebanese American University",
    "Cairo University",
]


async def run_pipeline(force_download: bool = False, skip_agent: bool = False) -> dict:
    """
    Full pipeline: download → scrape → analyze → save report.
    Returns the final analysis dict.
    """
    competitors = COMPETITORS[:] if COMPETITORS else []
    logger.info(f"Pipeline start. UCAR='{UCAR_NAME}', competitors_configured={len(competitors)}")

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

    # Use cached profiles if < 7 days old and not forcing
    if cache_file.exists() and not force_download:
        age_hours = (datetime.now(timezone.utc).timestamp() - cache_file.stat().st_mtime) / 3600
        if age_hours < 168:  # 7 days
            logger.info(f"Using cached competitor profiles ({age_hours:.1f}h old).")
            competitor_profiles = json.loads(cache_file.read_text())
        else:
            competitor_profiles = None
    else:
        competitor_profiles = None

    if competitor_profiles is None:
        competitor_profiles = scrape_all_competitors(competitors)
        cache_file.write_text(json.dumps(competitor_profiles, indent=2, default=str))
        logger.info(f"Scraped {len(competitor_profiles)} competitor profiles, cached.")

    # ── Step 3: Inject data into MCP server (in-process) ──────────────────────
    logger.info("Step 3: Loading data into agent context...")
    mcp_store.set_data(ranking_data, competitor_profiles)

    # ── Step 4: Run Claude agent ───────────────────────────────────────────────
    if skip_agent:
        logger.info("Step 4: Skipping Claude agent analysis (--skip-agent).")
        result = {
            "analysis": {
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "ucar_current_position": ranking_data.get("ucar", {}),
                "competitor_summary": [
                    {
                        "name": c.get("name"),
                        "world_rank": c.get("world_rank"),
                        "beats_ucar_in": [],
                    }
                    for c in ranking_data.get("competitors", [])
                ],
                "critical_gaps": [],
                "quick_wins": [],
                "strategic_priorities": [],
                "data_confidence": "low",
                "notes": "Agent step skipped for local pipeline test.",
            },
            "executive_summary": "Analyse IA ignorée pour ce test local (--skip-agent).",
            "iterations": 0,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
    else:
        logger.info("Step 4: Running Claude agent analysis...")
        result = await run_analysis(max_iterations=50)

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