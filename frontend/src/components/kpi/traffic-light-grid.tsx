"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { cn, getTrafficLightEmoji } from "@/lib/utils"
import { getDomainKPIs } from "@/lib/mock-data"
import { institutions } from "@/lib/mock-data"
import Link from "next/link"

const domainOrder = ['academic', 'hr', 'finance', 'research', 'infrastructure', 'employment', 'partnerships', 'esg'] as const
const domainLabels: Record<string, string> = {
  academic: '🎓 Acad.', hr: '👥 RH', finance: '💰 Fin.', research: '🔬 Rech.',
  infrastructure: '🏗 Infra.', employment: '💼 Emp.', partnerships: '🤝 Part.', esg: '🌱 ESG',
}

export function TrafficLightGrid({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <Card>
      {showTitle && <CardHeader><CardTitle>Grille de Performance — Institutions × Domaines</CardTitle></CardHeader>}
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">Institution</th>
              {domainOrder.map(d => <th key={d} className="text-center py-2 px-1 text-xs font-medium text-slate-500 uppercase">{domainLabels[d]}</th>)}
            </tr>
          </thead>
          <tbody>
            {institutions.map(inst => {
              const kpis = getDomainKPIs(inst.id)
              return (
                <tr key={inst.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 pr-4">
                    <Link href={`/hq/institutions/${inst.id}`} className="text-sm font-medium text-slate-800 hover:text-blue-600">
                      {inst.code}
                    </Link>
                    <p className="text-xs text-slate-400">{inst.city}</p>
                  </td>
                  {domainOrder.map(d => {
                    const domain = kpis.find(k => k.domain === d)
                    const emoji = domain ? getTrafficLightEmoji(domain.score, 90) : '⚪'
                    const color = domain?.status === 'critical' ? 'text-red-500' : domain?.status === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                    return (
                      <td key={d} className="text-center py-2 px-1">
                        <Link href={`/hq/institutions/${inst.id}/domain/${d}`} className={cn('text-lg hover:scale-110 inline-block transition-transform', color)}>
                          {emoji}
                        </Link>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
