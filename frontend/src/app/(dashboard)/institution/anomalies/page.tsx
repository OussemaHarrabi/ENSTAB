"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"
import { allAlerts } from "@/lib/mock-data"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"

export default function InstAnomaliesPage() {
  const instAlerts = allAlerts.slice(0, 4)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Alertes — Institution</h1>
      <Card><CardContent className="space-y-4 p-6">{instAlerts.map(a => <AnomalyAlertCard key={a.id} alert={a} showActions={false} />)}</CardContent></Card>
    </div>
  )
}
