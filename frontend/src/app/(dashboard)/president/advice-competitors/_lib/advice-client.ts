import type { AdviceGap, AdviceReport, KpiComparatorRow } from "./types"
import { mockAdviceReport } from "./mock-data"

const ADVICE_BASE_URL =
  process.env.NEXT_PUBLIC_ADVICE_SERVER_URL || "http://localhost:8001"
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_ADVICE_USE_MOCK === "true"

async function readJsonFromUrl(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Advice server unavailable (${res.status})`)
  }
  return res.json()
}

function toSafeString(v: unknown): string {
  if (v === null || v === undefined) return "—"
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—"
  if (typeof v === "string") return v.trim() || "—"
  return "—"
}

function normalizeGap(gap: AdviceGap): AdviceGap {
  const normalizedDimension = (gap.dimension || "").toUpperCase()
  const normalizedDescription = gap.gap_description || "Écart KPI identifié"
  return {
    ...gap,
    dimension: normalizedDimension,
    gap_description: normalizedDescription,
    actions: Array.isArray(gap.actions) ? gap.actions : [],
  }
}

function buildKpiComparatorRows(gaps: AdviceGap[]): KpiComparatorRow[] {
  return gaps.map((g) => {
    const ucarMetric = toSafeString(g.ucar_metric)
    const competitorMetric = toSafeString(g.best_competitor_metric)

    let verdict: KpiComparatorRow["verdict"] = "Insufficient"
    const ucarNum = Number(ucarMetric)
    const compNum = Number(competitorMetric)

    if (!Number.isNaN(ucarNum) && !Number.isNaN(compNum)) {
      if (compNum < ucarNum) verdict = "Competitor leads"
      else if (compNum > ucarNum) verdict = "UCAR leads"
      else verdict = "Parity"
    }

    return {
      competitor: g.best_competitor_name || "N/A",
      kpi: g.dimension || "KPI",
      ucarValue: ucarMetric,
      competitorValue: competitorMetric,
      verdict,
    }
  })
}

export async function fetchAdviceReport(): Promise<AdviceReport> {
  // If explicitly using mock data via env var
  if (USE_MOCK_DATA) {
    return { ...mockAdviceReport }
  }

  try {
    const report = (await readJsonFromUrl(
      `${ADVICE_BASE_URL}/reports/latest_report.json`
    )) as AdviceReport

    const rawGaps = report.analysis?.critical_gaps || []
    const normalizedGaps = rawGaps.map(normalizeGap)

    return {
      ...report,
      analysis: {
        ...report.analysis,
        critical_gaps: normalizedGaps,
      },
      meta: {
        ...report.meta,
        data_confidence: report.analysis?.data_confidence || report.meta?.data_confidence,
      },
    }
  } catch (err) {
    // Fallback to mock data if server is unavailable
    console.warn("Advice Server unavailable, using mock data:", err)
    const report = { ...mockAdviceReport }

    const rawGaps = report.analysis?.critical_gaps || []
    const normalizedGaps = rawGaps.map(normalizeGap)

    return {
      ...report,
      analysis: {
        ...report.analysis,
        critical_gaps: normalizedGaps,
      },
      meta: {
        ...report.meta,
        notes: (report.meta?.notes || "") + " [Mock data due to server unavailability]",
      },
    }
  }
}

export function extractKpiComparatorRows(report: AdviceReport): KpiComparatorRow[] {
  return buildKpiComparatorRows(report.analysis?.critical_gaps || [])
}

export function getTopCompetitors(report: AdviceReport, limit = 5) {
  const competitors = report.ranking_snapshot?.competitors || []
  return competitors.slice(0, limit)
}

export function getQuickWins(report: AdviceReport) {
  return report.analysis?.quick_wins || []
}

export function getStrategicPriorities(report: AdviceReport) {
  return report.analysis?.strategic_priorities || []
}
