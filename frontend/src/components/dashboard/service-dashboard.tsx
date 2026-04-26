"use client"

import { useStore } from "@/lib/store"
import { ROLE_LABELS, ROLE_ACCENT_COLORS, ROLE_ICONS, ROLE_SHORT_LABELS, SERVICE_DOMAINS, type RoleSlug, type MenuItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"
import { Building2, Bell, Download, RefreshCw } from "lucide-react"
import Link from "next/link"
import { generateChartData } from "@/lib/mock-data"
import { useEffect, useState } from "react"

interface ServiceDashboardProps {
  service: RoleSlug
}

const SERVICE_KPIS: Record<RoleSlug, { label: string; category: string; unit: string; target: number }[]> = {
  svc_rh: [
    { label: "Effectif Total", category: "hr", unit: "", target: 100 },
    { label: "Taux de Rotation", category: "hr", unit: "%", target: 5 },
    { label: "Postes Vacants", category: "hr", unit: "", target: 10 },
    { label: "Formations Complétées", category: "hr", unit: "%", target: 85 },
  ],
  svc_enseignement: [
    { label: "Enseignants", category: "academic", unit: "", target: 300 },
    { label: "Ratio Étudiant/Ens.", category: "academic", unit: "", target: 20 },
    { label: "Promotions en Cours", category: "academic", unit: "", target: 15 },
    { label: "Heures Enseignées", category: "academic", unit: "h", target: 60000 },
  ],
  svc_bibliotheque: [
    { label: "Collections", category: "academic", unit: "", target: 50000 },
    { label: "Prêts Actifs", category: "academic", unit: "", target: 3000 },
    { label: "Accès Numérique", category: "academic", unit: "%", target: 70 },
    { label: "Budget Exécuté", category: "finance", unit: "%", target: 90 },
  ],
  svc_finances: [
    { label: "Revenus (MDT)", category: "finance", unit: "MDT", target: 50 },
    { label: "Dépenses (MDT)", category: "finance", unit: "MDT", target: 45 },
    { label: "Taux d'Exécution", category: "finance", unit: "%", target: 95 },
    { label: "Audits Finalisés", category: "finance", unit: "", target: 8 },
  ],
  svc_equipement: [
    { label: "Bâtiments", category: "infrastructure", unit: "", target: 30 },
    { label: "Taux Maintenance", category: "infrastructure", unit: "%", target: 90 },
    { label: "Équipements", category: "infrastructure", unit: "", target: 2000 },
    { label: "Projets en Cours", category: "infrastructure", unit: "", target: 10 },
  ],
  svc_informatique: [
    { label: "Disponibilité Systèmes", category: "infrastructure", unit: "%", target: 99.5 },
    { label: "Incidents Ouverts", category: "infrastructure", unit: "", target: 5 },
    { label: "Tickets Résolus", category: "infrastructure", unit: "%", target: 95 },
    { label: "Score Sécurité", category: "infrastructure", unit: "%", target: 90 },
  ],
  svc_budget: [
    { label: "Budget Total (MDT)", category: "finance", unit: "MDT", target: 100 },
    { label: "Taux d'Exécution", category: "finance", unit: "%", target: 95 },
    { label: "Précision Prévisions", category: "finance", unit: "%", target: 90 },
    { label: "Écart vs Budget", category: "finance", unit: "%", target: 5 },
  ],
  svc_juridique: [
    { label: "Contentieux Actifs", category: "partnerships", unit: "", target: 10 },
    { label: "Contrats Gérés", category: "partnerships", unit: "", target: 50 },
    { label: "Conformité", category: "partnerships", unit: "%", target: 100 },
    { label: "Avis Émis", category: "partnerships", unit: "", target: 30 },
  ],
  svc_academique: [
    { label: " inscriptions", category: "academic", unit: "", target: 25000 },
    { label: "Taux Réussite", category: "academic", unit: "%", target: 75 },
    { label: "Taux Abandon", category: "academic", unit: "%", target: 10 },
    { label: "Programmes Accrédités", category: "academic", unit: "", target: 40 },
  ],
  svc_recherche: [
    { label: "Publications", category: "research", unit: "", target: 400 },
    { label: "Taux Affiliation UCAR", category: "research", unit: "%", target: 85 },
    { label: "Projets Actifs", category: "research", unit: "", target: 25 },
    { label: "Doctorants", category: "research", unit: "", target: 150 },
  ],
  svc_secretaire: [
    { label: "Courriers Traités", category: "partnerships", unit: "", target: 500 },
    { label: "Décisions Publiées", category: "partnerships", unit: "", target: 100 },
    { label: "Réunions tenues", category: "partnerships", unit: "", target: 20 },
    { label: "Documents Archivés", category: "partnerships", unit: "", target: 1000 },
  ],
  teacher: [],
  student: [],
  president: [],
}

function generateServiceChartData(baseValue: number, variance: number) {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  return months.map((m, i) => ({
    date: m,
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
  }))
}

const serviceDescriptions: Record<RoleSlug, string> = {
  svc_rh: "Gestion des ressources humaines, recrutement, formation, congés et évaluations du personnel administratif et technique.",
  svc_enseignement: "Gestion du personnel enseignant, promotions, charges horaires, et suivi de la production scientifique.",
  svc_bibliotheque: "Gestion des collections, prêts, ressources numériques et budget de la bibliothèque universitaire.",
  svc_finances: "Gestion des affaires financières, trésorerie, paiements, audits et marchés publics.",
  svc_equipement: "Gestion des bâtiments, maintenance, équipements et projets d'infrastructure.",
  svc_informatique: "Gestion des systèmes d'information, sécurité, incidents et support technique.",
  svc_budget: "Gestion du budget, allocations, exécution, prévisions et analyse comparative.",
  svc_juridique: "Gestion des contentieux, contrats, conformité réglementaire et avis juridiques.",
  svc_academique: "Gestion des programmes, inscriptions, réussite académique et vie étudiante.",
  svc_recherche: "Gestion de la recherche scientifique, publications, coopération, doctorants et classements.",
  svc_secretaire: "Gestion du courrier, décisions, réunions et documentation officielle.",
  teacher: "",
  student: "",
  president: "",
}

export function ServiceDashboard({ service }: ServiceDashboardProps) {
  const { currentUser } = useStore()
  const accentColor = ROLE_ACCENT_COLORS[service] || '#1E3A5F'
  const label = ROLE_LABELS[service]
  const shortLabel = ROLE_SHORT_LABELS[service]
  const kpis = SERVICE_KPIS[service] || []

  const [chartData] = useState(() => generateServiceChartData(
    service === 'svc_budget' ? 85 :
    service === 'svc_finances' ? 42 :
    service === 'svc_recherche' ? 350 :
    service === 'svc_academique' ? 22000 : 500,
    20
  ))

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentColor + '20' }}>
              <Building2 size={20} style={{ color: accentColor }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{label}</h1>
              <p className="text-sm text-slate-500">
                {currentUser?.firstName} {currentUser?.lastName} — {currentUser?.title || ''}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">{serviceDescriptions[service]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <RefreshCw size={14} /> Actualiser
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download size={14} /> Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <KpiCard
              key={idx}
              title={kpi.label}
              value={Math.round((50 + Math.random() * 45) * 10) / 10}
              unit={kpi.unit}
              percentage={Math.round((50 + Math.random() * 45))}
              targetValue={`${kpi.target}${kpi.unit}`}
              trend={idx % 3 === 0 ? 'up' : idx % 3 === 1 ? 'down' : 'stable'}
              trendValue={Math.round((Math.random() * 12 - 3) * 10) / 10}
            />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Tendance Annuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke={accentColor} fill="url(#serviceGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Distribution Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill={accentColor} radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions placeholder */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-slate-400" />
              <span className="text-sm text-slate-500">
                Plateforme {shortLabel} — Les fonctionnalités détaillées arrivent dans les prochaines mises à jour.
              </span>
            </div>
            <Badge variant="secondary">En développement</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
