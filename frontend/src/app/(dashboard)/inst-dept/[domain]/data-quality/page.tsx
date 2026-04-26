"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui"

export default function InstDeptDataQualityPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Qualité des Données</h1>
      <Card><CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6"><div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-500 flex items-center justify-center"><span className="text-2xl font-bold text-blue-600">87%</span></div><div><p className="font-semibold text-lg">Score Global</p><p className="text-sm text-slate-500">Qualité des données du département</p></div></div>
        {[{ name: 'Complétude', val: 92 }, { name: 'Cohérence', val: 85 }, { name: 'Rapidité', val: 78 }, { name: 'Validité', val: 90 }].map(m => (
          <div key={m.name} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"><span className="text-sm text-slate-600 w-24">{m.name}</span><Progress value={m.val} className="flex-1" /><span className="text-sm font-medium w-10 text-right">{m.val}%</span></div>
        ))}
      </CardContent></Card>
    </div>
  )
}
