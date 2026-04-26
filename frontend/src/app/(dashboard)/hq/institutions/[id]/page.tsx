"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { institutions, getDomainKPIs, getKPIsForInstitution, getGreenMetricData, getRankings } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, Tabs, Badge, Button, Progress } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"
import { ChatPanel } from "@/components/ai/chat-panel"
import { allAlerts } from "@/lib/mock-data"
import { ArrowLeft, Building2, Globe, TreePine, Award, TrendingUp, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default function InstitutionDetailPage() {
  const params = useParams()
  const inst = institutions.find(i => i.id === params.id)
  const [tab, setTab] = useState('overview')

  if (!inst) return <div className="p-8 text-center text-slate-400">Institution non trouvée</div>

  const domainKpis = getDomainKPIs(inst.id)
  const kpis = getKPIsForInstitution(inst.id)
  const green = getGreenMetricData(inst.id)
  const rankings = getRankings(inst.id)
  const instAlerts = allAlerts.filter(a => a.institutionId === inst.id)

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'domains', label: 'Domaines' },
    { id: 'research', label: 'Recherche' },
    { id: 'esg', label: 'ESG' },
    { id: 'alerts', label: `Alertes (${instAlerts.length})` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/hq/institutions" className="p-1.5 hover:bg-slate-100 rounded-lg"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{inst.name}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1"><Building2 size={14} />{inst.code}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{inst.city}</span>
            <span>Fondée en {inst.establishedYear}</span>
            {inst.accreditationStatus.map(a => <Badge key={a} variant="success">{a}</Badge>)}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Étudiants" value={inst.totalStudents} icon={<Users size={18} />} />
        <KpiCard title="Personnel" value={inst.totalStaff} icon={<Building2 size={18} />} />
        <KpiCard title="Score Global" value={`${Math.round(domainKpis.reduce((s, d) => s + d.score, 0) / domainKpis.length)}%`} trend="up" trendValue={2.5} icon={<Award size={18} />} />
        <KpiCard title="GreenMetric" value={green.totalScore} unit="/10000" icon={<TreePine size={18} />} />
      </div>

      <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Domaines — Performance</CardTitle></CardHeader>
            <CardContent>
              {domainKpis.map(d => (
                <div key={d.domain} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                  <span className={`w-3 h-3 rounded-full ${d.status === 'ok' ? 'bg-emerald-500' : d.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className="flex-1 text-sm font-medium text-slate-700">{d.domainLabel}</span>
                  <span className="text-sm font-semibold text-slate-900">{d.score}%</span>
                  <Progress value={d.score} className="w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Classements</CardTitle></CardHeader>
            <CardContent>
              {rankings.map(r => (
                <div key={r.rankingSystem} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600">{r.rankingSystem}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant={r.rank.includes('1') ? 'success' : r.rank.includes('2') ? 'warning' : 'info'}>{r.rank}</Badge>
                    <span className="text-xs text-slate-400">Score: {r.score}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'domains' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domainKpis.map(d => (
            <Card key={d.domain}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.status === 'ok' ? 'bg-emerald-500' : d.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  {d.domainLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {d.kpis.slice(0, 5).map(k => (
                    <div key={k.name} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{k.name}</span>
                      <span className="font-medium text-slate-800">{k.value}{k.unit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'alerts' && <div className="space-y-4">{instAlerts.map(a => <AnomalyAlertCard key={a.id} alert={a} />)}</div>}

      {tab === 'research' && <div className="text-center py-12 text-slate-400">Page détaillée de la recherche — à venir</div>}
      {tab === 'esg' && <div className="text-center py-12 text-slate-400">Page ESG détaillée — voir onglet GreenMetric</div>}

      <ChatPanel embedded />
    </div>
  )
}
