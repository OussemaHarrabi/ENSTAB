"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { ShieldAlert, Download, RefreshCw, BadgeCheck, AlertTriangle, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"

const isoStandards = [
  {
    name: 'ISO 21001', label: 'Systèmes de management pour l\'éducation', status: 'in_progress', progress: 72,
    color: '#2563EB', deadline: 'Juin 2026', stages: [
      { label: 'Diagnostic initial', done: true, date: 'Jan 2025' },
      { label: 'Formation du personnel', done: true, date: 'Mar 2025' },
      { label: 'Documentation processus', done: true, date: 'Juil 2025' },
      { label: 'Mise en œuvre', done: false, date: 'Déc 2025' },
      { label: 'Audit interne', done: false, date: 'Mar 2026' },
      { label: 'Certification', done: false, date: 'Juin 2026' },
    ]
  },
  {
    name: 'ISO 14001', label: 'Management environnemental', status: 'in_progress', progress: 55,
    color: '#059669', deadline: 'Déc 2026', stages: [
      { label: 'Analyse environnementale', done: true, date: 'Fév 2025' },
      { label: 'Politique environnementale', done: true, date: 'Avr 2025' },
      { label: 'Objectifs et cibles', done: false, date: 'Sep 2025' },
      { label: 'Mise en œuvre opérationnelle', done: false, date: 'Mar 2026' },
      { label: 'Audit de certification', done: false, date: 'Déc 2026' },
    ]
  },
  {
    name: 'ISO 9001', label: 'Système de management de la qualité', status: 'planning', progress: 25,
    color: '#D97706', deadline: 'Juin 2027', stages: [
      { label: 'Analyse des besoins', done: true, date: 'Mar 2025' },
      { label: 'Cartographie des processus', done: false, date: 'Oct 2025' },
      { label: 'Rédaction documentation', done: false, date: 'Juin 2026' },
      { label: 'Déploiement', done: false, date: 'Déc 2026' },
      { label: 'Audit à blanc', done: false, date: 'Mar 2027' },
      { label: 'Certification', done: false, date: 'Juin 2027' },
    ]
  },
]

const regulatoryTimeline = [
  { month: 'Jan 2025', items: 5, completed: 5 },
  { month: 'Fév 2025', items: 7, completed: 6 },
  { month: 'Mar 2025', items: 8, completed: 7 },
  { month: 'Avr 2025', items: 6, completed: 5 },
  { month: 'Mai 2025', items: 9, completed: 7 },
  { month: 'Juin 2025', items: 7, completed: 6 },
  { month: 'Juil 2025', items: 5, completed: 4 },
  { month: 'Aoû 2025', items: 4, completed: 4 },
]

const upcomingAudits = [
  { service: 'Service RH', type: 'Audit RH', date: '15 Mai 2025', status: 'scheduled', priority: 'high' },
  { service: 'Service Finances', type: 'Audit Financier', date: '12 Juin 2025', status: 'scheduled', priority: 'high' },
  { service: 'Service Informatique', type: 'Audit Sécurité', date: '20 Juin 2025', status: 'draft', priority: 'medium' },
  { service: 'Service Académique', type: 'Audit Qualité', date: '05 Sep 2025', status: 'draft', priority: 'medium' },
]

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D9770620' }}>
              <BadgeCheck size={20} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Conformité & Certification</h1>
              <p className="text-sm text-slate-500">Suivi des certifications ISO et conformité réglementaire</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Actualiser</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* ISO Standards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isoStandards.map((iso, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: iso.color }} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900">{iso.name}</h3>
                <Badge variant={iso.status === 'certified' ? 'success' : iso.status === 'in_progress' ? 'warning' : 'default'}>
                  {iso.status === 'certified' ? 'Certifié' : iso.status === 'in_progress' ? 'En cours' : 'Planifié'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3">{iso.label}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Progression</span>
                <span className="font-medium text-slate-700">{iso.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full" style={{ width: `${iso.progress}%`, backgroundColor: iso.color }} />
              </div>
              <div className="space-y-2.5">
                {iso.stages.map((s, j) => (
                  <div key={j} className="flex items-center gap-2">
                    {s.done ? (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                      <Clock size={14} className="text-slate-300 shrink-0" />
                    )}
                    <span className={`text-xs ${s.done ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{s.date}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={12} />
                <span>Échéance: {iso.deadline}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Trend + Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Conformité Réglementaire — Tendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regulatoryTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="items" fill="#94A3B8" name="Exigences" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#059669" name="Respectées" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Audits à Venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAudits.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{a.type}</span>
                      <Badge variant={a.priority === 'high' ? 'destructive' : 'warning'} className="text-[10px]">
                        {a.priority === 'high' ? 'Haute' : 'Moyenne'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{a.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-700">{a.date}</p>
                    <p className="text-[10px] text-slate-400">{a.status === 'scheduled' ? 'Programmé' : 'Brouillon'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
