"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { allInstitutions, getDomainKPIs, getKPIsForInstitution, getGreenMetricData, getRankings, allAlerts } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from "recharts"
import { ArrowLeft, Building2, Globe, TreePine, TrendingUp, MapPin, Users, GraduationCap, BookOpen, Shield, Wallet, Download, Award } from "lucide-react"
import Link from "next/link"
import { ROLE_ACCENT_COLORS } from "@/lib/types"

export default function InstitutionDetailPage() {
  const params = useParams()
  const inst = allInstitutions.find(i => i.id === params.id)
  const [tab, setTab] = useState('overview')

  if (!inst) return <div className="p-8 text-center text-slate-400">Institution non trouvée</div>

  const domainKpis = getDomainKPIs(inst.id)
  const kpis = getKPIsForInstitution(inst.id)
  const green = getGreenMetricData(inst.id)
  const rankings = getRankings(inst.id)
  const instAlerts = allAlerts.filter(a => a.institutionId === inst.id)

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'domains', label: 'Domaines' },
    { id: 'greenmetric', label: 'GreenMetric' },
    { id: 'rankings', label: 'Classements' },
    { id: 'alerts', label: 'Alertes', badge: instAlerts.length },
  ]

  const radarData = domainKpis.filter(d => d.score > 0).map(d => ({
    domain: d.domainLabel,
    score: Math.round(d.score),
    fullMark: 100,
  }))

  const kpiCategories = [...new Set(kpis.map(k => k.category))]
  const categoryAverages = kpiCategories.map(cat => {
    const catKpis = kpis.filter(k => k.category === cat)
    return {
      category: cat,
      avgValue: Math.round(catKpis.reduce((s, k) => s + k.value, 0) / catKpis.length),
      avgTarget: Math.round(catKpis.reduce((s, k) => s + k.target, 0) / catKpis.length),
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/president/institutions" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
            <ArrowLeft size={14} /> Retour aux institutions
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-500">{inst.code.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{inst.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={14} /> {inst.city}</span>
                <span className="flex items-center gap-1"><Building2 size={14} /> {inst.type}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {inst.totalStudents.toLocaleString()} étudiants</span>
                <span className="flex items-center gap-1"><GraduationCap size={14} /> {inst.totalStaff} personnels</span>
                <span className="text-xs text-slate-400">Depuis {inst.establishedYear}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all relative ${tab === t.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
            {t.badge && <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.slice(0, 4).map((k, i) => (
              <KpiCard key={i} title={k.kpiName} value={Math.round(k.value * 10) / 10} unit={k.unit} percentage={Math.round(k.value / k.target * 100)} targetValue={`${k.target}${k.unit}`} trend={k.trend} trendValue={k.trendValue} />
            ))}
          </div>

          {categoryAverages.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm font-semibold">Performance par Catégorie</CardTitle></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryAverages}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="avgValue" fill="#2563EB" name="Score" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="avgTarget" fill="#E2E8F0" name="Objectif" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accreditations */}
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Accréditations</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {inst.accreditationStatus.map((acc, i) => (
                  <Badge key={i} variant="success" className="text-xs px-3 py-1">{acc}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Domains Tab */}
      {tab === 'domains' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Score par Domaine</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Détail par Domaine</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainKpis.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-900">{d.domainLabel}</span>
                      <span className="text-slate-500">{d.score} / {d.target}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${Math.min(d.score / d.target * 100, 100)}%`,
                        backgroundColor: d.status === 'ok' ? '#059669' : d.status === 'warning' ? '#F59E0B' : '#EF4444'
                      }} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {d.kpis.slice(0, 3).map((k, j) => (
                        <span key={j} className="text-[10px] text-slate-400">{k.name}: {k.value}{k.unit}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GreenMetric Tab */}
      {tab === 'greenmetric' && green && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2"><TreePine size={20} /><h3 className="font-semibold">Score GreenMetric {green.year}</h3></div>
              <p className="text-4xl font-bold">{green.totalScore} <span className="text-lg text-emerald-200">/ {green.maxScore}</span></p>
              <p className="text-emerald-200 text-sm mt-1">Score: {Math.round(green.totalScore / green.maxScore * 100)}%</p>
            </CardContent>
          </Card>
          {Object.entries(green.criteria).map(([key, c]: [string, any]) => (
            <Card key={key}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                  <span className="text-xs text-slate-500">{c.score} / {c.max}</span>
                </div>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.score / c.max * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rankings Tab */}
      {tab === 'rankings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rankings.length > 0 ? rankings.map((r, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-slate-500"><Award size={16} />{r.rankingSystem}</div>
                <p className="text-3xl font-bold text-slate-900 mt-1">{r.rank}</p>
                <p className="text-xs text-slate-400">{r.year} — Score: {r.score.toFixed(1)}</p>
              </CardContent>
            </Card>
          )) : (
            <Card className="lg:col-span-4"><CardContent className="p-8 text-center text-slate-400"><Globe size={40} className="mx-auto mb-2 opacity-30" /><p>Aucun classement disponible</p></CardContent></Card>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {tab === 'alerts' && (
        <div className="space-y-4">
          {instAlerts.length > 0 ? instAlerts.map(a => <AnomalyAlertCard key={a.id} alert={a} />) : (
            <Card><CardContent className="p-8 text-center text-slate-400"><Shield size={40} className="mx-auto mb-2 opacity-30" /><p>Aucune anomalie détectée pour cet établissement</p></CardContent></Card>
          )}
        </div>
      )}
    </div>
  )
}
