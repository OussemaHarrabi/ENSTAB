"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Select, Badge, Button } from "@/components/ui"
import { ComparisonChart } from "@/components/kpi/comparison-chart"
import { PredictiveChart } from "@/components/kpi/predictive-chart"
import { institutions, getKPIsForInstitution, getDomainKPIs } from "@/lib/mock-data"
import { DataTable } from "@/components/tables/data-table"
import { useState } from "react"
import { Award, TrendingUp, TrendingDown } from "lucide-react"

export default function BenchmarksPage() {
  const [domainFilter, setDomainFilter] = useState('all')

  const allInstitutions = institutions.map(inst => {
    const kpis = getDomainKPIs(inst.id)
    const avgScore = Math.round(kpis.reduce((s, d) => s + d.score, 0) / kpis.length)
    return { code: inst.code, name: inst.name, score: avgScore, status: avgScore >= 85 ? 'ok' : avgScore >= 65 ? 'warning' : 'critical' }
  }).sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Benchmarks Inter-Institutions</h1>
          <p className="text-sm text-slate-500 mt-1">Comparez les performances de toutes les institutions UCAR</p>
        </div>
        <Button variant="outline" size="sm">📊 Exporter</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Classement Général des Institutions</CardTitle>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-slate-400">Filtrer:</span>
              <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} className="h-8 rounded border border-slate-200 text-xs px-2">
                <option value="all">Tous les domaines</option>
                <option value="academic">Académique</option>
                <option value="research">Recherche</option>
                <option value="finance">Finance</option>
                <option value="esg">ESG</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={allInstitutions}
            columns={[
              { key: 'score', label: 'Rang', render: (item: any, idx) => <span className="font-bold text-slate-700">#{(idx || 0) + 1}</span>, sortable: false },
              { key: 'code', label: 'Code', sortable: true },
              { key: 'name', label: 'Institution', sortable: true },
              { key: 'score', label: 'Score Global', render: (item: any) => <span className={`font-semibold ${item.score >= 85 ? 'text-emerald-600' : item.score >= 65 ? 'text-amber-600' : 'text-red-600}'}`}>{item.score}%</span>, sortable: true },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'ok' ? 'success' : item.status === 'warning' ? 'warning' : 'danger'}>{item.status === 'ok' ? 'Excellent' : item.status === 'warning' ? 'Attention' : 'Critique'}</Badge> },
            ]}
            searchable
            pageSize={15}
          />
        </CardContent>
      </Card>

      <ComparisonChart />
      <PredictiveChart />
    </div>
  )
}
