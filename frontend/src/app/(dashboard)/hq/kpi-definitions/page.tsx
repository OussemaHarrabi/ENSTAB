"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { getNationalAverages, allKpisData } from "@/lib/mock-data"
import { Code, Plus, RefreshCw, History } from "lucide-react"

export default function KPIDefinitionsPage() {
  const kpis = allKpisData.slice(0, 20)
  const uniqueKpis = [...new Map(kpis.map(k => [k.kpiSlug, k])).values()]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">KPI Définitions & Formules</h1>
          <p className="text-sm text-slate-500 mt-1">Gérer les indicateurs clés de performance et leurs formules de calcul</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><History size={14} className="mr-1" />Historique</Button>
          <Button size="sm"><Plus size={14} className="mr-1" />Nouveau KPI</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Définitions des KPIs</CardTitle>
            <Badge variant="info">{uniqueKpis.length} indicateurs</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={uniqueKpis}
            columns={[
              { key: 'kpiSlug', label: 'Slug', sortable: true },
              { key: 'kpiName', label: 'Indicateur', sortable: true },
              { key: 'category', label: 'Catégorie', render: (item: any) => <Badge variant="outline">{item.category}</Badge> },
              { key: 'target', label: 'Objectif', sortable: true },
              { key: 'unit', label: 'Unité' },
              { key: 'actions', label: 'Actions', render: () => <Button variant="outline" size="sm"><Code size={12} className="mr-1" />Formule</Button> },
            ]}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
