"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend, PieChart, Pie, Cell } from "recharts"
import { BookOpen, Download, RefreshCw, Users, GraduationCap, TrendingUp, Globe, AlertTriangle, FlaskConical, Handshake, Award } from "lucide-react"

const affiliationData = [
  { year: '2021', total: 320, affiliated: 210, unaffiliated: 110, rate: 65.6 },
  { year: '2022', total: 355, affiliated: 250, unaffiliated: 105, rate: 70.4 },
  { year: '2023', total: 390, affiliated: 290, unaffiliated: 100, rate: 74.4 },
  { year: '2024', total: 420, affiliated: 335, unaffiliated: 85, rate: 79.8 },
  { year: '2025', total: 458, affiliated: 385, unaffiliated: 73, rate: 84.1 },
]

const topInstitutions = [
  { name: 'FST', publications: 85, affiliated: 78, rate: 91.8, researchers: 120 },
  { name: 'ENIT', publications: 72, affiliated: 65, rate: 90.3, researchers: 98 },
  { name: 'ENSI', publications: 68, affiliated: 62, rate: 91.2, researchers: 85 },
  { name: 'FSEGT', publications: 55, affiliated: 48, rate: 87.3, researchers: 72 },
  { name: 'INSAT', publications: 52, affiliated: 45, rate: 86.5, researchers: 68 },
  { name: 'SUPCOM', publications: 48, affiliated: 42, rate: 87.5, researchers: 62 },
]

const projectsData = [
  { name: 'Projets Nationaux', count: 18, funding: 4.5, color: '#2563EB' },
  { name: 'Projets Internationaux', count: 12, funding: 6.2, color: '#7C3AED' },
  { name: 'Projets Industriels', count: 8, funding: 3.8, color: '#059669' },
  { name: 'Projets Européens', count: 5, funding: 2.1, color: '#D97706' },
]

const atRiskPublications = [
  { title: 'Advanced Machine Learning in Healthcare', institution: 'FST', authors: 'Amira Ben Salah et al.', year: 2024 },
  { title: 'IoT-based Smart Agriculture Systems', institution: 'ENIT', authors: 'Mohamed Ali et al.', year: 2024 },
  { title: 'Blockchain for Supply Chain Management', institution: 'ISG', authors: 'Karim Jarraya et al.', year: 2023 },
]

export default function RecherchePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED20' }}>
              <FlaskConical size={20} className="text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recherche Scientifique & Affiliation</h1>
              <p className="text-sm text-slate-500">Suivi de la production scientifique et du taux d'affiliation UCAR</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Actualiser</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Publications 2025', value: '458', icon: BookOpen, color: '#7C3AED', delta: '+9%' },
          { label: 'Taux Affiliation', value: '84.1%', icon: Award, color: '#059669', delta: '+4.3%' },
          { label: 'Chercheurs Actifs', value: '1 245', icon: Users, color: '#2563EB', delta: '+5%' },
          { label: 'Doctorants', value: '380', icon: GraduationCap, color: '#D97706', delta: '+12%' },
          { label: 'Projets en Cours', value: '43', icon: TrendingUp, color: '#0891B2', delta: '+3' },
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

      {/* Affiliation Trend + Top Institutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Évolution des Publications & Affiliation UCAR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={affiliationData}>
                  <defs>
                    <linearGradient id="affGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="affiliated" stackId="1" stroke="#7C3AED" fill="url(#affGradient)" name="Affiliées UCAR" />
                  <Area type="monotone" dataKey="unaffiliated" stackId="1" stroke="#EF4444" fill="#FEE2E2" name="Non affiliées" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top Établissements — Publications 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topInstitutions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="affiliated" fill="#7C3AED" name="Affiliées UCAR" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="publications" fill="#C084FC" name="Total" radius={[0, 4, 4, 0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects + At-Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Projets de Recherche par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={projectsData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                      {projectsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {projectsData.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
                      <span className="text-sm text-slate-700">{p.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{p.count} projets — {p.funding} MDT</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">Total</span>
                    <span className="text-sm font-semibold text-slate-900">43 projets — 16.6 MDT</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Publications à Risque — Affiliation UCAR Manquante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atRiskPublications.map((p, i) => (
                <div key={i} className="p-3 rounded-lg border border-red-100 bg-red-50/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-900">{p.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.authors}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="destructive" className="text-[10px]">{p.institution}</Badge>
                        <span className="text-[10px] text-slate-400">{p.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full">Voir les 17 publications à risque</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Researcher Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Professeurs', value: '245', icon: Users, color: '#2563EB' },
              { label: 'Maîtres de Conf.', value: '380', icon: Users, color: '#7C3AED' },
              { label: 'Maîtres Assistants', value: '420', icon: Users, color: '#059669' },
              { label: 'HDR', value: '185', icon: Award, color: '#D97706' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: s.color + '15' }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
