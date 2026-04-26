"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Users, Download, TrendingUp, School, GraduationCap } from "lucide-react"

const enrollmentTrend = [
  { year: '2020', inscriptions: 38500, nouveaux: 9500 },
  { year: '2021', inscriptions: 39800, nouveaux: 10200 },
  { year: '2022', inscriptions: 40500, nouveaux: 10800 },
  { year: '2023', inscriptions: 41800, nouveaux: 11200 },
  { year: '2024', inscriptions: 42350, nouveaux: 11500 },
  { year: '2025', inscriptions: 43200, nouveaux: 11800 },
]

export default function InscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E520' }}><Users size={20} className="text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Inscriptions</h1><p className="text-sm text-slate-500">43 200 étudiants — 26 établissements</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Étudiants 2025', value: '43 200', icon: Users, color: '#4F46E5' },
          { label: 'Nouveaux', value: '11 800', icon: GraduationCap, color: '#059669' },
          { label: 'Taux Croissance', value: '+2.3%', icon: TrendingUp, color: '#2563EB' },
          { label: 'Établissements', value: '26', icon: School, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Évolution des Inscriptions</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={enrollmentTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Area type="monotone" dataKey="inscriptions" stroke="#4F46E5" fill="#4F46E520" strokeWidth={2} name="Total" /><Area type="monotone" dataKey="nouveaux" stroke="#059669" fill="#05966920" strokeWidth={2} name="Nouveaux" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
