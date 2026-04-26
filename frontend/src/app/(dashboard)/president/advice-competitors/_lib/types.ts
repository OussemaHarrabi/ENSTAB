export interface AdviceMeta {
  generated_at?: string
  ucar_name?: string
  competitors_analyzed?: number
  data_confidence?: "high" | "medium" | "low" | string
  notes?: string
}

export interface AdviceCompetitor {
  name: string
  world_rank?: number | null
  beats_ucar_in?: string[]
}

export interface AdviceAction {
  action: string
  effort?: string
  timeline?: string
  impact?: string
}

export interface AdviceGap {
  rank?: number
  dimension?: string
  gap_description?: string
  ucar_metric?: string | number | null
  best_competitor_metric?: string | number | null
  best_competitor_name?: string
  estimated_rank_improvement?: string
  actions?: AdviceAction[]
}

export interface AdviceAnalysis {
  ucar_current_position?: Record<string, unknown>
  competitor_summary?: AdviceCompetitor[]
  critical_gaps?: AdviceGap[]
  quick_wins?: { action?: string; timeline?: string; pillar_affected?: string }[]
  strategic_priorities?: string[]
  data_confidence?: string
  notes?: string
}

export interface RankingCompetitor {
  world_rank: number | null
  name: string
  country?: string
  presence?: number
  impact?: number
  openness?: number
  excellence?: number
}

export interface RankingSnapshot {
  ucar?: { name: string; world_rank: null | number; note?: string }
  competitors?: RankingCompetitor[]
  all_rows?: RankingCompetitor[]
}

export interface AdviceReport {
  meta?: AdviceMeta
  ranking_snapshot?: RankingSnapshot
  analysis?: AdviceAnalysis
  executive_summary?: string
}

export interface KpiComparatorRow {
  competitor: string
  kpi: string
  ucarValue: string
  competitorValue: string
  verdict: "Competitor leads" | "UCAR leads" | "Parity" | "Insufficient"
}
