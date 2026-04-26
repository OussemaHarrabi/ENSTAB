"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui"
import { domainLabels, institutions, getKPIsForInstitution } from "@/lib/mock-data"

export default function InstDomainPage() {
  const params = useParams()
  const domain = params.domain as string
  const inst = institutions[2]
  const kpis = getKPIsForInstitution(inst.id).filter(k => k.category === domain)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[domain] || domain} — {inst.code}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {kpis.map(k => (
          <Card key={k.kpiSlug}>
            <CardContent className="p-5">
              <p className="text-xs text-slate-500 uppercase">{k.kpiName}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{k.value}<span className="text-sm text-slate-400 ml-1">{k.unit}</span></p>
              <Progress value={(k.value / k.target) * 100} className="mt-2" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Objectif: {k.target}{k.unit}</span>
                <Badge variant={k.trend === 'up' ? 'success' : k.trend === 'down' ? 'danger' : 'outline'}>{k.trend === 'up' ? '↑' : '↓'} {Math.abs(k.trendValue)}%</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
