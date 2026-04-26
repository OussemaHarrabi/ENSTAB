"use client"

import { Card, CardContent, CardHeader, CardTitle, Select } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { useState } from "react"
import { institutions, getKPIsForInstitution } from "@/lib/mock-data"
import { getTrafficLightColor } from "@/lib/utils"

const comparisonOptions = [
  { value: 'success_rate', label: "Taux de Réussite" },
  { value: 'budget_execution', label: "Exécution Budgétaire" },
  { value: 'employability_rate', label: "Taux d'Employabilité" },
  { value: 'green_score', label: 'Score GreenMetric' },
  { value: 'publications_count', label: 'Publications' },
  { value: 'staff_stability', label: 'Stabilité des Effectifs' },
]

export function ComparisonChart() {
  const [selectedKpi, setSelectedKpi] = useState('success_rate')
  const kpis = getKPIsForInstitution(institutions[0].id)
  const kpiDef = kpis.find(k => k.kpiSlug === selectedKpi)
  const target = kpiDef?.target || 100

  const chartData = institutions.slice(0, 15).map(inst => {
    const vals = getKPIsForInstitution(inst.id)
    const val = vals.find(v => v.kpiSlug === selectedKpi)
    return {
      name: inst.code,
      value: val?.value || 0,
      target: val?.target || 0,
      pct: target > 0 ? Math.round(((val?.value || 0) / target) * 100) : 0,
    }
  }).sort((a, b) => b.value - a.value)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Comparaison Inter-Institutions</CardTitle>
          <Select value={selectedKpi} onChange={setSelectedKpi} options={comparisonOptions} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(value, name) => [value, name === 'value' ? 'Valeur' : 'Objectif']}
              />
              <Legend />
              <Bar dataKey="value" name="Valeur" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getTrafficLightColor(entry.value, entry.target).replace('bg-', '#').replace('emerald-500', '10b981').replace('amber-500', 'f59e0b').replace('red-500', 'ef4444') || '#3b82f6'} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Objectif" fill="#93c5fd" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
