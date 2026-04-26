"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { BookOpen, Download, TrendingUp, AlertTriangle, Award, Users } from "lucide-react"

const pubsData = [
  { year: '2021', total: 320, affiliated: 210, international: 95 },
  { year: '2022', total: 355, affiliated: 250, international: 110 },
  { year: '2023', total: 390, affiliated: 290, international: 130 },
  { year: '2024', total: 420, affiliated: 335, international: 155 },
  { year: '2025', total: 458, affiliated: 385, international: 175 },
]

export default function PublicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><BookOpen size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Publications</h1><p className="text-sm text-slate-500">458 publications 2025 — Taux affiliation: 84.1%</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total 2025', value: '458', icon: BookOpen, color: '#9333EA' },
          { label: 'Affiliées UCAR', value: '385', icon: Award, color: '#059669' },
          { label: 'Internationales', value: '175', icon: TrendingUp, color: '#2563EB' },
          { label: 'Non Affiliées', value: '73', icon: AlertTriangle, color: '#EF4444' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Évolution des Publications</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={pubsData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Area type="monotone" dataKey="affiliated" stroke="#9333EA" fill="#9333EA20" strokeWidth={2} name="Affiliées" /><Area type="monotone" dataKey="international" stroke="#2563EB" fill="#2563EB20" strokeWidth={2} name="Internationales" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
