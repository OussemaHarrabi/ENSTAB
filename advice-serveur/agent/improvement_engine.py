"""
agent/improvement_engine.py
───────────────────────────
Deterministic, fast improvement-suggestion engine.

This complements LLM analysis with a stable baseline so the pipeline can still
produce actionable recommendations quickly, even when model/tool calls are slow
or partially incomplete.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


PILLAR_WEIGHTS: dict[str, float] = {
    "presence": 0.20,
    "impact": 0.40,
    "openness": 0.20,
    "excellence": 0.20,
}


def _to_int(value: Any) -> int | None:
    try:
        if value is None:
            return None
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _safe_name(value: Any) -> str:
    text = str(value or "").strip()
    return text or "Unknown"


def _find_profile(profiles: list[dict[str, Any]], competitor_name: str) -> dict[str, Any]:
    target = competitor_name.lower()
    for profile in profiles:
        name = _safe_name(profile.get("name")).lower()
        if target in name or name in target:
            return profile
    return {}


def _find_ucar_profile(profiles: list[dict[str, Any]], ucar_name: str) -> dict[str, Any]:
    target = _safe_name(ucar_name).lower()
    for profile in profiles:
        name = _safe_name(profile.get("name")).lower()
        if target in name or name in target or "carthage" in name:
            return profile
    return {}


def _timeline_for_severity(severity: float) -> str:
    if severity >= 0.75:
        return "6-12 months"
    if severity >= 0.40:
        return "3-6 months"
    return "1-3 months"


def _impact_for_severity(severity: float) -> str:
    if severity >= 0.75:
        return "high"
    if severity >= 0.35:
        return "medium"
    return "low"


def _effort_for_severity(severity: float) -> str:
    if severity >= 0.75:
        return "high"
    if severity >= 0.35:
        return "medium"
    return "low"


def _estimate_rank_gain(total_gap_score: float) -> str:
    if total_gap_score >= 2.2:
        return "Potential 120-200 places over 12-18 months"
    if total_gap_score >= 1.4:
        return "Potential 60-120 places over 9-12 months"
    if total_gap_score >= 0.8:
        return "Potential 30-60 places over 6-9 months"
    return "Potential 10-30 places over 3-6 months"


def build_fast_analysis(
    ranking_data: dict[str, Any],
    competitor_profiles: list[dict[str, Any]],
    ucar_name: str,
) -> dict[str, Any]:
    """Build a deterministic analysis payload matching the report schema."""
    ucar = ranking_data.get("ucar") or {"name": ucar_name}
    competitors = ranking_data.get("competitors") or []

    ucar_world_rank = _to_int(ucar.get("world_rank"))
    comparator_rows: list[dict[str, Any]] = []
    critical_gaps: list[dict[str, Any]] = []

    pillar_gap_accumulator: dict[str, float] = {"presence": 0.0, "impact": 0.0, "openness": 0.0, "excellence": 0.0}
    pillar_best_metric: dict[str, tuple[str, int]] = {}

    competitor_has_rank_data = False
    for competitor in competitors:
        competitor_name = _safe_name(competitor.get("name"))
        beats_ucar_in: list[str] = []

        comp_world_rank = _to_int(competitor.get("world_rank"))
        if comp_world_rank is not None:
            competitor_has_rank_data = True

        for pillar in ["presence", "impact", "openness", "excellence"]:
            ucar_metric = _to_int(ucar.get(pillar))
            competitor_metric = _to_int(competitor.get(pillar))
            if ucar_metric is None or competitor_metric is None:
                continue

            # Lower rank is better in Webometrics ranking columns.
            if competitor_metric < ucar_metric:
                beats_ucar_in.append(f"{pillar.title()} Rank")
                relative_gap = max(0.0, (ucar_metric - competitor_metric) / max(ucar_metric, 1))
                pillar_gap_accumulator[pillar] += relative_gap * PILLAR_WEIGHTS[pillar]

            best = pillar_best_metric.get(pillar)
            if best is None or competitor_metric < best[1]:
                pillar_best_metric[pillar] = (competitor_name, competitor_metric)

        comparator_rows.append(
            {
                "name": competitor_name,
                "world_rank": competitor.get("world_rank"),
                "beats_ucar_in": beats_ucar_in,
            }
        )

    sorted_pillars = sorted(pillar_gap_accumulator.items(), key=lambda item: item[1], reverse=True)
    for index, (pillar, score) in enumerate(sorted_pillars, start=1):
        if score <= 0:
            continue

        best_competitor_name, best_competitor_metric = pillar_best_metric.get(pillar, ("N/A", -1))
        severity = min(1.0, score)
        critical_gaps.append(
            {
                "rank": index,
                "dimension": pillar.upper(),
                "gap_description": (
                    f"UCAR underperforms on {pillar} compared with top regional competitors; "
                    f"this is reducing relative ranking momentum."
                ),
                "ucar_metric": ucar.get(pillar),
                "best_competitor_metric": best_competitor_metric if best_competitor_metric >= 0 else "N/A",
                "best_competitor_name": best_competitor_name,
                "estimated_rank_improvement": _estimate_rank_gain(score),
                "actions": [
                    {
                        "action": (
                            "Launch a pillar-focused 90-day sprint with weekly KPI tracking, "
                            "owned by rectorate + digital + research office."
                        ),
                        "effort": _effort_for_severity(severity),
                        "timeline": _timeline_for_severity(severity),
                        "impact": _impact_for_severity(severity),
                    },
                    {
                        "action": (
                            f"Benchmark {best_competitor_name} monthly on {pillar} and replicate the top 2 publicly-observable tactics."
                        ),
                        "effort": "medium",
                        "timeline": "1-3 months",
                        "impact": _impact_for_severity(severity),
                    },
                ],
            }
        )

    # If UCAR row is absent in the ranking source, still provide inferred priorities
    # from top competitors so the report stays actionable instead of empty.
    if ucar_world_rank is None and not critical_gaps:
        top_competitors = sorted(
            [c for c in competitors if _to_int(c.get("world_rank")) is not None],
            key=lambda c: int(_to_int(c.get("world_rank")) or 10**9),
        )[:5]
        inferred_pillars = ["presence", "impact", "openness", "excellence"]
        for rank, pillar in enumerate(inferred_pillars, start=1):
            best_name = "N/A"
            best_metric: Any = "N/A"
            for comp in top_competitors:
                value = _to_int(comp.get(pillar))
                if value is None:
                    continue
                if best_metric == "N/A" or value < int(best_metric):
                    best_metric = value
                    best_name = _safe_name(comp.get("name"))

            critical_gaps.append(
                {
                    "rank": rank,
                    "dimension": pillar.upper(),
                    "gap_description": (
                        "UCAR row is missing in the selected ranking source. "
                        "Priority inferred from top competitors in this ranking edition."
                    ),
                    "ucar_metric": "unknown (missing in source)",
                    "best_competitor_metric": best_metric,
                    "best_competitor_name": best_name,
                    "estimated_rank_improvement": "Unavailable until UCAR appears in the ranking source",
                    "actions": [
                        {
                            "action": f"Run a 60-day benchmark sprint on {pillar} using {best_name} as reference.",
                            "effort": "medium",
                            "timeline": "1-3 months",
                            "impact": "medium",
                        }
                    ],
                }
            )

    # Profile-driven quick wins.
    # We benchmark against competitors and only recommend when UCAR likely lags.
    quick_wins: list[dict[str, Any]] = []
    competitor_with_english = 0
    competitor_with_research = 0

    for competitor in competitors:
        competitor_name = _safe_name(competitor.get("name"))
        profile = _find_profile(competitor_profiles, competitor_name)
        if not profile:
            continue
        if profile.get("homepage_has_english", False):
            competitor_with_english += 1
        if profile.get("homepage_has_research_section", False):
            competitor_with_research += 1

    ucar_profile = _find_ucar_profile(competitor_profiles, ucar_name)
    ucar_has_english = bool(ucar_profile.get("homepage_has_english")) if ucar_profile else False
    ucar_has_research = bool(ucar_profile.get("homepage_has_research_section")) if ucar_profile else False

    if competitor_with_english > 0 and not ucar_has_english:
        quick_wins.append(
            {
                "action": "Publish and maintain English program/research landing pages for all faculties.",
                "timeline": "1-2 months",
                "pillar_affected": "PRESENCE",
            }
        )
    if competitor_with_research > 0 and not ucar_has_research:
        quick_wins.append(
            {
                "action": "Add a unified research portal linking labs, publications, and datasets.",
                "timeline": "1-3 months",
                "pillar_affected": "EXCELLENCE",
            }
        )

    # Deduplicate quick wins by action text.
    dedup_quick_wins: list[dict[str, Any]] = []
    seen_actions: set[str] = set()
    for item in quick_wins:
        key = str(item.get("action", "")).strip().lower()
        if key and key not in seen_actions:
            seen_actions.add(key)
            dedup_quick_wins.append(item)

    strategic_priorities = [
        "Institutionalize monthly competitor benchmarking with KPI deltas by pillar.",
        "Increase open-access publication visibility via repository and faculty profile hygiene.",
        "Improve international discoverability through bilingual content and partnerships visibility.",
    ]

    if ucar_world_rank is None:
        strategic_priorities.insert(
            0,
            "Stabilize ranking-source mapping first: UCAR is not currently matched in the selected ranking file, so strategy confidence is degraded.",
        )

    available_cells = 0
    known_cells = 0
    for row in [ucar, *competitors]:
        for pillar in ["presence", "impact", "openness", "excellence", "world_rank"]:
            available_cells += 1
            if _to_int(row.get(pillar)) is not None:
                known_cells += 1
    coverage = known_cells / max(available_cells, 1)
    if coverage >= 0.8:
        confidence = "high"
    elif coverage >= 0.5:
        confidence = "medium"
    else:
        confidence = "low"

    executive_summary = (
        "UCAR présente des écarts mesurables sur les piliers Webometrics clés, en particulier là où les concurrents "
        "affichent une meilleure visibilité numérique et une structuration plus forte des preuves de recherche. "
        "La priorité est de traiter rapidement les leviers à effet direct sur la présence, l’impact et l’ouverture.\n\n"
        "Le plan proposé combine des quick wins (contenu anglais, portail recherche, gouvernance KPI hebdomadaire) "
        "et des chantiers structurants sur 6 à 12 mois. Cette stratégie vise une amélioration progressive mais durable "
        "du positionnement international de l’Université de Carthage."
    )

    if ucar_world_rank is None or not competitor_has_rank_data:
        confidence = "low"

    notes = "Generated via deterministic fallback engine for speed and reliability."
    if ucar_world_rank is None:
        notes += (
            " UCAR row was not found in the ranking snapshot; verify UCAR_NAME aliases or ranking source format."
        )
    if competitors and not competitor_has_rank_data:
        notes += " Competitor rank metrics are mostly missing in ranking snapshot; report quality is constrained."

    return {
        "analysis": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "ucar_current_position": ucar,
            "competitor_summary": comparator_rows,
            "critical_gaps": critical_gaps[:8],
            "quick_wins": dedup_quick_wins[:8],
            "strategic_priorities": strategic_priorities,
            "data_confidence": confidence,
            "notes": notes,
        },
        "executive_summary": executive_summary,
        "iterations": 0,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def merge_analysis(primary: dict[str, Any], fallback: dict[str, Any]) -> dict[str, Any]:
    """Merge primary LLM analysis with deterministic fallback for completeness."""
    merged = dict(primary)
    primary_analysis = dict(primary.get("analysis") or {})
    fallback_analysis = dict(fallback.get("analysis") or {})

    for key in [
        "ucar_current_position",
        "competitor_summary",
        "critical_gaps",
        "quick_wins",
        "strategic_priorities",
        "data_confidence",
        "notes",
    ]:
        primary_value = primary_analysis.get(key)
        if primary_value in (None, "", [], {}):
            primary_analysis[key] = fallback_analysis.get(key)

    if not primary.get("executive_summary"):
        merged["executive_summary"] = fallback.get("executive_summary", "")

    merged["analysis"] = primary_analysis
    return merged
