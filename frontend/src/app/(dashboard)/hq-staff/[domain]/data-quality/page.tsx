"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/ui"
import { domainLabels, institutions } from "@/lib/mock-data"
import { Shield, AlertTriangle } from "lucide-react"
import { DataTable } from "@/components/tables/data-table"

export default function DataQualityPage() {
  const params = useParams()
  const domain = params.domain as string
  const qualData = institutions.map(inst => ({
    institution: inst.code, completeness: Math.round(70 + Math.random() * 28),
    consistency: Math.round(65 + Math.random() * 33), timeliness: Math.round(60 + Math.random() * 38),
    overall: Math.round(65 + Math.random() * 30),
  })).sort((a, b) => a.overall - b.overall)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Qualité des Données — {domainLabels[domain] || domain}</h1>
      <Card>
        <CardHeader><CardTitle>Scores de Qualité par Institution</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            data={qualData}
            columns={[
              { key: 'institution', label: 'Institution', sortable: true },
              { key: 'overall', label: 'Global', render: (item: any) => <span className={`font-semibold ${item.overall >= 85 ? 'text-emerald-600' : item.overall >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{item.overall}%</span>, sortable: true },
              { key: 'completeness', label: 'Complétude', render: (item: any) => <Progress value={item.completeness} className="w-20 inline-block" /> },
              { key: 'consistency', label: 'Cohérence', render: (item: any) => <Progress value={item.consistency} className="w-20 inline-block" /> },
              { key: 'timeliness', label: 'Rapidité', render: (item: any) => <Progress value={item.timeliness} className="w-20 inline-block" /> },
            ]}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
