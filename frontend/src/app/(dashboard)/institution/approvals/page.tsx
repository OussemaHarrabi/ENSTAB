"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { CheckCircle2, XCircle, Eye } from "lucide-react"

export default function ApprovalsPage() {
  const commits = [
    { dept: 'Académique', items: 47, date: '2025-04-25', by: 'Chef Académique', status: 'En attente' },
    { dept: 'Finance', items: 23, date: '2025-04-24', by: 'Chef Finance', status: 'Approuvé' },
    { dept: 'RH', items: 15, date: '2025-04-23', by: 'Chef RH', status: 'En attente' },
    { dept: 'Recherche', items: 38, date: '2025-04-22', by: 'Chef Recherche', status: 'Rejeté' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Approbations — Engagements de Données</h1>
      <Card>
        <CardHeader><CardTitle>En attente de validation</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            data={commits}
            columns={[
              { key: 'dept', label: 'Département', sortable: true },
              { key: 'items', label: 'Éléments', sortable: true },
              { key: 'date', label: 'Date', sortable: true },
              { key: 'by', label: 'Soumis par' },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'Approuvé' ? 'success' : item.status === 'Rejeté' ? 'danger' : 'warning'}>{item.status}</Badge> },
              { key: 'actions', label: 'Actions', render: (item: any) => <div className="flex gap-1"><Button size="sm" variant="outline"><Eye size={12} /></Button><Button size="sm" variant="outline" className="text-emerald-600"><CheckCircle2 size={12} /></Button><Button size="sm" variant="outline" className="text-red-600"><XCircle size={12} /></Button></div> },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
