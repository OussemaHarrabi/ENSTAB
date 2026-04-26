"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { FileText, Download, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

const decisions = [
  { ref: 'D-2025-001', title: 'Nomination Chef département FST', type: 'Nominative', date: '22 Avr 2025', status: 'Publié' },
  { ref: 'D-2025-002', title: 'Budget complémentaire recherche', type: 'Financière', date: '20 Avr 2025', status: 'En cours' },
  { ref: 'D-2025-003', title: 'Calendrier universitaire 2025-2026', type: 'Académique', date: '18 Avr 2025', status: 'Publié' },
  { ref: 'D-2025-004', title: 'Règlement intérieur bibliothèque', type: 'Réglementaire', date: '15 Avr 2025', status: 'Projet' },
  { ref: 'D-2025-005', title: 'Programme de formation continue', type: 'Pédagogique', date: '12 Avr 2025', status: 'Publié' },
]

export default function DecisionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A556820' }}><FileText size={20} className="text-slate-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Décisions</h1><p className="text-sm text-slate-500">45 décisions publiées en 2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Publiées (année)', value: '45', icon: CheckCircle2, color: '#059669' },
          { label: 'En Cours', value: '8', icon: Clock, color: '#2563EB' },
          { label: 'Projets', value: '5', icon: FileText, color: '#4A5568' },
          { label: 'En Attente', value: '3', icon: AlertTriangle, color: '#F59E0B' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Réf.</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Décision</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Type</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Date</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{decisions.map((d, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 text-xs font-mono text-slate-500">{d.ref}</td><td className="py-3 px-4 font-medium text-slate-900">{d.title}</td><td className="py-3 px-4 text-slate-600">{d.type}</td><td className="py-3 px-4 text-slate-500">{d.date}</td><td className="py-3 px-4 text-center"><Badge variant={d.status === 'Publié' ? 'success' : d.status === 'En cours' ? 'warning' : 'default'}>{d.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
