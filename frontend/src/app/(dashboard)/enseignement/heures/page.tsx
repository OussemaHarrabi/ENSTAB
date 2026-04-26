"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Activity, Download, TrendingUp, AlertTriangle, Users, Clock } from "lucide-react"

const monthlyHours = [
  { month: 'Sep', prevues: 2800, effectuees: 2650 },
  { month: 'Oct', prevues: 3200, effectuees: 3100 },
  { month: 'Nov', prevues: 3100, effectuees: 2950 },
  { month: 'Déc', prevues: 2500, effectuees: 2400 },
  { month: 'Jan', prevues: 2900, effectuees: 2750 },
  { month: 'Fév', prevues: 3000, effectuees: 2850 },
  { month: 'Mar', prevues: 3100, effectuees: 3000 },
  { month: 'Avr', prevues: 2800, effectuees: 2700 },
]

export default function HeuresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED20' }}><Activity size={20} className="text-violet-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Suivi des Heures</h1><p className="text-sm text-slate-500">Année universitaire 2024-2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Heures Effectuées', value: '22 400', icon: Clock, color: '#7C3AED' },
          { label: 'Taux Réalisation', value: '95.2%', icon: TrendingUp, color: '#059669' },
          { label: 'Heures Sup.', value: '340', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Enseignants Actifs', value: '190', icon: Users, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Heures Prévues vs Effectuées</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthlyHours}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="prevues" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" name="Prévues" /><Line type="monotone" dataKey="effectuees" stroke="#7C3AED" strokeWidth={2} name="Effectuées" /></LineChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
