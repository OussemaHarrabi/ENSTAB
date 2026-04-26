"""
agent/ranking_agent.py
───────────────────────
The Claude agent that performs deep competitive analysis.
"""

import os
import json
import logging
import asyncio
from datetime import datetime, timezone
from typing import Any

try:
	import anthropic
except Exception:
	anthropic = None

try:
	from groq import Groq
except Exception:
	Groq = None

# Import MCP tool implementations directly (in-process)
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from mcp_server.ranking_mcp_server import (
	web_search_impl, get_ranking_data_impl, get_competitor_profile_impl,
	compare_metrics_impl, get_ucar_kpis_impl, list_competitors_impl
)

logger = logging.getLogger(__name__)

AGENT_PROVIDER = os.getenv("AGENT_PROVIDER", "anthropic").strip().lower()
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = """You are the UCAR Competitive Intelligence Agent — an expert analyst for the University of Carthage (Tunisia) tasked with helping it climb international rankings.

## Your Mission
Perform a comprehensive competitive analysis comparing UCAR against its tracked competitors. Identify EVERY area where competitors outperform UCAR, quantify the gaps, and propose concrete action plans.

## Ranking Dimensions You Must Analyze
Webometrics measures 4 pillars — analyze each:
1. **PRESENCE** (Web visibility): Website size, richness, pages indexed by Google
2. **IMPACT** (Web impact): External links received (academic citation proxy)
3. **OPENNESS** (Open access): Google Scholar profiles, open access papers, repositories
4. **EXCELLENCE** (Research output): Papers in top 10% most cited journals (Scimago)

Beyond Webometrics, analyze:
5. **Research output**: Total publications, citations, h-index (OpenAlex data)
6. **International presence**: English content, Erasmus agreements, joint programs
7. **Digital infrastructure**: Website quality, repository presence (DSPACE/ZENODO)
8. **Alumni & employability**: Career outcomes data visibility

## Analysis Protocol — Follow This Exactly

### Step 1: Get the full competitor list
Call list_competitors to know who you're analyzing.

### Step 2: Get UCAR's baseline
Call get_ranking_data("ucar") and get_ucar_kpis() to understand UCAR's current position.

### Step 3: For EACH competitor (all 10)
a) Call compare_metrics(competitor_name) for the structured gap analysis
b) Call get_competitor_profile(competitor_name) for research & homepage data
c) Call web_search for 1-2 specific searches per competitor if you need more depth
   Examples: "University X Scopus 2024 publications", "University X ranking improvement strategy"

### Step 4: Cross-cutting web searches
Search for:
- "Webometrics ranking methodology presence impact openness excellence improvement tips"
- "Tunisian universities international ranking strategies"
- "How to improve university web presence Webometrics"
- "Open access repositories university ranking impact"

### Step 5: Synthesis
Identify the top 5-8 highest-ROI interventions UCAR can make, ranked by:
- Size of gap vs competitors
- Ease/speed of implementation
- Impact on ranking score

## Output Format
At the end of your analysis, output a structured JSON block between <ANALYSIS_JSON> and </ANALYSIS_JSON> tags containing:

{
  "generated_at": "ISO timestamp",
  "ucar_current_position": { ... },
  "competitor_summary": [ { "name": ..., "world_rank": ..., "beats_ucar_in": [...] } ],
  "critical_gaps": [
	{
	  "rank": 1,
	  "dimension": "OPENNESS",
	  "gap_description": "...",
	  "ucar_metric": ...,
	  "best_competitor_metric": ...,
	  "best_competitor_name": "...",
	  "estimated_rank_improvement": "...",
	  "actions": [
		{ "action": "...", "effort": "low|medium|high", "timeline": "1-3 months", "impact": "high" }
	  ]
	}
  ],
  "quick_wins": [ { "action": "...", "timeline": "...", "pillar_affected": "..." } ],
  "strategic_priorities": [ "..." ],
  "data_confidence": "high|medium|low",
  "notes": "..."
}

After the JSON, write a clear executive summary in French (2-3 paragraphs) for the UCAR administration.
"""


async def _call_tool(tool_name: str, tool_input: dict) -> str:
	"""Route tool calls to in-process implementations."""
	try:
		if tool_name == "web_search":
			return await web_search_impl(tool_input["query"], tool_input.get("count", 5))
		if tool_name == "get_ranking_data":
			return get_ranking_data_impl(tool_input.get("university", "ucar"))
		if tool_name == "get_competitor_profile":
			return get_competitor_profile_impl(tool_input["university"])
		if tool_name == "compare_metrics":
			return compare_metrics_impl(tool_input["competitor"])
		if tool_name == "get_ucar_kpis":
			return await get_ucar_kpis_impl(tool_input.get("domain", ""))
		if tool_name == "list_competitors":
			return list_competitors_impl()
		return json.dumps({"error": f"Unknown tool: {tool_name}"})
	except Exception as e:
		return json.dumps({"error": str(e), "tool": tool_name, "input": tool_input})


def _build_tools_schema() -> list[dict]:
	return [
		{
			"name": "web_search",
			"description": "Search the web for current information about universities, rankings, research output, and improvement strategies.",
			"input_schema": {
				"type": "object",
				"properties": {
					"query": {"type": "string"},
					"count": {"type": "integer", "default": 5},
				},
				"required": ["query"],
			},
		},
		{
			"name": "get_ranking_data",
			"description": "Get ranking Excel data for UCAR or a competitor. Pass 'ucar' for UCAR's row.",
			"input_schema": {
				"type": "object",
				"properties": {"university": {"type": "string", "default": "ucar"}},
			},
		},
		{
			"name": "get_competitor_profile",
			"description": "Get full scraped profile (OpenAlex research stats, Wikipedia info, homepage analysis) for a competitor.",
			"input_schema": {
				"type": "object",
				"properties": {"university": {"type": "string"}},
				"required": ["university"],
			},
		},
		{
			"name": "compare_metrics",
			"description": "Structured UCAR vs competitor comparison. Shows all metric gaps and who leads in each.",
			"input_schema": {
				"type": "object",
				"properties": {"competitor": {"type": "string"}},
				"required": ["competitor"],
			},
		},
		{
			"name": "get_ucar_kpis",
			"description": "Get live KPI data from the UCAR internal platform.",
			"input_schema": {
				"type": "object",
				"properties": {"domain": {"type": "string", "default": ""}},
			},
		},
		{
			"name": "list_competitors",
			"description": "List all tracked competitors.",
			"input_schema": {"type": "object", "properties": {}},
		},
	]


def _build_groq_tools_schema() -> list[dict]:
	"""Convert Anthropic tool schema to OpenAI-compatible function tool schema for Groq."""
	out = []
	for t in _build_tools_schema():
		out.append(
			{
				"type": "function",
				"function": {
					"name": t["name"],
					"description": t.get("description", ""),
					"parameters": t.get("input_schema", {"type": "object", "properties": {}}),
				},
			}
		)
	return out


def _extract_analysis_output(final_text: str) -> tuple[dict, str]:
	analysis_json = {}
	if "<ANALYSIS_JSON>" in final_text and "</ANALYSIS_JSON>" in final_text:
		try:
			json_str = final_text.split("<ANALYSIS_JSON>")[1].split("</ANALYSIS_JSON>")[0].strip()
			analysis_json = json.loads(json_str)
		except Exception as e:
			logger.error(f"Failed to parse analysis JSON: {e}")

	executive_summary = ""
	if "</ANALYSIS_JSON>" in final_text:
		executive_summary = final_text.split("</ANALYSIS_JSON>")[-1].strip()
	return analysis_json, executive_summary


async def _run_anthropic_analysis(max_iterations: int) -> dict:
	if anthropic is None:
		raise RuntimeError("anthropic package not installed. Install dependencies first.")
	api_key = os.getenv("ANTHROPIC_API_KEY", "")
	if not api_key:
		raise RuntimeError("ANTHROPIC_API_KEY is missing in .env")

	client = anthropic.Anthropic(api_key=api_key)
	tools = _build_tools_schema()
	messages = [
		{
			"role": "user",
			"content": (
				"Please perform the complete competitive analysis for the University of Carthage. "
				"Follow the protocol in your system prompt exactly — analyze all competitors, "
				"identify all gaps, and produce the full structured output with action plan. "
				"Be thorough and specific."
			),
		}
	]

	full_transcript = []
	iterations = 0
	final_text = ""
	logger.info("Starting Anthropic agentic analysis loop...")

	while iterations < max_iterations:
		iterations += 1
		response = client.messages.create(
			model=ANTHROPIC_MODEL,
			max_tokens=8096,
			system=SYSTEM_PROMPT,
			tools=tools,
			messages=messages,
		)

		messages.append({"role": "assistant", "content": response.content})
		for block in response.content:
			if hasattr(block, "text") and block.text:
				final_text += block.text
				full_transcript.append(
					{
						"type": "text",
						"content": block.text[:500] + "..." if len(block.text) > 500 else block.text,
					}
				)

		if response.stop_reason == "end_turn":
			break
		if response.stop_reason != "tool_use":
			logger.info(f"Anthropic agent stopped with reason: {response.stop_reason}")
			break

		tool_results = []
		for block in response.content:
			if block.type == "tool_use":
				result = await _call_tool(block.name, block.input)
				tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})
				full_transcript.append(
					{
						"type": "tool_call",
						"tool": block.name,
						"input": block.input,
						"result_preview": result[:300] + "..." if len(result) > 300 else result,
					}
				)
		if tool_results:
			messages.append({"role": "user", "content": tool_results})

	analysis_json, executive_summary = _extract_analysis_output(final_text)
	return {
		"analysis": analysis_json,
		"executive_summary": executive_summary,
		"full_narrative": final_text,
		"transcript": full_transcript,
		"iterations": iterations,
		"generated_at": datetime.now(timezone.utc).isoformat(),
		"provider": "anthropic",
		"model": ANTHROPIC_MODEL,
	}


async def _run_groq_analysis(max_iterations: int) -> dict:
	if Groq is None:
		raise RuntimeError("groq package not installed. Install dependencies first.")
	api_key = os.getenv("GROQ_API_KEY", "")
	if not api_key:
		raise RuntimeError("GROQ_API_KEY is missing in .env")

	client = Groq(api_key=api_key)
	tools = _build_groq_tools_schema()
	messages: list[dict[str, Any]] = [
		{"role": "system", "content": SYSTEM_PROMPT},
		{
			"role": "user",
			"content": (
				"Please perform the complete competitive analysis for the University of Carthage. "
				"Follow the protocol in your system prompt exactly — analyze all competitors, "
				"identify all gaps, and produce the full structured output with action plan. "
				"Be thorough and specific."
			),
		},
	]

	full_transcript = []
	iterations = 0
	final_text = ""
	logger.info("Starting Groq agentic analysis loop...")

	while iterations < max_iterations:
		iterations += 1
		response = client.chat.completions.create(
			model=GROQ_MODEL,
			messages=messages,
			tools=tools,
			tool_choice="auto",
			max_tokens=4096,
			temperature=0.2,
		)

		message = response.choices[0].message
		assistant_text = message.content or ""
		if assistant_text:
			final_text += assistant_text
			full_transcript.append(
				{
					"type": "text",
					"content": assistant_text[:500] + "..." if len(assistant_text) > 500 else assistant_text,
				}
			)

		tool_calls = message.tool_calls or []
		if not tool_calls:
			break

		normalized_tool_calls = []
		for tc in tool_calls:
			normalized_tool_calls.append(
				{
					"id": tc.id,
					"type": "function",
					"function": {
						"name": tc.function.name,
						"arguments": tc.function.arguments or "{}",
					},
				}
			)
		messages.append(
			{
				"role": "assistant",
				"content": assistant_text,
				"tool_calls": normalized_tool_calls,
			}
		)

		for tc in tool_calls:
			name = tc.function.name
			try:
				tool_input = json.loads(tc.function.arguments or "{}")
			except json.JSONDecodeError:
				tool_input = {}
			result = await _call_tool(name, tool_input)
			messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})
			full_transcript.append(
				{
					"type": "tool_call",
					"tool": name,
					"input": tool_input,
					"result_preview": result[:300] + "..." if len(result) > 300 else result,
				}
			)

	analysis_json, executive_summary = _extract_analysis_output(final_text)
	return {
		"analysis": analysis_json,
		"executive_summary": executive_summary,
		"full_narrative": final_text,
		"transcript": full_transcript,
		"iterations": iterations,
		"generated_at": datetime.now(timezone.utc).isoformat(),
		"provider": "groq",
		"model": GROQ_MODEL,
	}


async def run_analysis(max_iterations: int = 40) -> dict:
	"""Run the full agentic analysis loop with the configured provider."""
	provider = AGENT_PROVIDER
	if provider == "groq":
		return await _run_groq_analysis(max_iterations=max_iterations)
	if provider == "anthropic":
		return await _run_anthropic_analysis(max_iterations=max_iterations)
	raise RuntimeError(
		"Unsupported AGENT_PROVIDER. Use 'groq' or 'anthropic'. "
		f"Current value: '{provider}'"
	)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = asyncio.run(run_analysis())
    print(json.dumps(result["analysis"], indent=2, default=str))
    print("\n--- EXECUTIVE SUMMARY ---")
    print(result["executive_summary"])
