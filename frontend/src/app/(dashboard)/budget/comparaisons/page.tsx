"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

const institutions = [
  { name: 'ENSI', budget: 8.2, execution: 87.5, prevision: 8.5 },
  { name: 'ENIT', budget: 7.5, execution: 82.3, prevision: 7.8 },
  { name: 'FST', budget: 6.8, execution: 91.2, prevision: 7.0 },
  { name: 'FSEGT', budget: 5.2, execution: 78.5, prevision: 5.5 },
  { name: 'INSAT', budget: 4.5, execution: 88.0, prevision: 4.8 },
  { name: 'SUPCOM', budget: 4.2, execution: 85.5, prevision: 4.4 },
  { name: 'ISAMM', budget: 3.8, execution: 79.2, prevision: 4.0 },
  { name: 'ISG', budget: 3.5, execution: 76.8, prevision: 3.6 },
]

export default function ComparaisonsBudPage() {
  const [sortBy, setSortBy] = useState<'budget' | 'execution'>('budget')
  const sorted = [...institutions].sort((a, b) => sortBy === 'budget' ? b.budget - a.budget : b.execution - a.execution)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B220' }}><BarChart3 size={20} className="text-cyan-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Comparaisons Budgétaires</h1><p className="text-sm text-slate-500">Comparer les budgets par institution</p></div></div></div>
      </div>
      <div className="flex items-center gap-2"><span className="text-xs text-slate-500">Trier par:</span>{['budget', 'execution'].map(k => (<button key={k} onClick={() => setSortBy(k as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${sortBy === k ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{k === 'budget' ? 'Budget' : 'Taux Exécution'}</button>))}</div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Institution</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Budget (MDT)</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Exécution %</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Prévision 2026</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase w-32">Barre</th></tr></thead>
        <tbody>{sorted.map((i, idx) => (<tr key={idx} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{i.name}</td><td className="py-3 px-4 text-right font-bold">{i.budget.toFixed(1)}</td><td className="py-3 px-4 text-right"><span className={i.execution >= 85 ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>{i.execution}%</span></td><td className="py-3 px-4 text-right text-slate-600">{i.prevision.toFixed(1)}</td><td className="py-3 px-4"><div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${i.execution}%` }}></div></div></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
