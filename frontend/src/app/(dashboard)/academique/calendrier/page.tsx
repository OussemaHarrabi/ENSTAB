"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { CalendarDays, Download, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

const events = [
  { date: '15-20 Sep 2025', event: 'Pré-rentrée administrative', type: 'Administratif', status: 'Planifié' },
  { date: '22 Sep 2025', event: 'Début des cours S1', type: 'Académique', status: 'Planifié' },
  { date: '01-15 Oct 2025', event: 'Période d\'inscription', type: 'Administratif', status: 'Planifié' },
  { date: '15-30 Nov 2025', event: 'Examens partiels', type: 'Académique', status: 'Planifié' },
  { date: '20 Déc-05 Jan', event: 'Vacances hiver', type: 'Académique', status: 'Planifié' },
  { date: '12-30 Jan 2026', event: 'Examens S1', type: 'Académique', status: 'Planifié' },
  { date: '02 Fév 2026', event: 'Début S2', type: 'Académique', status: 'Planifié' },
  { date: '15-20 Mar 2026', event: 'Journées portes ouvertes', type: 'Événement', status: 'Planifié' },
]

export default function CalendrierPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E520' }}><CalendarDays size={20} className="text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Calendrier Académique</h1><p className="text-sm text-slate-500">Année universitaire 2025-2026</p></div></div></div>
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Dates</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Événement</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Type</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{events.map((e, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{e.date}</td><td className="py-3 px-4">{e.event}</td><td className="py-3 px-4"><Badge variant="outline" className="text-[10px]">{e.type}</Badge></td><td className="py-3 px-4 text-center"><Badge variant="default">{e.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
