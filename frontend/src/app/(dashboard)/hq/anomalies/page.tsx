"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Select } from "@/components/ui"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"
import { allAlerts } from "@/lib/mock-data"
import { useState } from "react"
import { ShieldAlert, Filter } from "lucide-react"

export default function AnomaliesPage() {
  const [filter, setFilter] = useState('all')
  const [severity, setSeverity] = useState('all')

  let filtered = allAlerts
  if (filter !== 'all') filtered = filtered.filter(a => a.status === filter)
  if (severity !== 'all') filtered = filtered.filter(a => a.severity === severity)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Anomalies</h1>
          <p className="text-sm text-slate-500 mt-1">Surveillance et analyse des déviations par domaine</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="danger">{allAlerts.filter(a => a.status === 'pending').length} Non traitées</Badge>
          <Badge variant="warning">{allAlerts.filter(a => a.status === 'acknowledged').length} En cours</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Toutes les Alertes</CardTitle>
            <div className="flex gap-3">
              <select value={severity} onChange={e => setSeverity(e.target.value)} className="h-8 rounded border border-slate-200 text-xs px-2">
                <option value="all">Toutes sévérités</option>
                <option value="critical">Critique</option>
                <option value="warning">Attention</option>
                <option value="info">Info</option>
              </select>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="h-8 rounded border border-slate-200 text-xs px-2">
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="acknowledged">Accusé</option>
                <option value="investigating">En cours</option>
                <option value="false_positive">Faux positif</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filtered.map(alert => <AnomalyAlertCard key={alert.id} alert={alert} />)}
          {filtered.length === 0 && <p className="text-center text-slate-400 py-8">Aucune anomalie trouvée</p>}
        </CardContent>
      </Card>
    </div>
  )
}
