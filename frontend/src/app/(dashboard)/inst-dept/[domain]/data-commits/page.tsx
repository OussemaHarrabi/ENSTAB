"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { Send } from "lucide-react"

export default function DataCommitsPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Engagements de Données</h1><Button size="sm"><Send size={14} className="mr-1" />Soumettre au Doyen</Button></div>
      <Card>
        <CardContent>
          <DataTable
            data={[
              { batch: 'BATCH-2025-04-25', items: 47, date: '2025-04-25', status: 'Validé' },
              { batch: 'BATCH-2025-04-24', items: 23, date: '2025-04-24', status: 'En attente' },
              { batch: 'BATCH-2025-04-23', items: 15, date: '2025-04-23', status: 'Rejeté' },
            ]}
            columns={[
              { key: 'batch', label: 'Lot', sortable: true },
              { key: 'items', label: 'Éléments', sortable: true },
              { key: 'date', label: 'Date', sortable: true },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'Validé' ? 'success' : item.status === 'En attente' ? 'warning' : 'danger'}>{item.status}</Badge> },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
