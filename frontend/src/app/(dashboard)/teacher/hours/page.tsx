"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Progress } from "@/components/ui"
import { Clock, Plus } from "lucide-react"

export default function TeacherHoursPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Relevé d'Heures</h1><Button size="sm"><Plus size={14} className="mr-1" />Ajouter</Button></div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500">Heures effectuées</p><p className="text-2xl font-bold text-slate-900">42h</p><Progress value={87} className="mt-2" /></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500">Volume horaire prévu</p><p className="text-2xl font-bold text-slate-900">48h</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500">Heures supplémentaires</p><p className="text-2xl font-bold text-amber-600">4h</p></CardContent></Card>
      </div>
      <Card><CardContent className="space-y-2 p-6">
        {[1, 2, 3, 4, 5].map(w => (
          <div key={w} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-700">Semaine {w} — Avril 2025</span>
            <div className="flex items-center gap-4"><span className="text-sm font-medium">{7 + w * 1.5}h</span><span className="text-xs text-slate-400">Prévu: {8}h</span></div>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
