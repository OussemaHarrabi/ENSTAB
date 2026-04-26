"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Monitor, Download, CheckCircle2, AlertTriangle, Wrench } from "lucide-react"

const equipments = [
  { name: 'Ordinateurs', count: 850, status: 'OK', maintenance: '2025', depreciation: 65 },
  { name: 'Imprimantes', count: 120, status: 'Warning', maintenance: '2024', depreciation: 78 },
  { name: 'Serveurs', count: 45, status: 'OK', maintenance: '2025', depreciation: 45 },
  { name: 'Vidéoprojecteurs', count: 95, status: 'OK', maintenance: '2025', depreciation: 55 },
  { name: 'Mobilier (bureaux)', count: 1850, status: 'Warning', maintenance: '2024', depreciation: 72 },
  { name: 'Climatisation', count: 85, status: 'OK', maintenance: '2025', depreciation: 60 },
  { name: 'Équipements Labo', count: 320, status: 'Critical', maintenance: '2023', depreciation: 88 },
  { name: 'Véhicules', count: 12, status: 'OK', maintenance: '2025', depreciation: 50 },
]

export default function EquipementsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D9770620' }}><Monitor size={20} className="text-orange-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Équipements</h1><p className="text-sm text-slate-500">3 377 équipements — 8 catégories</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '3 377', icon: Monitor, color: '#D97706' },
          { label: 'Opérationnels', value: '2 850', icon: CheckCircle2, color: '#059669' },
          { label: 'Alerte', value: '420', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Hors Service', value: '107', icon: Wrench, color: '#EF4444' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Catégorie</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Quantité</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Dépréciation</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Dernière Maintenance</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{equipments.map((e, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{e.name}</td><td className="py-3 px-4 text-right font-medium">{e.count.toLocaleString()}</td><td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-2"><div className="h-2 w-16 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${e.depreciation}%`, backgroundColor: e.depreciation >= 80 ? '#EF4444' : e.depreciation >= 60 ? '#F59E0B' : '#059669' }}></div></div><span className="text-xs">{e.depreciation}%</span></div></td><td className="py-3 px-4 text-slate-500">{e.maintenance}</td><td className="py-3 px-4 text-center"><Badge variant={e.status === 'OK' ? 'success' : e.status === 'Warning' ? 'warning' : 'destructive'}>{e.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
