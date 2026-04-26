"use client"

import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TeacherAnalyticsPage() {
  const data = [
    { name: 'INF-401', avg: 14.2, pass: 88 },
    { name: 'INF-302', avg: 12.8, pass: 75 },
    { name: 'INF-501', avg: 15.1, pass: 92 },
    { name: 'INF-601', avg: 13.5, pass: 82 },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Analyses Pédagogiques</h1>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Moyenne générale" value="13.9/20" icon={<Badge />} compact />
        <KpiCard title="Taux de réussite" value="84%" status="ok" compact />
        <KpiCard title="Étudiants à risque" value={12} status="critical" compact />
        <KpiCard title="Taux d'assiduité" value="82%" status="warning" compact />
      </div>
      <Card><CardHeader><CardTitle>Performance par Cours</CardTitle></CardHeader><CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" name="Moyenne /20" fill="#1e40af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pass" name="% Réussite" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent></Card>
    </div>
  )
}
