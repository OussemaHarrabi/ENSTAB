"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Download, Globe, Target, ArrowUp, ArrowDown } from "lucide-react"

const rankData = [
  { year: '2021', the: 1201, qs: 1400, greenmetric: 350 },
  { year: '2022', the: 801, qs: 1001, greenmetric: 220 },
  { year: '2023', the: 601, qs: 801, greenmetric: 180 },
  { year: '2024', the: 501, qs: 651, greenmetric: 145 },
  { year: '2025', the: 401, qs: 551, greenmetric: 120 },
]

export default function ClassementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><Globe size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Classements</h1><p className="text-sm text-slate-500">Position UCAR dans les classements internationaux</p></div></div></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'THE 2025', value: '#401', target: '#350', delta: '+100', icon: ArrowUp, color: '#2563EB' },
          { label: 'QS 2025', value: '#551', target: '#450', delta: '+100', icon: ArrowUp, color: '#7C3AED' },
          { label: 'GreenMetric 2025', value: '#120', target: '#100', delta: '+25', icon: ArrowUp, color: '#059669' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-5 flex items-center justify-between"><div><div className="flex items-center gap-1 text-sm text-slate-500"><s.icon size={14} style={{ color: s.color }} />{s.label}</div><p className="text-3xl font-bold text-slate-900 mt-1">{s.value}</p><p className="text-xs text-slate-400">Objectif: {s.target}</p></div><div className="text-right"><Badge variant="success">+{s.delta}</Badge></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Progression des Classements</CardTitle></CardHeader><CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={rankData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="year" /><YAxis reversed domain={[0, 1500]} tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="the" stroke="#2563EB" strokeWidth={2} name="THE" /><Line type="monotone" dataKey="qs" stroke="#7C3AED" strokeWidth={2} name="QS" /><Line type="monotone" dataKey="greenmetric" stroke="#059669" strokeWidth={2} name="GreenMetric" /></LineChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
