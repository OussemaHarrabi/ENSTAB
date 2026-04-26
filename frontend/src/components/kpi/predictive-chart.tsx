"use client"

import { Card, CardContent, CardHeader, CardTitle, Select } from "@/components/ui"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useState } from "react"
import { generateChartData } from "@/lib/mock-data"

const metrics = [
  { value: 'enrollment', label: "Inscriptions" },
  { value: 'success_rate', label: "Taux de Réussite" },
  { value: 'budget', label: "Exécution Budgétaire" },
  { value: 'dropout', label: "Taux d'Abandon" },
]

export function PredictiveChart() {
  const [metric, setMetric] = useState('enrollment')

  const historical = generateChartData(8, metric === 'enrollment' ? 78 : metric === 'budget' ? 70 : metric === 'dropout' ? 15 : 82, 5)
  const forecast = historical.slice(-1).concat(
    Array.from({ length: 4 }, (_, i) => ({
      date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() + i + 1)
        return d.toISOString().slice(0, 7)
      })(),
      value: Math.round(historical[historical.length - 1].value * (1 + (Math.random() - 0.3) * 0.15)),
    }))
  )

  const combined: any[] = historical.map(h => ({ ...h, historical: h.value }))
  const lastHistorical = historical[historical.length - 1]
  forecast.forEach(f => {
    const existing = combined.find(c => c.date === f.date)
    if (existing) existing.forecast = f.value
    else combined.push({ date: f.date, historical: lastHistorical?.value || 0, forecast: f.value, lower: Math.round(f.value * 0.85), upper: Math.round(f.value * 1.15) })
  })

  const label = metrics.find(m => m.value === metric)?.label || ''

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Prévisions — {label}</CardTitle>
          <Select value={metric} onChange={setMetric} options={metrics} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combined} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="historical" stroke="#3b82f6" strokeWidth={2} fill="url(#splitColor)" name="Historique" dot={{ r: 3 }} />
              {combined[0]?.forecast && <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Prévision" dot={{ r: 3 }} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Analyse:</span> La tendance prévue pour {label.toLocaleLowerCase()} montre une {metric === 'dropout' ? 'diminution' : 'augmentation'} modérée sur les 4 prochains mois. La fourchette de confiance à 85% est représentée par la zone ombrée.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
