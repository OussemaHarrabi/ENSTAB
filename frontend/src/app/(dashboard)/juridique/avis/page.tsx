"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileText, Download, Clock, CheckCircle2, Scale } from "lucide-react"

const opinions = [
  { title: 'Marché maintenance IT', requester: 'Informatique', date: '22 Avr 2025', status: 'Émis', type: 'Marchés' },
  { title: 'Convention partenariat ENIT', requester: 'Recherche', date: '20 Avr 2025', status: 'Émis', type: 'Partenariat' },
  { title: 'Règlement intérieur', requester: 'SG', date: '18 Avr 2025', status: 'En cours', type: 'Règlementaire' },
  { title: 'Contrat fourniture', requester: 'Finances', date: '15 Avr 2025', status: 'Émis', type: 'Contrats' },
  { title: 'Protocole accord', requester: 'Relations Internationales', date: '12 Avr 2025', status: 'Demandé', type: 'Partenariat' },
]

const typeData = [
  { type: 'Marchés', count: 12 }, { type: 'Contrats', count: 18 }, { type: 'Règlementaire', count: 8 }, { type: 'Partenariat', count: 6 }, { type: 'Contentieux', count: 4 },
]

export default function AvisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#991B1B20' }}><Scale size={20} className="text-red-800" /></div><div><h1 className="text-2xl font-bold text-slate-900">Avis Juridiques</h1><p className="text-sm text-slate-500">28 avis émis cette année — 5 en cours</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Émis (année)', value: '28', icon: CheckCircle2, color: '#059669' },
          { label: 'En Cours', value: '5', icon: Clock, color: '#F59E0B' },
          { label: 'Demandés', value: '3', icon: FileText, color: '#2563EB' },
          { label: 'Délai Moyen', value: '4.2 jours', icon: Scale, color: '#991B1B' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Par Catégorie</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={typeData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="type" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#991B1B" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Avis Récents</CardTitle></CardHeader><CardContent><div className="space-y-3">{opinions.map((o, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{o.title}</p><p className="text-xs text-slate-400">{o.requester} — {o.date}</p></div><Badge variant={o.status === 'Émis' ? 'success' : o.status === 'En cours' ? 'warning' : 'default'}>{o.status}</Badge></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
