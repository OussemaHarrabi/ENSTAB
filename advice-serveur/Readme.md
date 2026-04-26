# UCAR Ranking Intelligence Agent
## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        UCAR RANKING AGENT                           │
│                                                                     │
│  1. TRIGGER (Cron / Webhook / Manual)                               │
│         ↓                                                           │
│  2. RANKING SCRAPER                                                 │
│     • Downloads Excel from ranking portal (Webometrics/QS/THE)     │
│     • Parses University of Carthage current position                │
│         ↓                                                           │
│  3. COMPETITORS SCRAPER (10 universities)                           │
│     • Scrapes each competitor's public profile                      │
│     • Collects: publications, citations, web presence, patents,     │
│       international links, alumni data, research output             │
│         ↓                                                           │
│  4. MCP SERVER (tools exposed to the agent)                         │
│     • web_search(query) → Brave/Serper API                         │
│     • get_ranking_data(university) → parsed Excel                   │
│     • get_competitor_profile(university) → scraped data             │
│     • compare_metrics(us, them) → diff analysis                    │
│     • get_ucar_internal_data() → from your UCAR platform KPIs      │
│         ↓                                                           │
│  5. CLAUDE AGENT (claude-sonnet via Anthropic API)                 │
│     • Uses MCP tools in agentic loop                               │
│     • Deep analysis: WHERE are we losing? WHY?                     │
│     • Generates structured action plan                             │
│         ↓                                                           │
│  6. REPORT GENERATOR                                                │
│     • Markdown + PDF report                                        │
│     • Dashboard JSON for your UCAR frontend                        │
│     • Stored in /reports with timestamp                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Required API Keys (set in .env)

| Key | Purpose | Where to get |
|-----|---------|--------------|
| `ANTHROPIC_API_KEY` | Claude agent (analysis) | console.anthropic.com |
| `BRAVE_API_KEY` | Web search for agent | api.search.brave.com (free tier: 2000/mo) |
| `SERPER_API_KEY` | Fallback web search | serper.dev ($50/mo for 50K queries) |

## Ranking Sources Supported

- **Webometrics** (free, Excel download, updates monthly) — recommended for Tunisia
- **QS World Rankings** (requires scraping their public pages)
- **THE (Times Higher Education)** (public data available)
- **URAP** (University Ranking by Academic Performance — free Excel)

## Competitors Tracked (default — configurable)

1. Université de Tunis El Manar
2. Université de Sfax
3. Université de Monastir  
4. Université de Sousse
5. Université de Gabès
6. Université d'Annaba (Algeria)
7. Université Mohamed V (Morocco)
8. Alexandria University (Egypt)
9. Université de Bordeaux (France — aspirational benchmark)
10. Lebanese American University

## Dependencies and Entrypoint

This backend is self-contained in the `improvements server` folder.

1. Install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Configure environment:

- Copy `.env.example` to `.env`
- Fill API keys and overrides if needed (`UCAR_NAME`, `COMPETITORS`, `WEBOMETRICS_EXCEL_URL`, etc.)

3. Main entrypoint:

```bash
python orchestrator.py
```

Useful flags:

- `python orchestrator.py --force` to force refresh ranking and competitor data
- `python orchestrator.py --skip-agent` to run the scraping/report pipeline without Anthropic analysis
- `python orchestrator.py --daemon` to run scheduled jobs (APScheduler)

## Push-Safe Notes

To keep commits clean and easy to push/merge, this folder now has its own `.gitignore` that excludes:

- virtual environments (`venv`, `.venv`)
- cache/log files
- generated ranking and report artifacts in `data/` and `reports/`

Code, tests, and config stay versioned; machine-specific dependencies and generated outputs do not.