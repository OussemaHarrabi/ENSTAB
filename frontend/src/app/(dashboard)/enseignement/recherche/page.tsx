"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, Download, Award, TrendingUp, AlertTriangle } from "lucide-react"

const researchByRank = [
  { rank: 'Professeurs', count: 185, publications: 285 },
  { rank: 'MCF', count: 320, publications: 358 },
  { rank: 'MA', count: 340, publications: 212 },
  { rank: 'Assistants', count: 85, publications: 45 },
]

const topResearchers = [
  { name: 'Pr. Mohamed Salah', publications: 45, hIndex: 12, citations: 1280 },
  { name: 'Pr. Sana Mejri', publications: 52, hIndex: 15, citations: 1520 },
  { name: 'Dr. Amira Ben Salah', publications: 28, hIndex: 8, citations: 720 },
  { name: 'Dr. Karim Jarraya', publications: 22, hIndex: 7, citations: 580 },
]

export default function RechercheEnsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED20' }}><BookOpen size={20} className="text-violet-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Recherche</h1><p className="text-sm text-slate-500">Production scientifique par corps enseignant</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Publications', value: '900', icon: BookOpen, color: '#7C3AED' },
          { label: 'Taux Encadrement', value: '15.2', icon: TrendingUp, color: '#2563EB' },
          { label: 'H-Index Moyen', value: '7.8', icon: Award, color: '#059669' },
          { label: 'Chercheurs HDR', value: '145', icon: AlertTriangle, color: '#D97706' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Publications par Grade</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={researchByRank}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="rank" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="publications" fill="#7C3AED" name="Publications" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Top Chercheurs</CardTitle></CardHeader><CardContent><div className="space-y-3">{topResearchers.map((r, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{r.name}</p><p className="text-xs text-slate-400">{r.citations} citations</p></div><div className="text-right"><Badge variant="outline">{r.publications} pubs</Badge><p className="text-xs text-slate-500 mt-0.5">H-Index: {r.hIndex}</p></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
