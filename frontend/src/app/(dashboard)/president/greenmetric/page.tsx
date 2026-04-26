"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Cell } from "recharts"
import { TreePine, Download, RefreshCw, TrendingUp, Leaf, Lightbulb, Droplets, Trash2, Car, BookOpen, Shield } from "lucide-react"

const ucarScore = {
  total: 6875,
  max: 10000,
  percentage: 68.75,
  worldRank: 145,
  nationalRank: 1,
  trend: { year: 2021, score: 5200, rank: 220 },
}

const criteriaData = [
  { name: 'Infrastructure', score: 825, max: 1500, percentage: 55, icon: '🏛️', trend: '+2.1%' },
  { name: 'Énergie & Climat', score: 1125, max: 1800, percentage: 62.5, icon: '⚡', trend: '+4.3%' },
  { name: 'Déchets', score: 1050, max: 1800, percentage: 58.3, icon: '♻️', trend: '+5.8%' },
  { name: 'Eau', score: 675, max: 800, percentage: 84.4, icon: '💧', trend: '+1.2%' },
  { name: 'Transport', score: 950, max: 1800, percentage: 52.8, icon: '🚌', trend: '+3.7%' },
  { name: 'Éducation', score: 1025, max: 1400, percentage: 73.2, icon: '📚', trend: '+6.1%' },
  { name: 'Gouvernance', score: 1225, max: 900, percentage: 136, icon: '⚖️', trend: '+0.8%' },
]

const historicalData = [
  { year: '2020', score: 4800, target: 5000 },
  { year: '2021', score: 5200, target: 5500 },
  { year: '2022', score: 5750, target: 6000 },
  { year: '2023', score: 6150, target: 6500 },
  { year: '2024', score: 6550, target: 7000 },
  { year: '2025', score: 6875, target: 7500 },
  { year: '2026', score: 7200, target: 8000 },
]

const institutionGreenMetric = [
  { name: 'ENSI', score: 78, rank: 1, trend: 'up' },
  { name: 'ENIT', score: 72, rank: 2, trend: 'up' },
  { name: 'FST', score: 68, rank: 3, trend: 'stable' },
  { name: 'FSEGT', score: 65, rank: 4, trend: 'up' },
  { name: 'ISAMM', score: 62, rank: 5, trend: 'down' },
  { name: 'INSAT', score: 71, rank: 2, trend: 'up' },
  { name: 'SUPCOM', score: 74, rank: 1, trend: 'stable' },
  { name: 'ISG', score: 58, rank: 8, trend: 'down' },
]

export default function GreenMetricPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#05966920' }}>
              <TreePine size={20} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">UI GreenMetric</h1>
              <p className="text-sm text-slate-500">Suivi et pilotage de la performance environnementale — Université de Carthage</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Actualiser</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-emerald-100">Score Global UCAR</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-bold">{ucarScore.total}</span>
              <span className="text-xl text-emerald-200">/ {ucarScore.max}</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-white/20 rounded-lg px-3 py-1.5">
                <p className="text-xs text-emerald-100">Rang Mondial</p>
                <p className="text-lg font-bold">#{ucarScore.worldRank}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1.5">
                <p className="text-xs text-emerald-100">Rang National</p>
                <p className="text-lg font-bold">#{ucarScore.nationalRank}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1.5">
                <p className="text-xs text-emerald-100">Progression</p>
                <p className="text-lg font-bold text-emerald-200">+{ucarScore.trend.rank} places</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {[
          { label: 'Score 2024', value: '6 550', icon: TrendingUp, color: '#059669', delta: '+400' },
          { label: 'Objectif 2026', value: '8 000', icon: TrendingUp, color: '#2563EB', delta: '+1 125' },
          { label: 'Établissements', value: '12', icon: Leaf, color: '#D97706', delta: 'sur 35' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <stat.icon size={16} style={{ color: stat.color }} />
                {stat.label}
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7 Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Les 7 Critères GreenMetric</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {criteriaData.map((c, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{c.icon}</span>
                  <Badge variant={c.percentage >= 80 ? 'success' : c.percentage >= 60 ? 'warning' : 'destructive'}>
                    {c.trend}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.score} / {c.max} pts</p>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(c.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Évolution du Score GreenMetric</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="gmGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis domain={[4000, 8500]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} fill="url(#gmGradient)" name="Score" />
                  <Line type="monotone" dataKey="target" stroke="#D97706" strokeWidth={2} strokeDasharray="5 5" name="Objectif" dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Score par Établissement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={institutionGreenMetric.sort((a, b) => b.score - a.score).slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#059669" radius={[4, 4, 0, 0]} name="Score GreenMetric">
                    {institutionGreenMetric.map((entry, index) => (
                      <Cell key={index} fill={entry.trend === 'up' ? '#059669' : entry.trend === 'down' ? '#EF4444' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb size={18} className="text-amber-500" />
              <span className="text-sm text-slate-600">
                <strong>Recommandation :</strong> Améliorer le critère <strong>Transport</strong> (52.8%) pour gagner jusqu'à <strong>850 points</strong>. Prioriser les navettes électriques et le covoiturage.
              </span>
            </div>
            <Button size="sm" variant="outline">Voir les actions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
