"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, Download, Clock, CheckCircle2, Monitor, AlertCircle } from "lucide-react"

const incidents = [
  { id: 'INC-045', title: 'Panne serveur FST', service: 'Réseau', priority: 'Critique', status: 'En cours', date: '24 Avr 2025', sla: '2h' },
  { id: 'INC-046', title: 'Problème connexion ENSI', service: 'WiFi', priority: 'Haute', status: 'Résolu', date: '23 Avr 2025', sla: '4h' },
  { id: 'INC-047', title: 'Mise à jour ERP', service: 'Logiciel', priority: 'Moyenne', status: 'Planifié', date: '25 Avr 2025', sla: '24h' },
  { id: 'INC-048', title: 'Attaque phishing signalée', service: 'Sécurité', priority: 'Critique', status: 'En cours', date: '24 Avr 2025', sla: '1h' },
  { id: 'INC-049', title: 'Imprimante hors service', service: 'Matériel', priority: 'Basse', status: 'Résolu', date: '22 Avr 2025', sla: '48h' },
  { id: 'INC-050', title: 'Problème accès base', service: 'Base de données', priority: 'Haute', status: 'En cours', date: '24 Avr 2025', sla: '3h' },
]

const priorityData = [
  { level: 'Critique', count: 3 }, { level: 'Haute', count: 5 }, { level: 'Moyenne', count: 8 }, { level: 'Basse', count: 6 },
]

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}><AlertTriangle size={20} className="text-blue-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Incidents IT</h1><p className="text-sm text-slate-500">Temps moyen résolution: 2.4h — SLA: 94.2%</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Incidents Ouverts', value: '12', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Résolus (mois)', value: '45', icon: CheckCircle2, color: '#059669' },
          { label: 'Temps Moyen', value: '2.4h', icon: Clock, color: '#2563EB' },
          { label: 'SLA Atteint', value: '94.2%', icon: Monitor, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Par Priorité</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={priorityData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="level" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#2563EB" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Derniers Incidents</CardTitle></CardHeader><CardContent><div className="space-y-2">{incidents.map((inc, i) => (<div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 text-sm"><div className="flex items-center gap-2"><span className="text-xs font-mono text-slate-400">{inc.id}</span><span className="font-medium text-slate-900">{inc.title}</span></div><div className="flex items-center gap-2"><Badge variant={inc.priority === 'Critique' ? 'destructive' : inc.priority === 'Haute' ? 'warning' : inc.priority === 'Moyenne' ? 'default' : 'outline'} className="text-[10px]">{inc.priority}</Badge><Badge variant={inc.status === 'Résolu' ? 'success' : inc.status === 'Planifié' ? 'default' : 'warning'} className="text-[10px]">{inc.status}</Badge></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
