"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { GraduationCap, Download, Users, Clock, Award, TrendingUp } from "lucide-react"

const programs = [
  { name: 'Management Public', participants: 45, budget: 60000, status: 'En cours', sessions: 3 },
  { name: 'Digitalisation RH', participants: 30, budget: 45000, status: 'Planifié', sessions: 2 },
  { name: 'Gestion Financière', participants: 55, budget: 75000, status: 'En cours', sessions: 4 },
  { name: 'Soft Skills', participants: 120, budget: 90000, status: 'Terminé', sessions: 6 },
  { name: 'Excel Avancé', participants: 85, budget: 35000, status: 'En cours', sessions: 5 },
  { name: 'Anglais Professionnel', participants: 65, budget: 50000, status: 'Planifié', sessions: 8 },
]

const categoryData = [
  { name: 'Informatique', count: 25, color: '#2563EB' },
  { name: 'Management', count: 20, color: '#0D9488' },
  { name: 'Langues', count: 15, color: '#7C3AED' },
  { name: 'Finance', count: 18, color: '#059669' },
  { name: 'RH', count: 12, color: '#D97706' },
]

export default function FormationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820' }}><GraduationCap size={20} className="text-teal-600" /></div>
            <div><h1 className="text-2xl font-bold text-slate-900">Formation Continue</h1><p className="text-sm text-slate-500">15 programmes — 400 participants — Taux complétion: 78%</p></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Programmes Actifs', value: '6', icon: GraduationCap, color: '#0D9488' },
          { label: 'Participants', value: '400', icon: Users, color: '#2563EB' },
          { label: 'Heures Formation', value: '2 450', icon: Clock, color: '#7C3AED' },
          { label: 'Budget Total', value: '355K DT', icon: TrendingUp, color: '#059669' },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Programmes de Formation</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">{programs.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div><p className="text-sm font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.participants} participants — {p.sessions} sessions</p></div>
              <div className="text-right"><Badge variant={p.status === 'En cours' ? 'warning' : p.status === 'Terminé' ? 'success' : 'default'}>{p.status}</Badge><p className="text-xs text-slate-400">{p.budget.toLocaleString()} DT</p></div>
            </div>
          ))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Catégories de Formation</CardTitle></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></CardContent></Card>
      </div>
    </div>
  )
}
