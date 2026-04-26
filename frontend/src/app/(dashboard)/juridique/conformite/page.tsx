"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BadgeCheck, Download, CheckCircle2, AlertTriangle, Clock, FileSearch } from "lucide-react"

const items = [
  { domain: 'Protection des données', status: 'Conforme', score: 95, deadline: '—', responsable: 'Service IT' },
  { domain: 'Marchés publics', status: 'Conforme', score: 88, deadline: '—', responsable: 'Service Finances' },
  { domain: 'Hygiène & Sécurité', status: 'Partiellement', score: 72, deadline: 'Juin 2025', responsable: 'Service Équipement' },
  { domain: 'Environnement', status: 'Partiellement', score: 68, deadline: 'Déc 2025', responsable: 'SG' },
  { domain: 'Accessibilité', status: 'Non conforme', score: 45, deadline: 'Juin 2026', responsable: 'Service IT' },
  { domain: 'RGPD', status: 'En cours', score: 60, deadline: 'Sep 2025', responsable: 'Service Juridique' },
  { domain: 'Loi Finances', status: 'Conforme', score: 92, deadline: '—', responsable: 'Service Budget' },
  { domain: 'Code du travail', status: 'Conforme', score: 90, deadline: '—', responsable: 'Service RH' },
]

export default function ConformiteJuriPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#991B1B20' }}><BadgeCheck size={20} className="text-red-800" /></div><div><h1 className="text-2xl font-bold text-slate-900">Conformité Réglementaire</h1><p className="text-sm text-slate-500">78% des exigences respectées — 42 points de contrôle</p></div></div></div>
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Domaine</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Score</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Échéance</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Responsable</th></tr></thead>
        <tbody>{items.map((item, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{item.domain}</td><td className="py-3 px-4 text-center"><Badge variant={item.status === 'Conforme' ? 'success' : item.status === 'Partiellement' ? 'warning' : 'destructive'}>{item.status}</Badge></td><td className="py-3 px-4 text-center"><div className="flex items-center justify-center gap-2"><div className="h-2 w-16 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.score >= 85 ? '#059669' : item.score >= 60 ? '#F59E0B' : '#EF4444' }}></div></div><span className="text-xs">{item.score}%</span></div></td><td className="py-3 px-4 text-slate-500">{item.deadline}</td><td className="py-3 px-4 text-slate-600">{item.responsable}</td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
