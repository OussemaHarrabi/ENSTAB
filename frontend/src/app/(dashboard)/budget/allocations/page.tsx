"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Wallet, Download, TrendingUp, Building2, PieChartIcon } from "lucide-react"

const allocationsByService = [
  { name: 'Enseignement', budget: 28.5, color: '#7C3AED' },
  { name: 'Recherche', budget: 22.0, color: '#0D9488' },
  { name: 'Administration', budget: 15.5, color: '#2563EB' },
  { name: 'Infrastructure', budget: 12.0, color: '#D97706' },
  { name: 'Vie Étudiante', budget: 4.5, color: '#F59E0B' },
  { name: 'Autres', budget: 2.5, color: '#94A3B8' },
]

const byInstitution = [
  { name: 'ENSI', budget: 8.2 }, { name: 'ENIT', budget: 7.5 }, { name: 'FST', budget: 6.8 },
  { name: 'FSEGT', budget: 5.2 }, { name: 'INSAT', budget: 4.5 }, { name: 'SUPCOM', budget: 4.2 },
]

export default function AllocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B220' }}><Wallet size={20} className="text-cyan-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Allocations Budgétaires</h1><p className="text-sm text-slate-500">85M DT — Budget total 2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Budget Total', value: '85M DT', icon: Wallet, color: '#0891B2' },
          { label: 'Alloué', value: '78.5M DT', icon: TrendingUp, color: '#059669' },
          { label: 'Réservé', value: '6.5M DT', icon: Building2, color: '#F59E0B' },
          { label: 'Services', value: '12', icon: PieChartIcon, color: '#7C3AED' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Par Service</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={allocationsByService} dataKey="budget" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>{allocationsByService.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Top Institutions</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={byInstitution}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" /><YAxis unit=" MDT" /><Tooltip /><Bar dataKey="budget" fill="#0891B2" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
      </div>
    </div>
  )
}
