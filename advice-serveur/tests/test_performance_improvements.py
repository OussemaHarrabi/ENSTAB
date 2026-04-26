import asyncio
import json
import unittest
from pathlib import Path
import tempfile

from agent.improvement_engine import build_fast_analysis, merge_analysis
from mcp_server import ranking_mcp_server
import orchestrator
from scraper.ranking_downloader import RankingDownloader


class ImprovementEngineTests(unittest.TestCase):
    def test_build_fast_analysis_produces_ranked_gaps_and_quick_wins(self):
        ranking_data = {
            "ucar": {
                "name": "University of Carthage",
                "world_rank": 1200,
                "presence": 1400,
                "impact": 1300,
                "openness": 1250,
                "excellence": 1450,
            },
            "competitors": [
                {
                    "name": "University A",
                    "world_rank": 950,
                    "presence": 900,
                    "impact": 980,
                    "openness": 1000,
                    "excellence": 920,
                }
            ],
        }
        competitor_profiles = [
            {
                "name": "University of Carthage",
                "homepage_has_english": False,
                "homepage_has_research_section": False,
            },
            {
                "name": "University A",
                "homepage_has_english": True,
                "homepage_has_research_section": True,
            }
        ]

        result = build_fast_analysis(ranking_data, competitor_profiles, "University of Carthage")
        analysis = result["analysis"]

        self.assertTrue(analysis["critical_gaps"])
        self.assertTrue(analysis["quick_wins"])
        self.assertIn("competitor_summary", analysis)
        self.assertGreaterEqual(len(analysis["competitor_summary"]), 1)

    def test_build_fast_analysis_does_not_suggest_when_competitors_are_weaker(self):
        ranking_data = {
            "ucar": {
                "name": "University of Carthage",
                "world_rank": 1200,
                "presence": 1400,
                "impact": 1300,
                "openness": 1250,
                "excellence": 1450,
            },
            "competitors": [
                {
                    "name": "University C",
                    "world_rank": 1500,
                    "presence": 1550,
                    "impact": 1510,
                    "openness": 1520,
                    "excellence": 1600,
                }
            ],
        }
        competitor_profiles = [
            {
                "name": "University of Carthage",
                "homepage_has_english": True,
                "homepage_has_research_section": True,
            },
            {
                "name": "University C",
                "homepage_has_english": False,
                "homepage_has_research_section": False,
            },
        ]

        result = build_fast_analysis(ranking_data, competitor_profiles, "University of Carthage")
        self.assertEqual(result["analysis"]["quick_wins"], [])

    def test_merge_analysis_fills_missing_sections(self):
        primary = {
            "analysis": {
                "critical_gaps": [],
                "quick_wins": [],
            },
            "executive_summary": "",
            "iterations": 4,
            "generated_at": "2026-01-01T00:00:00+00:00",
        }
        fallback = {
            "analysis": {
                "critical_gaps": [{"rank": 1}],
                "quick_wins": [{"action": "x"}],
                "strategic_priorities": ["p1"],
                "data_confidence": "medium",
            },
            "executive_summary": "fallback summary",
        }

        merged = merge_analysis(primary, fallback)
        self.assertEqual(merged["analysis"]["critical_gaps"], [{"rank": 1}])
        self.assertEqual(merged["analysis"]["quick_wins"], [{"action": "x"}])
        self.assertEqual(merged["executive_summary"], "fallback summary")


class McpServerMetricTests(unittest.TestCase):
    def setUp(self):
        ranking_mcp_server.set_data(
            {
                "ucar": {
                    "name": "University of Carthage",
                    "world_rank": 1100,
                    "presence": 1200,
                    "impact": 1300,
                    "openness": 1250,
                    "excellence": 1350,
                },
                "competitors": [
                    {
                        "name": "University B",
                        "world_rank": 900,
                        "presence": 950,
                        "impact": 980,
                        "openness": 1000,
                        "excellence": 920,
                    }
                ],
            },
            [
                {
                    "name": "University B",
                    "openalex_works_count": 9000,
                    "openalex_cited_by_count": 100000,
                    "openalex_h_index": 180,
                }
            ],
        )

    def test_compare_metrics_returns_weighted_gap_score(self):
        payload = ranking_mcp_server.compare_metrics_impl("University B")
        data = json.loads(payload)
        self.assertIn("weighted_gap_score", data)
        self.assertGreater(data["weighted_gap_score"], 0)


class McpSearchCacheTests(unittest.IsolatedAsyncioTestCase):
    async def test_web_search_uses_cache_for_repeated_query(self):
        original_brave = ranking_mcp_server._brave_search
        original_serper = ranking_mcp_server._serper_search
        original_searxng = ranking_mcp_server._searxng_search
        ranking_mcp_server._search_cache.clear()

        calls = {"brave": 0}

        async def fake_brave(query: str, count: int = 5):
            calls["brave"] += 1
            return [{"title": query, "url": "https://example.org", "description": "cached"}]

        async def fake_serper(query: str, count: int = 5):
            return []

        async def fake_searxng(query: str, count: int = 5):
            return []

        ranking_mcp_server._brave_search = fake_brave
        ranking_mcp_server._serper_search = fake_serper
        ranking_mcp_server._searxng_search = fake_searxng

        try:
            first = await ranking_mcp_server.web_search_impl("ucar improvements", 3)
            second = await ranking_mcp_server.web_search_impl("ucar improvements", 3)
        finally:
            ranking_mcp_server._brave_search = original_brave
            ranking_mcp_server._serper_search = original_serper
            ranking_mcp_server._searxng_search = original_searxng

        first_data = json.loads(first)
        second_data = json.loads(second)
        self.assertEqual(first_data, second_data)
        self.assertEqual(calls["brave"], 1)


class OrchestratorCacheTests(unittest.TestCase):
    def test_cache_loader_handles_corrupted_json(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            cache_file = Path(tmp_dir) / "competitor_profiles.json"
            cache_file.write_text("{broken-json", encoding="utf-8")

            loaded = orchestrator._load_cached_competitor_profiles(
                cache_file=cache_file,
                competitors=["University A"],
                max_age_hours=100,
            )
            self.assertIsNone(loaded)

    def test_cache_loader_invalidates_when_competitor_set_changes(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            cache_file = Path(tmp_dir) / "competitor_profiles.json"
            orchestrator._write_cached_competitor_profiles(
                cache_file=cache_file,
                competitors=["University A"],
                profiles=[{"name": "University A"}],
            )

            loaded = orchestrator._load_cached_competitor_profiles(
                cache_file=cache_file,
                competitors=["University B"],
                max_age_hours=100,
            )
            self.assertIsNone(loaded)

    def test_cache_loader_invalidates_empty_legacy_list(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            cache_file = Path(tmp_dir) / "competitor_profiles.json"
            cache_file.write_text("[]", encoding="utf-8")
            loaded = orchestrator._load_cached_competitor_profiles(
                cache_file=cache_file,
                competitors=["University A"],
                max_age_hours=100,
            )
            self.assertIsNone(loaded)

    def test_is_qs_like_url_detection(self):
        self.assertTrue(orchestrator._is_qs_like_url("https://www.topuniversities.com/arab-region-university-rankings"))
        self.assertTrue(orchestrator._is_qs_like_url("https://example.com/qs-export.xlsx"))
        self.assertFalse(orchestrator._is_qs_like_url("https://www.webometrics.info/sites/default/files/africa_ranking_25_01.xlsx"))


class RankingDownloaderQSTests(unittest.TestCase):
    def test_qs_header_detection(self):
        downloader = RankingDownloader(data_dir="./data", ucar_name="University of Carthage", competitors=[])
        parsed = downloader.parse(Path("data/ranking_latest.xlsx"))
        self.assertIn(parsed.get("source_format"), {"qs", "webometrics"})
        self.assertIn("columns_found", parsed)
        self.assertIsNotNone(parsed["columns_found"].get("name"))


if __name__ == "__main__":
    unittest.main()
