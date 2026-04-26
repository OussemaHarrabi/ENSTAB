"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Activity, Download, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

const execData = [
  { month: 'Jan', alloue: 7.0, consomme: 5.8 }, { month: 'Fév', alloue: 14.0, consomme: 11.2 },
  { month: 'Mar', alloue: 21.0, consomme: 17.5 }, { month: 'Avr', alloue: 28.0, consomme: 23.8 },
  { month: 'Mai', alloue: 35.0, consomme: 30.2 }, { month: 'Juin', alloue: 42.0, consomme: 37.5 },
]

const services = [
  { name: 'Enseignement', alloue: 28.5, consomme: 24.2, taux: 84.9 },
  { name: 'Recherche', alloue: 22.0, consomme: 18.5, taux: 84.1 },
  { name: 'Administration', alloue: 15.5, consomme: 13.8, taux: 89.0 },
  { name: 'Infrastructure', alloue: 12.0, consomme: 9.2, taux: 76.7 },
  { name: 'Vie Étudiante', alloue: 4.5, consomme: 3.8, taux: 84.4 },
]

export default function ExecutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B220' }}><Activity size={20} className="text-cyan-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Exécution Budgétaire</h1><p className="text-sm text-slate-500">Taux global: 85.2% — 2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Alloué', value: '42.0M DT', icon: TrendingUp, color: '#0891B2' },
          { label: 'Consommé', value: '37.5M DT', icon: Activity, color: '#0D9488' },
          { label: 'Taux Exécution', value: '85.2%', icon: CheckCircle2, color: '#059669' },
          { label: 'Alerte Dépassement', value: '3', icon: AlertTriangle, color: '#EF4444' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Cumul Alloué vs Consommé</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={execData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis unit=" MDT" /><Tooltip /><Area type="monotone" dataKey="alloue" stroke="#94A3B8" fill="#E2E8F0" name="Alloué" /><Area type="monotone" dataKey="consomme" stroke="#0891B2" fill="#0891B220" name="Consommé" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Taux d'Exécution par Service</CardTitle></CardHeader><CardContent><div className="space-y-3">{services.map((s, i) => (<div key={i}><div className="flex items-center justify-between text-sm mb-1"><span className="text-slate-900 font-medium">{s.name}</span><span className="text-slate-500">{s.consomme.toFixed(1)} / {s.alloue.toFixed(1)} MDT</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.taux}%`, backgroundColor: s.taux >= 90 ? '#059669' : s.taux >= 75 ? '#0891B2' : '#F59E0B' }}></div></div><p className="text-[10px] text-slate-400 mt-0.5">{s.taux}%</p></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
