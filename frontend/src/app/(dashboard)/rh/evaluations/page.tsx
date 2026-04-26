"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ClipboardList, Download, Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react"

const evaluations = [
  { name: 'Oussema Khimissi', poste: 'Administrateur', note: 4.2, statut: 'Complété', date: '15 Mar 2025', manager: 'M. Khedimallah' },
  { name: 'Chiraz Hajji', poste: 'Administrateur', note: 3.8, statut: 'Complété', date: '12 Mar 2025', manager: 'M. Khedimallah' },
  { name: 'Ahlem Hkimi', poste: 'Administrateur', note: 4.0, statut: 'En cours', date: '—', manager: 'B. Chatti' },
  { name: 'Essia Saidi', poste: 'Administrateur', note: 3.5, statut: 'En attente', date: '—', manager: 'B. Chatti' },
  { name: 'Rihab Elaamri', poste: 'Administrateur', note: 4.5, statut: 'Complété', date: '10 Mar 2025', manager: 'R. Elwafi' },
]

const stats = [
  { month: 'Jan', completees: 25, en_attente: 12 },
  { month: 'Fév', completees: 32, en_attente: 8 },
  { month: 'Mar', completees: 28, en_attente: 15 },
  { month: 'Avr', completees: 35, en_attente: 10 },
  { month: 'Mai', completees: 20, en_attente: 18 },
]

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820' }}><ClipboardList size={20} className="text-teal-600" /></div>
            <div><h1 className="text-2xl font-bold text-slate-900">Évaluations du Personnel</h1><p className="text-sm text-slate-500">Cycle 2025 — Taux de complétion: 62%</p></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Évaluations Planifiées', value: '285', icon: ClipboardList, color: '#0D9488' },
          { label: 'Complétées', value: '177', icon: CheckCircle2, color: '#059669' },
          { label: 'En Cours', value: '68', icon: Clock, color: '#F59E0B' },
          { label: 'En Attente', value: '40', icon: AlertTriangle, color: '#EF4444' },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Progression des Évaluations</CardTitle></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="completees" fill="#059669" name="Complétées" radius={[4, 4, 0, 0]} /><Bar dataKey="en_attente" fill="#F59E0B" name="En attente" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Dernières Évaluations</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">{evaluations.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div><p className="text-sm font-medium text-slate-900">{e.name}</p><p className="text-xs text-slate-400">{e.poste} — {e.manager}</p></div>
              <div className="text-right"><Badge variant={e.statut === 'Complété' ? 'success' : e.statut === 'En cours' ? 'warning' : 'default'}>{e.statut}</Badge>{e.note && <p className="text-xs text-slate-500 mt-0.5">Note: {e.note}/5</p>}</div>
            </div>
          ))}</div></CardContent></Card>
      </div>
    </div>
  )
}
