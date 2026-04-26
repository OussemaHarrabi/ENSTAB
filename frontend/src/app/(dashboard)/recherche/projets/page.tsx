"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FlaskConical, Download, CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react"

const projects = [
  { name: 'Smart Agriculture IoT', leader: 'Pr. Mohamed Salah', budget: 450000, funding: 'PRF', status: 'En cours', end: '2026' },
  { name: 'AI for Health', leader: 'Dr. Amira Ben Salah', budget: 380000, funding: 'Européen', status: 'En cours', end: '2027' },
  { name: 'Renewable Energy', leader: 'Pr. Sana Mejri', budget: 520000, funding: 'PRF', status: 'En cours', end: '2025' },
  { name: 'Blockchain Education', leader: 'Dr. Karim Jarraya', budget: 250000, funding: 'National', status: 'Terminé', end: '2024' },
  { name: 'Water Resources', leader: 'Dr. Leila Trabelsi', budget: 600000, funding: 'International', status: 'En cours', end: '2028' },
]

const statusData = [
  { status: 'En cours', count: 12 }, { status: 'Terminé', count: 18 }, { status: 'Soumis', count: 8 }, { status: 'Planifié', count: 5 },
]

export default function ProjetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><FlaskConical size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Projets de Recherche</h1><p className="text-sm text-slate-500">43 projets — 16.6M DT — 12 en cours</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Projets', value: '43', icon: FlaskConical, color: '#9333EA' },
          { label: 'En Cours', value: '12', icon: Clock, color: '#2563EB' },
          { label: 'Budget Total', value: '16.6M DT', icon: TrendingUp, color: '#059669' },
          { label: 'Financement Ext.', value: '68%', icon: AlertTriangle, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Projets par Statut</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="status" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#9333EA" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Projets Récents</CardTitle></CardHeader><CardContent><div className="space-y-3">{projects.map((p, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.leader} — {p.funding}</p></div><div className="text-right"><Badge variant={p.status === 'Terminé' ? 'success' : 'warning'}>{p.status}</Badge><p className="text-xs text-slate-400">{p.budget.toLocaleString()} DT</p></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
