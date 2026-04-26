"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Monitor, Download, TrendingUp, Globe, Users, BookOpen } from "lucide-react"

const digitalData = [
  { platform: 'ScienceDirect', sessions: 4500, searches: 12500 },
  { platform: 'Springer', sessions: 3800, searches: 9800 },
  { platform: 'IEEE', sessions: 3200, searches: 8500 },
  { platform: 'Cairn', sessions: 2800, searches: 7200 },
  { platform: 'OpenEdition', sessions: 2100, searches: 5400 },
]

export default function NumeriquePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B4530920' }}><Monitor size={20} className="text-amber-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Ressources Numériques</h1><p className="text-sm text-slate-500">12 plateformes — 52 000 sessions/mois</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Plateformes', value: '12', icon: Globe, color: '#B45309' },
          { label: 'Sessions/mois', value: '52 000', icon: Monitor, color: '#2563EB' },
          { label: 'Recherches/mois', value: '145 000', icon: TrendingUp, color: '#059669' },
          { label: 'Utilisateurs Distants', value: '3 200', icon: Users, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Top Plateformes</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={digitalData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="platform" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="sessions" fill="#B45309" name="Sessions" radius={[4,4,0,0]} /><Bar dataKey="searches" fill="#F59E0B" name="Recherches" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
