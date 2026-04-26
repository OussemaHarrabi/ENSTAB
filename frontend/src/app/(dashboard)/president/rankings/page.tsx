"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend } from "recharts"
import { TrendingUp, Download, RefreshCw, Globe, Target, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react"

const rankingsData = [
  { system: 'THE World University Rankings', rank2023: 601, rank2024: 501, rank2025: 401, score2025: 38.5, target2026: 350, color: '#2563EB' },
  { system: 'QS World University Rankings', rank2023: 801, rank2024: 651, rank2025: 551, score2025: 32.1, target2026: 450, color: '#7C3AED' },
  { system: 'UI GreenMetric', rank2023: 180, rank2024: 145, rank2025: 120, score2025: 68.8, target2026: 100, color: '#059669' },
  { system: 'THE Impact Rankings', rank2023: 401, rank2024: 301, rank2025: 251, score2025: 55.2, target2026: 200, color: '#D97706' },
]

const competitorData = [
  { name: 'UCAR', the: 401, qs: 551, greenmetric: 120, impact: 251 },
  { name: 'UTM', the: 501, qs: 651, greenmetric: 150, impact: 301 },
  { name: 'UMA', the: 701, qs: 801, greenmetric: 200, impact: 401 },
  { name: 'USF', the: 601, qs: 751, greenmetric: 180, impact: 351 },
]

const kpiGap = [
  { kpi: 'Taux d\'encadrement', value: 18, target: 22, weight: 'Haut', impact: '+50 places' },
  { kpi: 'Publications par chercheur', value: 1.8, target: 2.5, weight: 'Très haut', impact: '+80 places' },
  { kpi: 'Taux de réussite', value: 74.5, target: 82, weight: 'Moyen', impact: '+25 places' },
  { kpi: 'Internationalisation', value: 12, target: 20, weight: 'Haut', impact: '+45 places' },
  { kpi: 'GreenMetric', value: 68.8, target: 80, weight: 'Moyen', impact: '+30 places' },
]

export default function RankingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}>
              <Globe size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Classements Internationaux</h1>
              <p className="text-sm text-slate-500">Suivi des positions THE, QS, GreenMetric et THE Impact</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Actualiser</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Ranking Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rankingsData.map((r, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: r.color }} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-500 uppercase">{r.system.split(' ')[0]}</p>
                <Badge variant={r.rank2025 < r.rank2024 ? 'success' : 'destructive'}>
                  {r.rank2025 < r.rank2024 ? '+' + (r.rank2024 - r.rank2025) : '-' + (r.rank2025 - r.rank2024)} places
                </Badge>
              </div>
              <p className="text-3xl font-bold text-slate-900">#{r.rank2025}</p>
              <p className="text-xs text-slate-400 mt-1">Score: {r.score2025}%</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span>2023: #{r.rank2023}</span>
                <span>→</span>
                <span>2024: #{r.rank2024}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <Target size={12} className="text-blue-500" />
                <span className="text-blue-600 font-medium">Objectif 2026: #{r.target2026}</span>
              </div>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100 * (1 - r.rank2025 / r.target2026 / 2), 100)}%`, backgroundColor: r.color }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitor Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Comparaison avec les Concurrents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" reversed tick={{ fontSize: 12 }} domain={[0, 1000]} />
                  <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 13, fontWeight: 600 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="the" fill="#2563EB" name="THE" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="qs" fill="#7C3AED" name="QS" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="greenmetric" fill="#059669" name="GreenMetric" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Écarts à Combler — Impact sur le Classement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kpiGap.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{g.kpi}</span>
                      <Badge variant={g.weight === 'Très haut' ? 'destructive' : g.weight === 'Haut' ? 'warning' : 'default'} className="text-[10px]">{g.weight}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Actuel: {g.value} → Objectif: {g.target}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">{g.impact}</p>
                    <p className="text-[10px] text-slate-400">potentiel</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Progression Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { year: '2021', the: 1201, qs: 1400, greenmetric: 350, impact: 600 },
                { year: '2022', the: 801, qs: 1001, greenmetric: 220, impact: 450 },
                { year: '2023', the: 601, qs: 801, greenmetric: 180, impact: 401 },
                { year: '2024', the: 501, qs: 651, greenmetric: 145, impact: 301 },
                { year: '2025', the: 401, qs: 551, greenmetric: 120, impact: 251 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis reversed domain={[0, 1500]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="the" stroke="#2563EB" strokeWidth={2} name="THE" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="qs" stroke="#7C3AED" strokeWidth={2} name="QS" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="greenmetric" stroke="#059669" strokeWidth={2} name="GreenMetric" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="impact" stroke="#D97706" strokeWidth={2} name="THE Impact" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
