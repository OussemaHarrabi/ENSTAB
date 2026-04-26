"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { domainLabels, getKPIsForInstitution, institutions } from "@/lib/mock-data"
import { TrendingUp, FileText, Users, Activity } from "lucide-react"

export default function HqStaffPage() {
  const params = useParams()
  const domain = params.domain as string
  const inst = institutions[0]
  const kpis = getKPIsForInstitution(inst.id).filter(k => k.category === domain)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[domain] || domain} — Staff UCAR</h1>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="KPIs Suivis" value={kpis.length} compact icon={<Activity size={16} />} />
        <KpiCard title="Rapports Générés" value={12} compact icon={<FileText size={16} />} />
        <KpiCard title="Alertes Actives" value={3} compact icon={<TrendingUp size={16} />} status="warning" />
        <KpiCard title="Qualité Données" value="87%" compact icon={<Users size={16} />} status="ok" />
      </div>
      <Card><CardHeader><CardTitle>Données Récentes</CardTitle></CardHeader><CardContent>
        {kpis.map(k => <div key={k.kpiSlug} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><span className="text-sm text-slate-600">{k.kpiName}</span><span className="font-medium">{k.value}{k.unit}</span></div>)}
      </CardContent></Card>
    </div>
  )
}
