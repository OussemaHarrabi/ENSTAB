"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookMarked, Download, CheckCircle2, AlertTriangle, Clock, TrendingUp } from "lucide-react"

const loanData = [
  { month: 'Jan', prets: 520, retours: 480 },
  { month: 'Fév', prets: 580, retours: 510 },
  { month: 'Mar', prets: 650, retours: 590 },
  { month: 'Avr', prets: 720, retours: 630 },
  { month: 'Mai', prets: 600, retours: 580 },
]

export default function PretsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B4530920' }}><BookMarked size={20} className="text-amber-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Prêts</h1><p className="text-sm text-slate-500">2 300 prêts actifs — 85 en retard</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Prêts Actifs', value: '2 300', icon: BookMarked, color: '#B45309' },
          { label: 'En Retard', value: '85', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Retours Aujourd\'hui', value: '42', icon: CheckCircle2, color: '#059669' },
          { label: 'Taux Retour', value: '88%', icon: TrendingUp, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Prêts Mensuels</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={loanData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="prets" fill="#B45309" name="Prêts" radius={[4,4,0,0]} /><Bar dataKey="retours" fill="#059669" name="Retours" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
