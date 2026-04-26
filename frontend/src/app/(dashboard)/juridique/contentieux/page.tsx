"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Scale, Download, CheckCircle2, AlertTriangle, Clock, Gavel } from "lucide-react"

const cases = [
  { ref: 'C-2025-01', title: 'Contentieux propriété foncière', type: 'Foncier', status: 'En cours', date: '15 Jan 2025', partie: 'Université' },
  { ref: 'C-2025-02', title: 'Litige fournisseur informatique', type: 'Commercial', status: 'En cours', date: '12 Fév 2025', partie: 'Université' },
  { ref: 'C-2025-03', title: 'Contestation marché public', type: 'Administratif', status: 'Clôturé', date: '20 Mar 2025', partie: 'Tiers' },
  { ref: 'C-2025-04', title: 'Différend personnel', type: 'Social', status: 'En cours', date: '05 Avr 2025', partie: 'Université' },
]

const typeData = [
  { type: 'Foncier', count: 3 }, { type: 'Commercial', count: 5 }, { type: 'Administratif', count: 4 }, { type: 'Social', count: 2 }, { type: 'Pénal', count: 1 },
]

export default function ContentieuxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#991B1B20' }}><Scale size={20} className="text-red-800" /></div><div><h1 className="text-2xl font-bold text-slate-900">Contentieux</h1><p className="text-sm text-slate-500">8 cas actifs — 15 clôturés cette année</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Cas Actifs', value: '8', icon: Scale, color: '#991B1B' },
          { label: 'En Cours', value: '5', icon: Clock, color: '#F59E0B' },
          { label: 'Clôturés', value: '15', icon: CheckCircle2, color: '#059669' },
          { label: 'Taux Favorable', value: '82%', icon: Gavel, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Par Type</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={typeData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="type" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#991B1B" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Cas Récents</CardTitle></CardHeader><CardContent><div className="space-y-3">{cases.map((c, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{c.title}</p><p className="text-xs text-slate-400">{c.type} — {c.date}</p></div><div className="text-right"><Badge variant={c.status === 'Clôturé' ? 'success' : 'warning'}>{c.status}</Badge><p className="text-xs text-slate-400 mt-0.5">{c.partie}</p></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
