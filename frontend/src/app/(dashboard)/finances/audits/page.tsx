"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileSearch, Download, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

const audits = [
  { id: 'AUD-2025-01', service: 'RH', type: 'Audit RH', date: '15 Jan 2025', findings: 3, critical: 0, status: 'Clôturé' },
  { id: 'AUD-2025-02', service: 'Finances', type: 'Audit Financier', date: '12 Fév 2025', findings: 5, critical: 1, status: 'Clôturé' },
  { id: 'AUD-2025-03', service: 'Informatique', type: 'Audit Sécurité', date: '20 Mar 2025', findings: 7, critical: 2, status: 'Suivi' },
  { id: 'AUD-2025-04', service: 'Équipement', type: 'Audit Patrimoine', date: '05 Avr 2025', findings: 4, critical: 0, status: 'Suivi' },
  { id: 'AUD-2025-05', service: 'Académique', type: 'Audit Qualité', date: '25 Avr 2025', findings: 2, critical: 0, status: 'Planifié' },
]

const findingsData = [
  { category: 'Financier', count: 18 },
  { category: 'Conformité', count: 12 },
  { category: 'Sécurité', count: 8 },
  { category: 'Opérationnel', count: 15 },
  { category: 'RH', count: 6 },
]

export default function AuditsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#05966920' }}><FileSearch size={20} className="text-emerald-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Audits</h1><p className="text-sm text-slate-500">5 audits planifiés en 2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Audits Réalisés', value: '3', icon: CheckCircle2, color: '#059669' },
          { label: 'En Suivi', value: '2', icon: Clock, color: '#2563EB' },
          { label: 'Non-Conformités', value: '21', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Critiques', value: '3', icon: AlertTriangle, color: '#F59E0B' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Non-Conformités par Catégorie</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={findingsData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis type="number" /><YAxis dataKey="category" type="category" width={100} /><Tooltip /><Bar dataKey="count" fill="#EF4444" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Rapports d'Audit</CardTitle></CardHeader><CardContent><div className="space-y-3">{audits.map((a, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{a.type}</p><p className="text-xs text-slate-400">{a.service} — {a.date}</p></div><div className="text-right flex items-center gap-3"><div><Badge variant={a.critical > 0 ? 'destructive' : 'default'}>{a.findings} constats</Badge></div><Badge variant={a.status === 'Clôturé' ? 'success' : a.status === 'Planifié' ? 'default' : 'warning'}>{a.status}</Badge></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
