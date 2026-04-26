"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { CalendarDays, Download, CheckCircle2, Clock, Users } from "lucide-react"

const reunions = [
  { title: 'Conseil d\'Université', date: '15 Mai 2025', time: '09:00', lieu: 'Salle du Conseil', participants: 18, status: 'Planifié' },
  { title: 'Comité de Direction', date: '08 Mai 2025', time: '10:00', lieu: 'Bureau du Président', participants: 12, status: 'Planifié' },
  { title: 'Commission Budget', date: '25 Avr 2025', time: '14:00', lieu: 'Salle de Réunion', participants: 8, status: 'Tenue' },
  { title: 'Bureau Exécutif', date: '18 Avr 2025', time: '09:30', lieu: 'Salle du Conseil', participants: 15, status: 'Tenue' },
  { title: 'Réunion SG-Directeurs', date: '10 Avr 2025', time: '11:00', lieu: 'SG Office', participants: 10, status: 'Tenue' },
  { title: 'Commission des Marchés', date: '05 Juin 2025', time: '10:00', lieu: 'Salle de Réunion', participants: 7, status: 'Planifié' },
]

export default function ReunionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A556820' }}><CalendarDays size={20} className="text-slate-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Réunions</h1><p className="text-sm text-slate-500">18 réunions ce mois — 3 programmées</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Ce Mois', value: '18', icon: CalendarDays, color: '#4A5568' },
          { label: 'Planifiées', value: '3', icon: Clock, color: '#2563EB' },
          { label: 'Tenues', value: '15', icon: CheckCircle2, color: '#059669' },
          { label: 'Participants', value: '70', icon: Users, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Réunion</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Date</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Lieu</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Participants</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{reunions.map((r, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{r.title}</td><td className="py-3 px-4 text-slate-600">{r.date} {r.time}</td><td className="py-3 px-4 text-slate-500">{r.lieu}</td><td className="py-3 px-4 text-center">{r.participants}</td><td className="py-3 px-4 text-center"><Badge variant={r.status === 'Tenue' ? 'success' : 'default'}>{r.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
