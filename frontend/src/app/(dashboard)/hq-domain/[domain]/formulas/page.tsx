"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui"
import { domainLabels, allKpisData } from "@/lib/mock-data"
import { DataTable } from "@/components/tables/data-table"
import { Code, Send } from "lucide-react"

export default function DomainFormulasPage() {
  const params = useParams()
  const domain = params.domain as string
  const kpis = [...new Map(allKpisData.filter(k => k.category === domain).map(k => [k.kpiSlug, k])).values()]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{domainLabels[domain] || domain} — Formules KPI</h1>
        <Button size="sm"><Send size={14} className="mr-1" />Soumettre au Super Admin</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Formules Existantes</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            data={kpis}
            columns={[
              { key: 'kpiSlug', label: 'Indicateur', sortable: true },
              { key: 'target', label: 'Objectif', sortable: true },
              { key: 'unit', label: 'Unité' },
              { key: 'actions', label: '', render: () => <Button variant="outline" size="sm"><Code size={12} className="mr-1" />Éditer formule</Button> },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
