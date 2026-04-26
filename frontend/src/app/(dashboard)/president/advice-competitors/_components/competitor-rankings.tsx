"use client"

import { Trophy, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import type { RankingCompetitor } from "../_lib/types"

interface CompetitorRankingsProps {
  competitors: RankingCompetitor[]
}

export function CompetitorRankings({ competitors }: CompetitorRankingsProps) {
  const sorted = [...competitors].sort((a, b) => {
    const rankA = a.world_rank ?? Infinity
    const rankB = b.world_rank ?? Infinity
    return rankA - rankB
  })

  const getPositionColor = (rank: number | null) => {
    if (rank === null || rank === undefined) return "bg-slate-50"
    if (rank <= 50) return "bg-green-50"
    if (rank <= 150) return "bg-blue-50"
    if (rank <= 300) return "bg-amber-50"
    return "bg-orange-50"
  }

  const getRankBadgeColor = (rank: number | null) => {
    if (rank === null || rank === undefined) return "text-slate-600"
    if (rank <= 50) return "text-green-700 font-bold"
    if (rank <= 150) return "text-blue-700"
    if (rank <= 300) return "text-amber-700"
    return "text-orange-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Trophy size={16} className="text-amber-600" />
          Top 10 Concurrents — Classements Webometrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sorted.map((comp, idx) => (
            <div
              key={comp.name}
              className={`flex items-center justify-between p-3 rounded-lg border border-slate-200 ${getPositionColor(comp.world_rank)}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{comp.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-500">{comp.country || "—"}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getRankBadgeColor(comp.world_rank)}`}>
                  {comp.world_rank ? `#${comp.world_rank}` : "N/A"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Webometrics</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
