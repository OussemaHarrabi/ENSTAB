"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Globe, Download, CheckCircle2, Clock, Handshake } from "lucide-react"

const agreements = [
  { country: 'France', partner: 'Université Paris-Saclay', type: 'Erasmus+', status: 'Actif', students: 12, since: '2018' },
  { country: 'Allemagne', partner: 'TU Berlin', type: 'Bilatéral', status: 'Actif', students: 8, since: '2019' },
  { country: 'Canada', partner: 'Université Laval', type: 'Cotutelle', status: 'Actif', students: 5, since: '2020' },
  { country: 'Italie', partner: 'Université de Bologne', type: 'Erasmus+', status: 'Actif', students: 10, since: '2017' },
  { country: 'Espagne', partner: 'Université Complutense', type: 'Erasmus+', status: 'Actif', students: 7, since: '2019' },
  { country: 'Japon', partner: 'Université de Tokyo', type: 'Bilatéral', status: 'Négociation', students: 0, since: '2025' },
]

export default function CooperationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><Globe size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Coopération Internationale</h1><p className="text-sm text-slate-500">28 accords — 18 pays — 120 mobilités/an</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Accords', value: '28', icon: Handshake, color: '#9333EA' },
          { label: 'Actifs', value: '25', icon: CheckCircle2, color: '#059669' },
          { label: 'Mobilités/an', value: '120', icon: Globe, color: '#2563EB' },
          { label: 'Partenaires', value: '18', icon: Clock, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Pays</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Partenaire</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Type</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Étudiants</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Depuis</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{agreements.map((a, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium">{a.country}</td><td className="py-3 px-4 text-slate-600">{a.partner}</td><td className="py-3 px-4"><Badge variant="outline" className="text-[10px]">{a.type}</Badge></td><td className="py-3 px-4 text-center">{a.students}</td><td className="py-3 px-4 text-center text-slate-500">{a.since}</td><td className="py-3 px-4 text-center"><Badge variant={a.status === 'Actif' ? 'success' : 'warning'}>{a.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
