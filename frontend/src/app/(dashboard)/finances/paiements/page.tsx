"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Activity, Download, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

const payments = [
  { id: 'P-001', beneficiary: 'Tunisie Telecom', amount: 45000, service: 'Informatique', status: 'Effectué', date: '24 Avr 2025' },
  { id: 'P-002', beneficiary: 'STEG', amount: 125000, service: 'Équipement', status: 'En attente', date: '30 Avr 2025' },
  { id: 'P-003', beneficiary: 'Fournisseur Bureau', amount: 28500, service: 'Budget', status: 'Validé', date: '25 Avr 2025' },
  { id: 'P-004', beneficiary: 'SONEDE', amount: 42000, service: 'Équipement', status: 'En cours', date: '28 Avr 2025' },
  { id: 'P-005', beneficiary: 'Presse Universitaire', amount: 18000, service: 'Bibliothèque', status: 'Effectué', date: '22 Avr 2025' },
  { id: 'P-006', beneficiary: 'Maintenance Ascenseurs', amount: 15000, service: 'Équipement', status: 'En attente', date: '02 Mai 2025' },
]

export default function PaiementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#05966920' }}><Activity size={20} className="text-emerald-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Paiements</h1><p className="text-sm text-slate-500">142 paiements ce mois — 2.8M DT</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Effectués', value: '142', icon: CheckCircle2, color: '#059669' },
          { label: 'En Cours', value: '18', icon: Clock, color: '#2563EB' },
          { label: 'En Attente', value: '5', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Montant Total', value: '2.8M DT', icon: Activity, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">ID</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Bénéficiaire</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Montant</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Service</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Date</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{payments.map((p, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 text-xs font-mono text-slate-500">{p.id}</td><td className="py-3 px-4 font-medium">{p.beneficiary}</td><td className="py-3 px-4 text-right font-medium">{p.amount.toLocaleString()} DT</td><td className="py-3 px-4 text-slate-600">{p.service}</td><td className="py-3 px-4 text-slate-500">{p.date}</td><td className="py-3 px-4 text-center"><Badge variant={p.status === 'Effectué' ? 'success' : p.status === 'En attente' ? 'destructive' : 'warning'}>{p.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
