"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertTriangle, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const pending = [
  { name: 'Ahmed Ben Ali', type: 'Congé Annuel', days: 12, period: '01-15 Mai 2025', status: 'En attente' },
  { name: 'Sana Mejri', type: 'Congé Maladie', days: 3, period: '08-10 Mai 2025', status: 'Approuvé' },
  { name: 'Karim Jarraya', type: 'Congé Formation', days: 5, period: '12-16 Mai 2025', status: 'En attente' },
  { name: 'Amira Ben Salah', type: 'Congé Annuel', days: 7, period: '20-26 Mai 2025', status: 'Refusé' },
  { name: 'Mohamed Ali', type: 'Congé Exceptionnel', days: 2, period: '15 Mai 2025', status: 'En attente' },
]

const monthlyData = [
  { month: 'Jan', pris: 85, planifies: 95 },
  { month: 'Fév', pris: 72, planifies: 80 },
  { month: 'Mar', pris: 95, planifies: 100 },
  { month: 'Avr', pris: 110, planifies: 120 },
  { month: 'Mai', pris: 90, planifies: 105 },
  { month: 'Juin', pris: 70, planifies: 85 },
]

export default function CongesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820' }}><CalendarDays size={20} className="text-teal-600" /></div>
            <div><h1 className="text-2xl font-bold text-slate-900">Gestion des Congés</h1><p className="text-sm text-slate-500">12 demandes en attente — 520 agents</p></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Demandes ce mois', value: '45', icon: Clock, color: '#0D9488' },
          { label: 'En attente', value: '12', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Approuvées', value: '28', icon: CheckCircle2, color: '#059669' },
          { label: 'Refusées', value: '5', icon: XCircle, color: '#EF4444' },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Demandes par Mois</CardTitle></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="pris" fill="#0D9488" name="Pris" radius={[4, 4, 0, 0]} /><Bar dataKey="planifies" fill="#E2E8F0" name="Planifiés" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Demandes Récentes</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">{pending.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div><p className="text-sm font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.type} — {p.days} jours</p></div>
              <div className="text-right"><Badge variant={p.status === 'Approuvé' ? 'success' : p.status === 'Refusé' ? 'destructive' : 'warning'}>{p.status}</Badge><p className="text-xs text-slate-400 mt-0.5">{p.period}</p></div>
            </div>
          ))}</div></CardContent></Card>
      </div>
    </div>
  )
}
