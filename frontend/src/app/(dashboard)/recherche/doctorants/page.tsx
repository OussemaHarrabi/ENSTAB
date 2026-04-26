"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { GraduationCap, Download, Users, CheckCircle2, Clock, Award } from "lucide-react"

const phds = [
  { name: 'Mohamed Ali', topic: 'Machine Learning en Santé', director: 'Pr. Salah', year: '3e', status: 'En cours' },
  { name: 'Sana Karray', topic: 'Énergie Solaire', director: 'Pr. Mejri', year: '2e', status: 'En cours' },
  { name: 'Karim Jlassi', topic: 'Blockchain Éducation', director: 'Dr. Ben Ali', year: '4e', status: 'Soutenance' },
  { name: 'Amira Fekih', topic: 'IoT Agricole', director: 'Pr. Hammami', year: '1e', status: 'En cours' },
  { name: 'Nadia Gharbi', topic: 'Traitement Signal', director: 'Pr. Besbes', year: '5e', status: 'Thèse' },
]

const yearData = [
  { year: '1ère', count: 85 }, { year: '2ème', count: 72 }, { year: '3ème', count: 68 },
  { year: '4ème', count: 55 }, { year: '5ème+', count: 100 },
]

export default function DoctorantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><GraduationCap size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Doctorants</h1><p className="text-sm text-slate-500">380 doctorants — 185 HDR — 145 encadrants</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Doctorants', value: '380', icon: GraduationCap, color: '#9333EA' },
          { label: 'Nouveaux 2025', value: '65', icon: Users, color: '#059669' },
          { label: 'Soutenances/an', value: '42', icon: Award, color: '#2563EB' },
          { label: 'Taux Complétion', value: '72%', icon: CheckCircle2, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Répartition par Année</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={yearData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#9333EA" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Doctorants Récents</CardTitle></CardHeader><CardContent><div className="space-y-3">{phds.map((p, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.topic}</p></div><div className="text-right"><Badge variant={p.status === 'Soutenance' ? 'success' : p.status === 'Thèse' ? 'warning' : 'default'}>{p.status}</Badge><p className="text-xs text-slate-400">{p.director}</p></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
