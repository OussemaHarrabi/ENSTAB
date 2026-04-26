"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ClipboardList, Download, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

const requests = [
  { id: 'REQ-101', title: 'Création compte email', requester: 'Service RH', priority: 'Normale', status: 'En cours', date: '24 Avr 2025' },
  { id: 'REQ-102', title: 'Installation logiciel', requester: 'FST', priority: 'Haute', status: 'Résolu', date: '23 Avr 2025' },
  { id: 'REQ-103', title: 'Accès base données', requester: 'Recherche', priority: 'Urgente', status: 'En cours', date: '24 Avr 2025' },
  { id: 'REQ-104', title: 'Nouvel ordinateur', requester: 'Enseignement', priority: 'Normale', status: 'Planifié', date: '25 Avr 2025' },
  { id: 'REQ-105', title: 'Droits administrateur', requester: 'Informatique', priority: 'Haute', status: 'Résolu', date: '22 Avr 2025' },
  { id: 'REQ-106', title: 'Support visioconférence', requester: 'SG', priority: 'Normale', status: 'En cours', date: '24 Avr 2025' },
]

export default function DemandesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}><ClipboardList size={20} className="text-blue-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Demandes IT</h1><p className="text-sm text-slate-500">18 en attente — 45 résolues ce mois</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En Attente', value: '18', icon: Clock, color: '#2563EB' },
          { label: 'En Cours', value: '12', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Résolues', value: '45', icon: CheckCircle2, color: '#059669' },
          { label: 'SLA Respecté', value: '92%', icon: BarChart, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">ID</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Demande</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Demandeur</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Priorité</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Date</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{requests.map((r, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 text-xs font-mono text-slate-500">{r.id}</td><td className="py-3 px-4 font-medium">{r.title}</td><td className="py-3 px-4 text-slate-600">{r.requester}</td><td className="py-3 px-4"><Badge variant={r.priority === 'Urgente' ? 'destructive' : r.priority === 'Haute' ? 'warning' : 'default'} className="text-[10px]">{r.priority}</Badge></td><td className="py-3 px-4 text-slate-500">{r.date}</td><td className="py-3 px-4 text-center"><Badge variant={r.status === 'Résolu' ? 'success' : r.status === 'Planifié' ? 'default' : 'warning'}>{r.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
