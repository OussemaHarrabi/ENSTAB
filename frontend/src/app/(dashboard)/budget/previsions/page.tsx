"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Download, ArrowUp, ArrowDown } from "lucide-react"

const forecastData = [
  { year: '2021', reel: 72.0, prevu: 70.0 },
  { year: '2022', reel: 75.0, prevu: 73.0 },
  { year: '2023', reel: 78.5, prevu: 76.0 },
  { year: '2024', reel: 82.0, prevu: 80.0 },
  { year: '2025', reel: 85.0, prevu: 83.0 },
  { year: '2026', reel: null, prevu: 88.0 },
  { year: '2027', reel: null, prevu: 92.0 },
]

const scenarios = [
  { name: 'Scénario Optimiste', budget: 95.0, prob: 25, desc: 'Augmentation subventions + 15%' },
  { name: 'Scénario Réaliste', budget: 88.0, prob: 55, desc: 'Croissance stable + 8%' },
  { name: 'Scénario Pessimiste', budget: 80.0, prob: 20, desc: 'Réduction budget - 5%' },
]

export default function PrevisionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B220' }}><TrendingUp size={20} className="text-cyan-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Prévisions Budgétaires</h1><p className="text-sm text-slate-500">Projections 2025-2027 avec intervalles de confiance</p></div></div></div>
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Historique & Prévisions</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={forecastData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="year" /><YAxis unit=" MDT" /><Tooltip /><Area type="monotone" dataKey="prevu" stroke="#0891B2" fill="#0891B220" strokeWidth={2} strokeDasharray="5 5" name="Prévision" /><Area type="monotone" dataKey="reel" stroke="#0D9488" fill="#0D948820" strokeWidth={2} name="Réel" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
      <div className="grid grid-cols-3 gap-4">{scenarios.map((s, i) => (<Card key={i} className={`border-l-4 ${i === 0 ? 'border-l-emerald-500' : i === 1 ? 'border-l-blue-500' : 'border-l-amber-500'}`}><CardContent className="p-5"><div className="flex items-center justify-between"><Badge>{s.prob}%</Badge></div><p className="text-lg font-bold text-slate-900 mt-2">{s.budget} MDT</p><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-slate-400 mt-1">{s.desc}</p></CardContent></Card>))}</div>
    </div>
  )
}
