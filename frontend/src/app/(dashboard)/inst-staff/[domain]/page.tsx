"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { domainLabels } from "@/lib/mock-data"
import { FileText, Clock, Activity, AlertTriangle } from "lucide-react"

export default function InstStaffPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[params.domain as string] || params.domain} — Staff</h1>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Entrées aujourd'hui" value={24} compact icon={<FileText size={16} />} />
        <KpiCard title="En attente" value={8} compact icon={<Clock size={16} />} status="warning" />
        <KpiCard title="Approuvées" value={142} compact icon={<Activity size={16} />} status="ok" />
        <KpiCard title="Incidents" value={2} compact icon={<AlertTriangle size={16} />} status="critical" />
      </div>
    </div>
  )
}
