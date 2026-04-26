"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ClipboardList, Download, Users, Clock, AlertTriangle, Building2 } from "lucide-react"

const charges = [
  { department: 'Informatique', teachers: 45, hours: 3240, avg_hours: 72, ratio: 18.5 },
  { department: 'Mathématiques', teachers: 38, hours: 2850, avg_hours: 75, ratio: 22.3 },
  { department: 'Physique', teachers: 32, hours: 2400, avg_hours: 75, ratio: 20.1 },
  { department: 'Économie', teachers: 28, hours: 1960, avg_hours: 70, ratio: 25.4 },
  { department: 'Langues', teachers: 25, hours: 1625, avg_hours: 65, ratio: 28.2 },
  { department: 'Droit', teachers: 22, hours: 1430, avg_hours: 65, ratio: 30.5 },
]

export default function ChargesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED20' }}><ClipboardList size={20} className="text-violet-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Charges d'Enseignement</h1><p className="text-sm text-slate-500">Répartition par département — Semestre 2, 2024-2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Enseignants', value: '190', icon: Users, color: '#7C3AED' },
          { label: 'Heures Total', value: '13 505', icon: Clock, color: '#2563EB' },
          { label: 'Moy. Hebdo', value: '70h', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Départements', value: '6', icon: Building2, color: '#059669' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Heures par Département</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={charges}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="department" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="hours" fill="#7C3AED" name="Heures" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
