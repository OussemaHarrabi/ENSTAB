"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Download, CheckCircle2, AlertTriangle, GraduationCap } from "lucide-react"

const successData = [
  { institution: 'ENSI', taux: 82 }, { institution: 'FST', taux: 78 }, { institution: 'ENIT', taux: 80 },
  { institution: 'FSEGT', taux: 75 }, { institution: 'INSAT', taux: 85 }, { institution: 'SUPCOM', taux: 79 },
  { institution: 'ISAMM', taux: 72 }, { institution: 'ISG', taux: 68 },
]

export default function ReussitePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E520' }}><TrendingUp size={20} className="text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Réussite Académique</h1><p className="text-sm text-slate-500">Taux moyen UCAR: 75.8% — Objectif 2026: 80%</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Taux Réussite', value: '75.8%', icon: TrendingUp, color: '#4F46E5' },
          { label: 'Taux Abandon', value: '8.2%', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Diplômés 2024', value: '8 500', icon: GraduationCap, color: '#059669' },
          { label: 'Mention Bien+', value: '32%', icon: CheckCircle2, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Taux de Réussite par Institution</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={successData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="institution" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} unit="%" /><Tooltip /><Bar dataKey="taux" fill="#4F46E5" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
