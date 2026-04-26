"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Wallet, Download, TrendingUp, TrendingDown, Building2, ArrowUp, ArrowDown } from "lucide-react"

const monthlyFlow = [
  { month: 'Jan', entrées: 2.8, sorties: 2.2 }, { month: 'Fév', entrées: 3.2, sorties: 2.8 },
  { month: 'Mar', entrées: 2.5, sorties: 3.1 }, { month: 'Avr', entrées: 3.5, sorties: 2.5 },
  { month: 'Mai', entrées: 2.8, sorties: 2.6 }, { month: 'Juin', entrées: 4.2, sorties: 3.5 },
]

const accounts = [
  { name: 'Compte Courant', bank: 'BH Bank', solde: 2.450, devise: 'MDT', lastOp: '24 Avr 2025' },
  { name: 'Compte Projets', bank: 'BIAT', solde: 4.280, devise: 'MDT', lastOp: '22 Avr 2025' },
  { name: 'Compte Paie', bank: 'ATB', solde: 1.120, devise: 'MDT', lastOp: '25 Avr 2025' },
]

export default function TresoreriePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#05966920' }}><Wallet size={20} className="text-emerald-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Trésorerie</h1><p className="text-sm text-slate-500">7.85 MDT — Solde global</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Solde Global', value: '7.85 MDT', icon: Wallet, color: '#059669', trend: '+2.1%' },
          { label: 'Entrées du Mois', value: '2.8 MDT', icon: TrendingUp, color: '#2563EB', trend: '+12%' },
          { label: 'Sorties du Mois', value: '2.6 MDT', icon: TrendingDown, color: '#EF4444', trend: '-8%' },
          { label: 'Comptes Actifs', value: '3', icon: Building2, color: '#F59E0B', trend: '' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4"><div className="flex items-center gap-2 text-sm text-slate-500"><s.icon size={16} style={{ color: s.color }} />{s.label}</div><p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>{s.trend && <p className="text-xs" style={{ color: s.trend.startsWith('+') ? '#059669' : '#EF4444' }}>{s.trend}</p>}</CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Flux de Trésorerie</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyFlow}><defs><linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.3}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis unit=" MDT" /><Tooltip /><Area type="monotone" dataKey="entrées" stroke="#059669" fill="url(#inflow)" strokeWidth={2} name="Entrées" /><Area type="monotone" dataKey="sorties" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} name="Sorties" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Comptes Bancaires</CardTitle></CardHeader><CardContent><div className="space-y-3">{accounts.map((a, i) => (<div key={i} className="p-4 rounded-xl border border-slate-100"><div className="flex justify-between items-start"><div><p className="font-medium text-slate-900">{a.name}</p><p className="text-xs text-slate-400">{a.bank}</p></div><div className="text-right"><p className="text-lg font-bold text-slate-900">{a.solde.toFixed(3)} MDT</p><p className="text-xs text-slate-400">Dernière op.: {a.lastOp}</p></div></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
