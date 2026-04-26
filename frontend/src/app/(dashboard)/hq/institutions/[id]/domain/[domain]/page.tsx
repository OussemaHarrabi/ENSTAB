"use client"

import { useParams } from "next/navigation"
import { institutions, getDomainKPIs, getKPIsForInstitution } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { domainLabels } from "@/lib/mock-data"

export default function InstitutionDomainPage() {
  const params = useParams()
  const inst = institutions.find(i => i.id === params.id)
  const domain = params.domain as string
  const domainLabel = domainLabels[domain] || domain

  if (!inst) return <div className="p-8 text-center text-slate-400">Institution non trouvée</div>

  const kpis = getKPIsForInstitution(inst.id)
  const domainKpis = kpis.filter(k => k.category === domain)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/hq/institutions/${inst.id}`} className="p-1.5 hover:bg-slate-100 rounded-lg"><ArrowLeft size={18} /></Link>
        <h1 className="text-2xl font-bold text-slate-900">{inst.code} — {domainLabel}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {domainKpis.map(k => (
          <Card key={k.kpiSlug}>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 uppercase">{k.kpiName}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{k.value}<span className="text-sm font-normal text-slate-400 ml-1">{k.unit}</span></p>
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
