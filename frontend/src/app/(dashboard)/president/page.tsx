"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { TrafficLightGrid } from "@/components/kpi/traffic-light-grid"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend } from "recharts"
import { Building2, Download, RefreshCw, TrendingUp, TreePine, BookOpen, Globe, ShieldAlert, ScrollText } from "lucide-react"
import { generateChartData, getNationalAverages, allInstitutions } from "@/lib/mock-data"
import { useEffect, useState } from "react"

const rankingData = [
  { year: '2020', the: 1201, qs: 1400, greenmetric: 350 },
  { year: '2021', the: 1001, qs: 1201, greenmetric: 285 },
  { year: '2022', the: 801, qs: 1001, greenmetric: 220 },
  { year: '2023', the: 601, qs: 801, greenmetric: 180 },
  { year: '2024', the: 501, qs: 601, greenmetric: 145 },
  { year: '2025', the: 401, qs: 501, greenmetric: 120 },
]

const greenMetricCriteria = [
  { name: 'Infrastructure', score: 85, max: 100 },
  { name: 'Énergie & Climat', score: 72, max: 100 },
  { name: 'Déchets', score: 68, max: 100 },
  { name: 'Eau', score: 90, max: 100 },
  { name: 'Transport', score: 55, max: 100 },
  { name: 'Éducation', score: 78, max: 100 },
  { name: 'Gouvernance', score: 82, max: 100 },
]

const kpiData: { title: string; value: number; unit: string; target: number; trend: 'up' | 'down' | 'stable'; trendValue: number }[] = [
  { title: 'Étudiants', value: 42350, unit: '', target: 45000, trend: 'up', trendValue: 3.2 },
  { title: 'Taux Réussite', value: 74.5, unit: '%', target: 80, trend: 'up', trendValue: 2.1 },
  { title: 'Budget Exécuté', value: 88.2, unit: '%', target: 95, trend: 'up', trendValue: 1.5 },
  { title: 'Publications', value: 385, unit: '', target: 400, trend: 'up', trendValue: 8.7 },
  { title: 'Score GreenMetric', value: 76.5, unit: '%', target: 85, trend: 'up', trendValue: 4.3 },
  { title: 'Classement THE', value: 401, unit: '', target: 350, trend: 'up', trendValue: -12.5 },
]

export default function PresidentDashboard() {
  const { currentUser } = useStore()
  const [enrollmentData] = useState(() => generateChartData(8, 40000, 5000))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1E3A5F20' }}>
              <Building2 size={20} style={{ color: '#1E3A5F' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord — Présidence</h1>
              <p className="text-sm text-slate-500">Vue stratégique de l'Université de Carthage</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Actualiser</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      {/* Rankings + GreenMetric */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Évolution des Classements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis reversed tick={{ fontSize: 12 }} domain={[0, 1500]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="the" stroke="#2563EB" strokeWidth={2} name="THE" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="qs" stroke="#7C3AED" strokeWidth={2} name="QS" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="greenmetric" stroke="#059669" strokeWidth={2} name="GreenMetric" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TreePine size={16} className="text-green-600" />
              GreenMetric — 7 Critères
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={greenMetricCriteria} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#059669" radius={[0, 4, 4, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Light */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Performance des Institutions — Tous Domaines</CardTitle>
        </CardHeader>
        <CardContent>
          <TrafficLightGrid />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'GreenMetric', icon: TreePine, href: '/president/greenmetric', color: '#059669' },
          { label: 'Classements', icon: TrendingUp, href: '/president/rankings', color: '#2563EB' },
          { label: 'Conformité ISO', icon: ShieldAlert, href: '/president/compliance', color: '#D97706' },
          { label: 'Recherche', icon: BookOpen, href: '/president/recherche', color: '#7C3AED' },
          { label: 'Institutions', icon: Globe, href: '/president/institutions', color: '#1E3A5F' },
          { label: 'Appels d\'Offres', icon: ScrollText, href: '/president/appels-offres', color: '#0891B2' },
        ].map((item, i) => (
          <a key={i} href={item.href}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <span className="text-xs font-medium text-slate-700 text-center">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
