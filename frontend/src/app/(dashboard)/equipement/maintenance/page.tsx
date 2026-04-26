"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Wrench, Download, CheckCircle2, Clock, AlertTriangle, Users } from "lucide-react"

const requests = [
  { id: 'MAINT-01', title: 'Fuite d\'eau bâtiment B', priority: 'Urgente', status: 'En cours', date: '24 Avr 2025', assigned: 'Hamdi Moulhi' },
  { id: 'MAINT-02', title: 'Climatisation amphithéâtre', priority: 'Haute', status: 'Planifié', date: '25 Avr 2025', assigned: 'Maher Riahi' },
  { id: 'MAINT-03', title: 'Réparation électricité', priority: 'Urgente', status: 'Résolu', date: '23 Avr 2025', assigned: 'Akram Azzabi' },
  { id: 'MAINT-04', title: 'Porte bloquée entrée', priority: 'Basse', status: 'En cours', date: '22 Avr 2025', assigned: 'Hamdi Moulhi' },
  { id: 'MAINT-05', title: 'Peinture couloir RDC', priority: 'Moyenne', status: 'Planifié', date: '28 Avr 2025', assigned: 'Maher Riahi' },
]

const priorityData = [
  { level: 'Urgente', count: 3 }, { level: 'Haute', count: 5 }, { level: 'Moyenne', count: 8 }, { level: 'Basse', count: 4 },
]

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D9770620' }}><Wrench size={20} className="text-orange-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Maintenance</h1><p className="text-sm text-slate-500">8 demandes ouvertes — Temps réponse moyen: 4.2h</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Demandes', value: '20', icon: Wrench, color: '#D97706' },
          { label: 'En Cours', value: '8', icon: Clock, color: '#2563EB' },
          { label: 'Résolues (mois)', value: '35', icon: CheckCircle2, color: '#059669' },
          { label: 'Taux Résolution', value: '87%', icon: AlertTriangle, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Par Priorité</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={priorityData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="level" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#D97706" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Demandes Récentes</CardTitle></CardHeader><CardContent><div className="space-y-2">{requests.map((r, i) => (<div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100"><div><p className="text-sm font-medium text-slate-900">{r.title}</p><p className="text-xs text-slate-400">Assigné: {r.assigned}</p></div><div className="flex items-center gap-2"><Badge variant={r.priority === 'Urgente' ? 'destructive' : r.priority === 'Haute' ? 'warning' : 'default'} className="text-[10px]">{r.priority}</Badge><Badge variant={r.status === 'Résolu' ? 'success' : 'default'}>{r.status}</Badge></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
