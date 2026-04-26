"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"
import { allAlerts, domainLabels } from "@/lib/mock-data"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"

export default function InstDeptAnomaliesPage() {
  const params = useParams()
  const domain = params.domain as string
  const alerts = allAlerts.filter(a => a.domain === domain)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[domain] || domain} — Anomalies</h1>
      <Card><CardContent className="space-y-4 p-6">{alerts.map(a => <AnomalyAlertCard key={a.id} alert={a} showActions={false} />)}</CardContent></Card>
    </div>
  )
}
