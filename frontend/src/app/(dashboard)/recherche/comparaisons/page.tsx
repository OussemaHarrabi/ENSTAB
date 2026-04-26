"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Download } from "lucide-react"
import { useState } from "react"

const inst = [
  { name: 'FST', pubs: 85, aff: 78, phds: 45, projets: 12 },
  { name: 'ENIT', pubs: 72, aff: 65, phds: 38, projets: 10 },
  { name: 'ENSI', pubs: 68, aff: 62, phds: 32, projets: 8 },
  { name: 'FSEGT', pubs: 55, aff: 48, phds: 28, projets: 6 },
  { name: 'INSAT', pubs: 52, aff: 45, phds: 25, projets: 5 },
]
export default function ComparaisonsRecPage() {
  const [metric, setMetric] = useState<'pubs' | 'aff' | 'phds' | 'projets'>('pubs')
  const labels = { pubs: 'Publications', aff: 'Affiliées', phds: 'Doctorants', projets: 'Projets' }
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><BarChart3 size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Comparaisons Recherche</h1></div></div></div>
      </div>
      <div className="flex items-center gap-2">{Object.entries(labels).map(([k, v]) => (<button key={k} onClick={() => setMetric(k as any)} className={`px-4 py-2 rounded-lg text-sm font-medium ${metric === k ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{v}</button>))}</div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">{labels[metric]} par Institution</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={inst}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey={metric} fill="#9333EA" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
