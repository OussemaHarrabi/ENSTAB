"""
mcp_server/ranking_mcp_server.py
──────────────────────────────────
MCP (Model Context Protocol) server that exposes tools to the Claude agent.
The agent calls these tools in its agentic loop to gather data,
do comparisons, and search the web.

Tools exposed:
  1. web_search            — Brave Search API (falls back to Serper)
  2. get_ranking_data      — Returns UCAR + competitor ranking positions
  3. get_competitor_profile— Returns scraped profile for one competitor
  4. compare_metrics       — Structured comparison: UCAR vs competitor
  5. get_ucar_kpis         — Pulls from your internal UCAR platform API
  6. list_competitors      — Returns the configured competitor list

Run this server with:
  python mcp_server/ranking_mcp_server.py

The agent (agent/ranking_agent.py) connects to it via stdio.
"""

import os
import json
import logging
import asyncio
from typing import Any

import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

logger = logging.getLogger(__name__)

# ── In-memory data store (populated by the orchestrator before agent runs) ────
_ranking_data: dict = {}        # output of RankingDownloader.parse()
_competitor_profiles: list = [] # output of scrape_all_competitors()

def set_data(ranking_data: dict, competitor_profiles: list):
    """Called by orchestrator to inject scraped data before agent starts."""
    global _ranking_data, _competitor_profiles
    _ranking_data = ranking_data
    _competitor_profiles = competitor_profiles


# ── Web search ─────────────────────────────────────────────────────────────────
async def _brave_search(query: str, count: int = 5) -> list[dict]:
    api_key = os.getenv("BRAVE_API_KEY", "")
    if not api_key:
        return []
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://api.search.brave.com/res/v1/web/search",
            headers={"Accept": "application/json", "X-Subscription-Token": api_key},
            params={"q": query, "count": count},
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        results = data.get("web", {}).get("results", [])
        return [{"title": x.get("title"), "url": x.get("url"),
                 "description": x.get("description")} for x in results]


async def _serper_search(query: str, count: int = 5) -> list[dict]:
    api_key = os.getenv("SERPER_API_KEY", "")
    if not api_key:
        return []
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://google.serper.dev/search",
            headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
            json={"q": query, "num": count},
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        results = data.get("organic", [])
        return [{"title": x.get("title"), "url": x.get("link"),
                 "description": x.get("snippet")} for x in results]


async def web_search_impl(query: str, count: int = 5) -> str:
    results = await _brave_search(query, count)
    if not results:
        results = await _serper_search(query, count)
    if not results:
        return json.dumps({"error": "No search API configured or both failed.",
                           "hint": "Set BRAVE_API_KEY or SERPER_API_KEY in .env"})
    return json.dumps(results, indent=2)


# ── Ranking tools ──────────────────────────────────────────────────────────────
def get_ranking_data_impl(university: str = "") -> str:
    if not _ranking_data:
        return json.dumps({"error": "Ranking data not loaded. Run orchestrator first."})

    if not university or university.lower() == "ucar":
        return json.dumps(_ranking_data.get("ucar", {}), default=str)

    # Search in competitors
    for c in _ranking_data.get("competitors", []):
        if university.lower() in str(c.get("name", "")).lower():
            return json.dumps(c, default=str)

    return json.dumps({"error": f"University '{university}' not found in ranking data."})


def get_competitor_profile_impl(university: str) -> str:
    if not _competitor_profiles:
        return json.dumps({"error": "Competitor profiles not loaded. Run orchestrator first."})

    for p in _competitor_profiles:
        if university.lower() in str(p.get("name", "")).lower():
            return json.dumps(p, default=str, indent=2)

    return json.dumps({"error": f"Profile for '{university}' not found.",
                       "available": [p.get("name") for p in _competitor_profiles]})


def compare_metrics_impl(competitor: str) -> str:
    """
    Structured side-by-side comparison of UCAR vs one competitor.
    Returns gaps (positive = we lead, negative = they lead).
    """
    ucar = _ranking_data.get("ucar", {})
    comp_rank = next(
        (c for c in _ranking_data.get("competitors", [])
         if competitor.lower() in str(c.get("name", "")).lower()),
        {}
    )
    comp_profile = next(
        (p for p in _competitor_profiles
         if competitor.lower() in str(p.get("name", "")).lower()),
        {}
    )

    def rank_gap(ucar_val, comp_val, label):
        """For ranks: lower is better. Negative gap = we are worse."""
        try:
            u, c = int(ucar_val), int(comp_val)
            return {"metric": label, "ucar": u, "competitor": c,
                    "gap": c - u,  # positive means we rank better (lower number)
                    "verdict": "UCAR leads" if c > u else "Competitor leads"}
        except (TypeError, ValueError):
            return {"metric": label, "ucar": ucar_val, "competitor": comp_val,
                    "gap": None, "verdict": "insufficient data"}

    def count_gap(ucar_val, comp_val, label):
        """For counts (papers, citations): higher is better."""
        try:
            u, c = int(ucar_val or 0), int(comp_val or 0)
            return {"metric": label, "ucar": u, "competitor": c,
                    "gap": u - c,  # positive means we lead
                    "verdict": "UCAR leads" if u > c else "Competitor leads"}
        except (TypeError, ValueError):
            return {"metric": label, "ucar": ucar_val, "competitor": comp_val,
                    "gap": None, "verdict": "insufficient data"}

    comparisons = [
        rank_gap(ucar.get("world_rank"), comp_rank.get("world_rank"), "World Rank"),
        rank_gap(ucar.get("presence"), comp_rank.get("presence"), "Presence Rank"),
        rank_gap(ucar.get("impact"), comp_rank.get("impact"), "Impact Rank"),
        rank_gap(ucar.get("openness"), comp_rank.get("openness"), "Openness Rank"),
        rank_gap(ucar.get("excellence"), comp_rank.get("excellence"), "Excellence Rank"),
        count_gap(None, comp_profile.get("openalex_works_count"),  # UCAR needs internal data
                  "Total Publications (OpenAlex)"),
        count_gap(None, comp_profile.get("openalex_cited_by_count"),
                  "Total Citations (OpenAlex)"),
        count_gap(None, comp_profile.get("openalex_h_index"),
                  "H-Index"),
    ]

    gaps_where_competitor_leads = [c for c in comparisons
                                    if c.get("verdict") == "Competitor leads"]

    return json.dumps({
        "ucar_name": ucar.get("name", "University of Carthage"),
        "competitor_name": comp_rank.get("name") or comp_profile.get("name") or competitor,
        "comparisons": comparisons,
        "competitor_leads_in": [c["metric"] for c in gaps_where_competitor_leads],
        "ucar_leads_in": [c["metric"] for c in comparisons
                          if c.get("verdict") == "UCAR leads"],
        "data_gaps": [c["metric"] for c in comparisons
                      if c.get("verdict") == "insufficient data"],
    }, indent=2, default=str)


def list_competitors_impl() -> str:
    names = [p.get("name") for p in _competitor_profiles]
    if not names:
        names = [c.get("name") for c in _ranking_data.get("competitors", [])]
    return json.dumps({"competitors": names, "count": len(names)})


async def get_ucar_kpis_impl(domain: str = "") -> str:
    """
    Fetch live KPIs from your existing UCAR platform API.
    The agent uses this to ground its analysis in actual institutional data.
    """
    base_url = os.getenv("UCAR_INTERNAL_API_URL", "")
    api_key  = os.getenv("UCAR_INTERNAL_API_KEY", "")

    if not base_url:
        # Return a structured placeholder so the agent knows what fields to expect
        return json.dumps({
            "note": "UCAR internal API not configured. Set UCAR_INTERNAL_API_URL in .env.",
            "expected_fields": {
                "research": ["publications_count", "citations_count", "active_grants",
                             "phd_students", "international_collaborations"],
                "academic": ["enrollment_total", "success_rate", "dropout_rate",
                             "student_staff_ratio", "international_students_pct"],
                "partnerships": ["active_mous", "erasmus_agreements", "mobility_outgoing",
                                 "mobility_incoming"],
                "employment": ["employability_rate_6mo", "time_to_first_job_avg"],
            }
        })

    endpoint = f"{base_url}/kpis/aggregate"
    if domain:
        endpoint += f"?domain={domain}"

    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                endpoint,
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=15,
            )
            r.raise_for_status()
            return r.text
    except Exception as e:
        return json.dumps({"error": str(e), "endpoint": endpoint})


# ── MCP Server definition ──────────────────────────────────────────────────────
server = Server("ucar-ranking-agent")


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="web_search",
            description=(
                "Search the web for current information about universities, rankings, "
                "research output, partnerships, or any topic needed for the analysis. "
                "Use specific queries like 'University of Sfax Scopus publications 2024' "
                "or 'Webometrics ranking Tunisia 2025 methodology'."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "count": {"type": "integer", "description": "Number of results (default 5)", "default": 5},
                },
                "required": ["query"],
            },
        ),
        types.Tool(
            name="get_ranking_data",
            description=(
                "Get ranking data from the downloaded Excel file. "
                "Pass 'ucar' or empty string for UCAR's data, "
                "or a competitor name to get their ranking row."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "university": {"type": "string", "description": "University name or 'ucar'", "default": "ucar"},
                },
            },
        ),
        types.Tool(
            name="get_competitor_profile",
            description=(
                "Get the full scraped profile for a competitor university. "
                "Includes OpenAlex research stats (publications, citations, h-index), "
                "Wikipedia info (founding year, student count), and homepage analysis."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "university": {"type": "string", "description": "Competitor university name"},
                },
                "required": ["university"],
            },
        ),
        types.Tool(
            name="compare_metrics",
            description=(
                "Get a structured side-by-side comparison of UCAR vs one competitor. "
                "Shows which metrics UCAR leads in, which it trails, and the size of each gap. "
                "Use this for every competitor to build a comprehensive gap analysis."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "competitor": {"type": "string", "description": "Competitor university name"},
                },
                "required": ["competitor"],
            },
        ),
        types.Tool(
            name="get_ucar_kpis",
            description=(
                "Get live KPI data from the UCAR internal platform. "
                "Provides research output, academic performance, partnership, "
                "and employability metrics directly from your database. "
                "Use domain= to filter: 'research', 'academic', 'partnerships', 'employment'."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "domain": {"type": "string", "description": "KPI domain filter (optional)", "default": ""},
                },
            },
        ),
        types.Tool(
            name="list_competitors",
            description="List all tracked competitor universities with their names.",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[types.TextContent]:
    result = ""
    try:
        if name == "web_search":
            result = await web_search_impl(arguments["query"], arguments.get("count", 5))
        elif name == "get_ranking_data":
            result = get_ranking_data_impl(arguments.get("university", "ucar"))
        elif name == "get_competitor_profile":
            result = get_competitor_profile_impl(arguments["university"])
        elif name == "compare_metrics":
            result = compare_metrics_impl(arguments["competitor"])
        elif name == "get_ucar_kpis":
            result = await get_ucar_kpis_impl(arguments.get("domain", ""))
        elif name == "list_competitors":
            result = list_competitors_impl()
        else:
            result = json.dumps({"error": f"Unknown tool: {name}"})
    except Exception as e:
        result = json.dumps({"error": str(e)})

    return [types.TextContent(type="text", text=result)]


async def run_server():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream,
                         server.create_initialization_options())


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_server())