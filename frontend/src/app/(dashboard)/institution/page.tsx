"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress, Tabs } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { institutions, getDomainKPIs, getKPIsForInstitution, generateChartData, allAlerts } from "@/lib/mock-data"
import { useState } from "react"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"
import { ChatPanel } from "@/components/ai/chat-panel"
import { ArrowLeft, TrendingUp, Users, Wallet, BookOpen } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function InstitutionPage() {
  const inst = institutions[2] // ENSI
  const [tab, setTab] = useState('overview')
  const kpis = getDomainKPIs(inst.id)
  const enrollmentData = generateChartData(6, 2500, 150)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{inst.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{inst.code} · {inst.city}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="info">Directeur</Badge>
          <Button variant="outline" size="sm">📄 Rapport</Button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
        <span className="text-amber-600 text-sm font-medium">🔄 Standard national mis à jour</span>
        <span className="text-xs text-amber-500 flex-1">Nouvelle version du blueprint disponible</span>
        <Button size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-700">Synchroniser</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Étudiants" value={inst.totalStudents} trend="up" trendValue={3.5} icon={<Users size={18} />} />
        <KpiCard title="Taux Réussite" value="87.3%" status="ok" trend="up" trendValue={3.2} targetValue="90%" nationalAvg="76.3%" icon={<TrendingUp size={18} />} />
        <KpiCard title="Exécution Budget" value="78%" status="warning" trend="up" trendValue={4.1} targetValue="90%" icon={<Wallet size={18} />} />
        <KpiCard title="Publications" value={156} trend="up" trendValue={8.2} icon={<BookOpen size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Performance par Domaine</CardTitle></CardHeader>
          <CardContent>
            {kpis.map(d => (
              <div key={d.domain} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                <span className={`w-2.5 h-2.5 rounded-full ${d.status === 'ok' ? 'bg-emerald-500' : d.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="flex-1 text-sm text-slate-600">{d.domainLabel}</span>
                <span className="text-sm font-semibold">{d.score}%</span>
                <Progress value={d.score} className="w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tendance des Inscriptions</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs tabs={[{ id: 'domains', label: 'Domaines' }, { id: 'approvals', label: 'Validations (3)' }, { id: 'alerts', label: 'Alertes' }]} activeTab={tab} onTabChange={setTab} />
      {tab === 'domains' && <div className="grid md:grid-cols-2 gap-4">{kpis.map(d => <Card key={d.domain}><CardContent className="p-4"><p className="text-sm font-medium text-slate-700">{d.domainLabel}</p><Progress value={d.score} className="mt-2" /><p className="text-xs text-slate-400 mt-1">{d.score}% — {d.status === 'ok' ? '✅ Bon' : d.status === 'warning' ? '⚠️ Attention' : '🔴 Critique'}</p></CardContent></Card>)}</div>}
      {tab === 'approvals' && <Card><CardContent className="p-6">3 validations en attente — voir page Approbations</CardContent></Card>}
      {tab === 'alerts' && <div className="space-y-4">{allAlerts.filter(a => a.institutionId === inst.id).map(a => <AnomalyAlertCard key={a.id} alert={a} />)}</div>}

      <ChatPanel embedded />
    </div>
  )
}
