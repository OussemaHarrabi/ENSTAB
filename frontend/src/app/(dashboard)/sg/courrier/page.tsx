"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { ScrollText, Download, CheckCircle2, Clock, AlertTriangle, Inbox } from "lucide-react"

const courriers = [
  { ref: 'C-2025-001', objet: 'Demande d\'accréditation programme', expediteur: 'ENSI', date: '24 Avr 2025', urgences: 'Haute', statut: 'Traité' },
  { ref: 'C-2025-002', objet: 'Rapport d\'activité annuel', expediteur: 'Service RH', date: '23 Avr 2025', urgences: 'Normale', statut: 'En cours' },
  { ref: 'C-2025-003', objet: 'Convention de partenariat', expediteur: 'Université Paris', date: '22 Avr 2025', urgences: 'Haute', statut: 'En cours' },
  { ref: 'C-2025-004', objet: 'Demande budget supplémentaire', expediteur: 'Service Recherche', date: '21 Avr 2025', urgences: 'Urgente', statut: 'En attente' },
  { ref: 'C-2025-005', objet: 'PV Conseil d\'Université', expediteur: 'Présidence', date: '20 Avr 2025', urgences: 'Normale', statut: 'Traité' },
  { ref: 'C-2025-006', objet: 'Notification ministérielle', expediteur: 'MESRS', date: '19 Avr 2025', urgences: 'Haute', statut: 'Traité' },
]

export default function CourrierPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A556820' }}><ScrollText size={20} className="text-slate-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Courrier</h1><p className="text-sm text-slate-500">Gestion du courrier entrant et sortant</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Reçus (mois)', value: '145', icon: Inbox, color: '#4A5568' },
          { label: 'En Cours', value: '12', icon: Clock, color: '#2563EB' },
          { label: 'Traités', value: '128', icon: CheckCircle2, color: '#059669' },
          { label: 'Urgents', value: '5', icon: AlertTriangle, color: '#EF4444' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Réf.</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Objet</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Expéditeur</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Date</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Urgence</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{courriers.map((c, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 text-xs font-mono text-slate-500">{c.ref}</td><td className="py-3 px-4 font-medium text-slate-900">{c.objet}</td><td className="py-3 px-4 text-slate-600">{c.expediteur}</td><td className="py-3 px-4 text-slate-500">{c.date}</td><td className="py-3 px-4 text-center"><Badge variant={c.urgences === 'Urgente' ? 'destructive' : c.urgences === 'Haute' ? 'warning' : 'default'} className="text-[10px]">{c.urgences}</Badge></td><td className="py-3 px-4 text-center"><Badge variant={c.statut === 'Traité' ? 'success' : c.statut === 'En cours' ? 'warning' : 'default'}>{c.statut}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
