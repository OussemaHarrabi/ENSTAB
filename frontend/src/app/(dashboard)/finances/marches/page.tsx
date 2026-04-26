"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { ScrollText, Download, Activity, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

const markets = [
  { ref: 'M-2025-01', title: 'Acquisition équipements IT', budget: 350000, dept: 'Informatique', status: 'En cours', deadline: '30 Juin 2025' },
  { ref: 'M-2025-02', title: 'Travaux rénovation bâtiment A', budget: 1200000, dept: 'Équipement', status: 'Publié', deadline: '15 Mai 2025' },
  { ref: 'M-2025-03', title: 'Fourniture mobilier', budget: 180000, dept: 'Budget', status: 'Attribué', deadline: '01 Mai 2025' },
  { ref: 'M-2025-04', title: 'Services de nettoyage', budget: 600000, dept: 'Juridique', status: 'En cours', deadline: '20 Juin 2025' },
  { ref: 'M-2025-05', title: 'Abonnements numériques', budget: 250000, dept: 'Bibliothèque', status: 'Publié', deadline: '10 Mai 2025' },
]

export default function MarchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#05966920' }}><ScrollText size={20} className="text-emerald-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Marchés Publics</h1><p className="text-sm text-slate-500">12 marchés actifs — 2.58M DT engagés</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Marchés Actifs', value: '12', icon: Activity, color: '#059669' },
          { label: 'Publiés', value: '2', icon: AlertTriangle, color: '#2563EB' },
          { label: 'Attribués', value: '5', icon: CheckCircle2, color: '#0D9488' },
          { label: 'En Évaluation', value: '3', icon: Clock, color: '#F59E0B' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Réf.</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Marché</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Budget</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Service</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Échéance</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{markets.map((m, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 text-xs font-mono text-slate-500">{m.ref}</td><td className="py-3 px-4 font-medium">{m.title}</td><td className="py-3 px-4 text-right font-medium">{m.budget.toLocaleString()} DT</td><td className="py-3 px-4 text-slate-600">{m.dept}</td><td className="py-3 px-4 text-slate-500">{m.deadline}</td><td className="py-3 px-4 text-center"><Badge variant={m.status === 'Attribué' ? 'success' : m.status === 'Publié' ? 'warning' : 'default'}>{m.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
