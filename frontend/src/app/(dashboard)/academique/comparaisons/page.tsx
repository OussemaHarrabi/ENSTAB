"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

const instData = [
  { name: 'ENSI', taux: 82, aband: 5, emploi: 78 }, { name: 'FST', taux: 78, aband: 7, emploi: 72 },
  { name: 'ENIT', taux: 80, aband: 6, emploi: 85 }, { name: 'FSEGT', taux: 75, aband: 9, emploi: 80 },
  { name: 'INSAT', taux: 85, aband: 4, emploi: 88 }, { name: 'SUPCOM', taux: 79, aband: 6, emploi: 82 },
]

export default function ComparaisonsAcaPage() {
  const [metric, setMetric] = useState<'taux' | 'aband' | 'emploi'>('taux')
  const labels = { taux: 'Taux Réussite', aband: 'Taux Abandon', emploi: 'Taux Emploi' }
  const colors = { taux: '#4F46E5', aband: '#EF4444', emploi: '#059669' }
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E520' }}><BarChart3 size={20} className="text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Comparaisons Académiques</h1></div></div></div>
      </div>
      <div className="flex items-center gap-2">{(['taux', 'aband', 'emploi'] as const).map(k => (<button key={k} onClick={() => setMetric(k)} className={`px-4 py-2 rounded-lg text-sm font-medium ${metric === k ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{labels[k]}</button>))}</div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">{labels[metric]} par Institution</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={instData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" /><YAxis unit="%" /><Tooltip /><Bar dataKey={metric} fill={colors[metric]} radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
