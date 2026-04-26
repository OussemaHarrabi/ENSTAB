"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { TrafficLightGrid } from "@/components/kpi/traffic-light-grid"
import { ComparisonChart } from "@/components/kpi/comparison-chart"
import { PredictiveChart } from "@/components/kpi/predictive-chart"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"
import { allAlerts, generateEnrollmentTrend, getNationalAverages } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { BookOpen, GraduationCap, TrendingUp, TreePine, Users, Wallet, Activity } from "lucide-react"

export default function HQDashboard() {
  const enrollmentData = generateEnrollmentTrend()
  const metrics = getNationalAverages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Université de Carthage — Tableau de Bord Exécutif</h1>
          <p className="text-sm text-slate-500 mt-1">Vue consolidée des 35 institutions · Année 2025-2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">📄 Exporter PDF</Button>
          <Button size="sm">Actualiser</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Étudiants" value={86800} trend="up" trendValue={2.1} percentage={92} targetValue="95 000" icon={<GraduationCap size={18} />} />
        <KpiCard title="Taux de Réussite" value="76.3%" trend="up" trendValue={1.8} percentage={85} targetValue="85%" nationalAvg="72.1%" rank="National: 3e" icon={<TrendingUp size={18} />} status="ok" />
        <KpiCard title="Exécution Budgétaire" value="71.5%" trend="up" trendValue={3.2} percentage={79} targetValue="90%" nationalAvg="68.2%" icon={<Wallet size={18} />} status="warning" />
        <KpiCard title="Publications" value={6470} trend="up" trendValue={5.4} percentage={65} targetValue="10 000" icon={<BookOpen size={18} />} />
        <KpiCard title="Score GreenMetric" value={6200} trend="up" trendValue={150} percentage={62} targetValue="8 000" nationalAvg="5 800" icon={<TreePine size={18} />} status="warning" />
        <KpiCard title="THE Ranking" value="1201-1500" trend="down" trendValue={-50} targetValue="801-1000" rank="vs UTM: 801-1000" icon={<Activity size={18} />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Évolution des Inscriptions</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={2} name="Étudiants" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Comparaison Nationale — KPIs Clés</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend />
                  <Bar dataKey="ucar" name="UCAR" fill="#1e40af" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="national" name="National" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Light + Anomalies */}
      <TrafficLightGrid />
      <ComparisonChart />
      <PredictiveChart />

      {/* Anomalies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>🔔 Alertes Anomalies</CardTitle>
            <Badge variant="danger">{allAlerts.filter(a => a.status === 'pending').length} non traitées</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {allAlerts.slice(0, 4).map(alert => <AnomalyAlertCard key={alert.id} alert={alert} />)}
        </CardContent>
      </Card>
    </div>
  )
}
