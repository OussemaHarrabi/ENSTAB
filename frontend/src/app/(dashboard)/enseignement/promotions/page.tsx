"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Download, Users, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

const promotions = [
  { name: 'Dr. Mohamed Ali', grade: 'MA → MCF', institution: 'ENSI', statut: 'Dossier', date: '01 Mai 2025' },
  { name: 'Dr. Sana Mejri', grade: 'MCF → Professeur', institution: 'FST', statut: 'Comité', date: '15 Mai 2025' },
  { name: 'Dr. Karim Jarraya', grade: 'MA → MCF', institution: 'ENIT', statut: 'Validation', date: '20 Mai 2025' },
  { name: 'Dr. Amira Ben Salah', grade: 'MCF → Professeur', institution: 'FSEGT', statut: 'Dossier', date: '01 Juin 2025' },
  { name: 'Dr. Leila Trabelsi', grade: 'MA → MCF', institution: 'INSAT', statut: 'Dossier', date: '05 Juin 2025' },
]

const stageData = [
  { stage: 'Dossiers', count: 12 },
  { stage: 'Comité Scientifique', count: 8 },
  { stage: 'Validation', count: 5 },
  { stage: 'Approbation', count: 3 },
]

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED20' }}><TrendingUp size={20} className="text-violet-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Promotions</h1><p className="text-sm text-slate-500">Cycle 2025 — 12 candidats</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Candidats', value: '12', icon: Users, color: '#7C3AED' },
          { label: 'Dossier Complet', value: '8', icon: CheckCircle2, color: '#059669' },
          { label: 'En Cours', value: '5', icon: Clock, color: '#F59E0B' },
          { label: 'Positions Disponibles', value: '15', icon: AlertTriangle, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Pipeline des Promotions</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={stageData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="stage" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#7C3AED" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Candidatures</CardTitle></CardHeader><CardContent><div className="space-y-3">{promotions.map((p, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.grade} — {p.institution}</p></div><div className="text-right"><Badge variant={p.statut === 'Dossier' ? 'warning' : p.statut === 'Comité' ? 'default' : 'success'}>{p.statut}</Badge><p className="text-xs text-slate-400 mt-0.5">{p.date}</p></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
