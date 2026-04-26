"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, Download, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

const predictedOffres = [
  { title: 'Renouvellement licences Microsoft', budget: 280000, probability: 92, deadline: 'Juin 2025', service: 'Informatique' },
  { title: 'Maintenance climatisation', budget: 150000, probability: 85, deadline: 'Aoû 2025', service: 'Équipement' },
  { title: 'Papeterie et fournitures', budget: 120000, probability: 78, deadline: 'Sep 2025', service: 'Budget' },
  { title: 'Formation personnel', budget: 200000, probability: 72, deadline: 'Oct 2025', service: 'RH' },
]

export default function AppelsOffresFinPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#05966920' }}><TrendingUp size={20} className="text-emerald-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Appels d'Offres</h1><p className="text-sm text-slate-500">Prédictions IA et suivi des appels d'offres</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Prédictions', value: '8', icon: TrendingUp, color: '#059669' },
          { label: 'En Cours', value: '12', icon: Clock, color: '#2563EB' },
          { label: 'Clôturés', value: '45', icon: CheckCircle2, color: '#0D9488' },
          { label: 'Budget Prévu', value: '4.2M DT', icon: AlertTriangle, color: '#F59E0B' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" />Prédictions IA — Appels d'Offres à Venir</CardTitle></CardHeader><CardContent><div className="space-y-3">{predictedOffres.map((ao, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{ao.title}</p><p className="text-xs text-slate-400">{ao.service} — {ao.budget.toLocaleString()} DT</p></div><div className="flex items-center gap-3"><div className="h-8 w-20 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ width: `${ao.probability}%`, backgroundColor: ao.probability >= 80 ? '#059669' : '#D97706' }}>{ao.probability}%</div></div><span className="text-xs text-slate-400">{ao.deadline}</span></div></div>))}</div></CardContent></Card>
    </div>
  )
}
