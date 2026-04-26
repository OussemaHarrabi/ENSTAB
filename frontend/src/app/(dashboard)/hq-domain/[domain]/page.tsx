"use client"

import { useParams } from "next/navigation"
import { KpiCard } from "@/components/kpi/kpi-card"
import { ComparisonChart } from "@/components/kpi/comparison-chart"
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"
import { domainLabels, institutions, getKPIsForInstitution } from "@/lib/mock-data"
import { DataTable } from "@/components/tables/data-table"
import { ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HqDomainPage() {
  const params = useParams()
  const domain = params.domain as string
  const label = domainLabels[domain] || domain

  const instKpis = institutions.slice(0, 35).map((inst, idx) => {
    const kpis = getKPIsForInstitution(inst.id).filter(k => k.category === domain)
    const avg = kpis.length > 0 ? Math.round(kpis.reduce((s, k) => s + (k.target > 0 ? (k.value / k.target) * 100 : 0), 0) / kpis.length) : 0
    return { institution: inst.code, kpiCount: kpis.length, avgScore: avg, status: avg >= 85 ? 'ok' : avg >= 65 ? 'warning' : 'critical', _rank: idx + 1 }
  }).sort((a, b) => b.avgScore - a.avgScore).map((item, idx) => ({ ...item, _rank: idx + 1 }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{label} — Vue Nationale</h1>
        <Badge variant="info">{institutions.length} institutions</Badge>
      </div>
      <p className="text-sm text-slate-500 mt-1">Analyse transversale du domaine {label.toLowerCase()} à travers toutes les institutions UCAR</p>

      <ComparisonChart />

      <Card>
        <CardHeader><CardTitle>Classement des Institutions — {label}</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            data={instKpis}
            columns={[
              { key: 'rank', label: 'Rang', render: (item: any) => <span className="font-bold">#{(item as any)._rank}</span> },
              { key: 'institution', label: 'Institution', sortable: true },
              { key: 'avgScore', label: 'Score Moyen', render: (item: any) => <span className={`font-semibold ${item.avgScore >= 85 ? 'text-emerald-600' : item.avgScore >= 65 ? 'text-amber-600' : 'text-red-600'}`}>{item.avgScore}%</span>, sortable: true },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'ok' ? 'success' : item.status === 'warning' ? 'warning' : 'danger'}>{item.status === 'ok' ? 'Excellent' : item.status === 'warning' ? 'Attention' : 'Critique'}</Badge> },
            ]}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
