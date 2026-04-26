"use client"

import { Lightbulb, Zap, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"

interface StrategicAdviceProps {
  priorities: string[]
  quickWins: { action?: string; timeline?: string; pillar_affected?: string }[]
}

export function StrategicAdvice({ priorities, quickWins }: StrategicAdviceProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Zap size={16} className="text-yellow-600" />
            Quick Wins (6-12 semaines)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quickWins.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Aucun quick win identifié pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-3">
              {quickWins.map((win, idx) => (
                <li key={idx} className="text-sm">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-slate-900 font-medium">{win.action || "Action"}</p>
                      {(win.timeline || win.pillar_affected) && (
                        <p className="text-xs text-slate-500 mt-1">
                          {win.timeline && <span>{win.timeline}</span>}
                          {win.timeline && win.pillar_affected && <span> • </span>}
                          {win.pillar_affected && <span>{win.pillar_affected}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Strategic Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target size={16} className="text-blue-600" />
            Priorités Stratégiques (6-12 mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {priorities.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Aucune priorité stratégique définie.</p>
          ) : (
            <ul className="space-y-3">
              {priorities.map((priority, idx) => (
                <li key={idx} className="text-sm">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <p className="text-slate-700 leading-relaxed">{priority}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
