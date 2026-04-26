"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { FileText, Download, Plus, Calendar, Clock } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    { name: 'Rapport National Hebdomadaire', type: 'PDF', period: 'Hebdomadaire', generated: '2025-04-26', status: 'Disponible' },
    { name: 'Rapport Exécutif Mensuel', type: 'PDF', period: 'Mensuel', generated: '2025-04-01', status: 'Disponible' },
    { name: 'Analyse Comparative des Institutions', type: 'Excel', period: 'Trimestriel', generated: '2025-03-31', status: 'Disponible' },
    { name: 'Rapport GreenMetric', type: 'PDF', period: 'Annuel', generated: '2025-01-15', status: 'Disponible' },
    { name: 'Bulletin des KPIs Académiques', type: 'PDF', period: 'Hebdomadaire', generated: '2025-04-25', status: 'Disponible' },
    { name: 'Rapport Budgétaire', type: 'Excel', period: 'Mensuel', generated: '2025-04-01', status: 'Disponible' },
    { name: 'Analyse des Effectifs', type: 'PDF', period: 'Trimestriel', generated: '2025-03-01', status: 'Planifié' },
    { name: 'Rapport de Conformité ISO', type: 'PDF', period: 'Semestriel', generated: '2025-02-01', status: 'Disponible' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rapports Automatisés</h1>
          <p className="text-sm text-slate-500 mt-1">Génération et téléchargement des rapports périodiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Calendar size={14} className="mr-1" />Planifier</Button>
          <Button size="sm"><Plus size={14} className="mr-1" />Nouveau rapport</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Rapports Disponibles</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            data={reports}
            columns={[
              { key: 'name', label: 'Rapport', sortable: true },
              { key: 'type', label: 'Format', render: (item: any) => <Badge variant="outline">{item.type}</Badge> },
              { key: 'period', label: 'Périodicité', render: (item: any) => <span className="flex items-center gap-1"><Clock size={12} />{item.period}</span> },
              { key: 'generated', label: 'Généré le', sortable: true },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'Disponible' ? 'success' : 'warning'}>{item.status}</Badge> },
              { key: 'actions', label: '', render: (item: any) => item.status === 'Disponible' ? <Button variant="outline" size="sm"><Download size={12} className="mr-1" />Télécharger</Button> : <Button variant="outline" size="sm" disabled>En attente</Button> },
            ]}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
