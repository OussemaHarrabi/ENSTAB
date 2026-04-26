"use client"

import { AlertCircle, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"
import { useState } from "react"
import type { AdviceGap } from "../_lib/types"

interface GapAnalysisProps {
  gaps: AdviceGap[]
}

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  const [expandedGap, setExpandedGap] = useState<number | null>(0)

  if (!gaps || gaps.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-500 italic">Aucun écart KPI identifié.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600" />
          Écarts Critiques détaillés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gaps.map((gap, idx) => (
          <div
            key={`${gap.dimension}-${idx}`}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedGap(expandedGap === idx ? null : idx)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-100 shrink-0">
                  <span className="text-xs font-bold text-red-700">{gap.rank ?? idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{gap.dimension}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">vs {gap.best_competitor_name || "concurrent"}</p>
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform shrink-0 ml-2 ${expandedGap === idx ? "rotate-180" : ""}`}
              />
            </button>

            {expandedGap === idx && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Description</p>
                  <p className="text-sm text-slate-700">{gap.gap_description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">UCAR</p>
                    <p className="text-lg font-bold text-slate-900">
                      {typeof gap.ucar_metric === "number" ? gap.ucar_metric : gap.ucar_metric || "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">{gap.best_competitor_name}</p>
                    <p className="text-lg font-bold text-blue-600">
                      {typeof gap.best_competitor_metric === "number"
                        ? gap.best_competitor_metric
                        : gap.best_competitor_metric || "—"}
                    </p>
                  </div>
                </div>

                {gap.estimated_rank_improvement && (
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Gain estimé</p>
                    <p className="text-sm text-green-900">{gap.estimated_rank_improvement}</p>
                  </div>
                )}

                {gap.actions && gap.actions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Actions recommandées</p>
                    <ul className="space-y-2">
                      {gap.actions.map((action, actionIdx) => (
                        <li key={actionIdx} className="flex gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-slate-900 leading-relaxed">{action.action}</p>
                            {(action.timeline || action.effort || action.impact) && (
                              <p className="text-xs text-slate-500 mt-1">
                                <span>{action.effort}</span>
                                {action.effort && action.timeline && <span> • </span>}
                                <span>{action.timeline}</span>
                                {(action.effort || action.timeline) && action.impact && <span> • </span>}
                                <span>{action.impact}</span>
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
