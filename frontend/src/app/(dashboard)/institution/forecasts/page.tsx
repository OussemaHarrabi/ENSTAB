"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { PredictiveChart } from "@/components/kpi/predictive-chart"

export default function InstForecastsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Prévisions Stratégiques</h1>
      <PredictiveChart />
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: 'Inscriptions 2026', value: '2 950', trend: '+5.2%', status: 'ok' },
          { label: 'Budget 2026', value: '12.5M TND', trend: '+8%', status: 'ok' },
          { label: 'Taux d\'abandon prévu', value: '10.2%', trend: '-1.5%', status: 'ok' },
          { label: 'Publications attendues', value: '185', trend: '+12%', status: 'ok' },
        ].map((f, i) => (
          <Card key={i}><CardContent className="p-5 flex items-center justify-between"><div><p className="text-sm text-slate-500">{f.label}</p><p className="text-xl font-bold text-slate-900">{f.value}</p></div><Badge variant="success">{f.trend}</Badge></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
