"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Wallet, CheckCircle2, AlertTriangle } from "lucide-react"

const budgetData = [
  { category: 'Abonnements', allocated: 180, spent: 165 }, { category: 'Nouvelles Acquisitions', allocated: 85, spent: 72 },
  { category: 'Maintenance', allocated: 35, spent: 28 }, { category: 'Formation', allocated: 20, spent: 15 },
]

export default function BudgetBibPage() {
  const totalAllocated = budgetData.reduce((a, b) => a + b.allocated, 0)
  const totalSpent = budgetData.reduce((a, b) => a + b.spent, 0)
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B4530920' }}><Wallet size={20} className="text-amber-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Budget Bibliothèque</h1><p className="text-sm text-slate-500">{totalAllocated}K DT alloué — {totalSpent}K DT consommé</p></div></div></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Alloué', value: `${totalAllocated}K DT`, icon: Wallet, color: '#B45309' },
          { label: 'Consommé', value: `${totalSpent}K DT`, icon: CheckCircle2, color: '#059669' },
          { label: 'Taux Exécution', value: `${Math.round(totalSpent / totalAllocated * 100)}%`, icon: AlertTriangle, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Par Catégorie</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={budgetData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="category" tick={{ fontSize: 11 }} /><YAxis unit="K DT" /><Tooltip /><Bar dataKey="allocated" fill="#E2E8F0" name="Alloué" radius={[4,4,0,0]} /><Bar dataKey="spent" fill="#B45309" name="Consommé" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
