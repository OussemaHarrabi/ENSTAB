"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { ScrollText, Download, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

const contracts = [
  { ref: 'CT-2025-01', title: 'Maintenance bâtiments', partenaire: 'Société ABC', montant: 450000, echeance: '31 Déc 2025', status: 'Actif', renew: false },
  { ref: 'CT-2025-02', title: 'Abonnement électricité', partenaire: 'STEG', montant: 1200000, echeance: '30 Juin 2025', status: 'Actif', renew: true },
  { ref: 'CT-2025-03', title: 'Licences logicielles', partenaire: 'TechSoft', montant: 250000, echeance: '15 Mai 2025', status: 'Renouvellement', renew: true },
  { ref: 'CT-2025-04', title: 'Service nettoyage', partenaire: 'CleanPro', montant: 380000, echeance: '31 Mar 2026', status: 'Actif', renew: false },
  { ref: 'CT-2025-05', title: 'Fourniture bureau', partenaire: 'PaperPlus', montant: 120000, echeance: '01 Juin 2025', status: 'Expiré', renew: false },
]

export default function ContratsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#991B1B20' }}><ScrollText size={20} className="text-red-800" /></div><div><h1 className="text-2xl font-bold text-slate-900">Contrats</h1><p className="text-sm text-slate-500">52 contrats actifs — 3 renouvellements ce mois</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Contrats Actifs', value: '52', icon: ScrollText, color: '#991B1B' },
          { label: 'Renouvellement', value: '3', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Expirés', value: '2', icon: Clock, color: '#EF4444' },
          { label: 'Montant Global', value: '18.5M DT', icon: CheckCircle2, color: '#059669' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Contrat</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Partenaire</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Montant</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Échéance</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{contracts.map((c, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{c.title}</td><td className="py-3 px-4 text-slate-600">{c.partenaire}</td><td className="py-3 px-4 text-right font-medium">{c.montant.toLocaleString()} DT</td><td className="py-3 px-4 text-slate-500">{c.echeance}{c.renew && <span className="ml-1 text-amber-500">*</span>}</td><td className="py-3 px-4 text-center"><Badge variant={c.status === 'Actif' ? 'success' : c.status === 'Renouvellement' ? 'warning' : 'destructive'}>{c.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
