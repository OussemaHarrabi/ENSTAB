"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Building2, Download, CheckCircle2, AlertTriangle, Wrench, Users } from "lucide-react"

const buildings = [
  { name: 'Bâtiment A - Administration', surface: 3200, floors: 4, etat: 'Bon', occupancy: 85, year: 2005 },
  { name: 'Bâtiment B - Enseignement', surface: 4500, floors: 5, etat: 'Moyen', occupancy: 92, year: 1998 },
  { name: 'Bâtiment C - Laboratoires', surface: 2800, floors: 3, etat: 'Bon', occupancy: 78, year: 2010 },
  { name: 'Bibliothèque Centrale', surface: 3500, floors: 4, etat: 'Excellent', occupancy: 65, year: 2015 },
  { name: 'Amphithéâtres', surface: 1800, floors: 2, etat: 'Bon', occupancy: 75, year: 2008 },
  { name: 'Résidence Universitaire', surface: 5000, floors: 6, etat: 'Moyen', occupancy: 95, year: 1995 },
]

export default function BatimentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D9770620' }}><Building2 size={20} className="text-orange-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Bâtiments</h1><p className="text-sm text-slate-500">12 bâtiments — 20 800 m² — 80% taux d'occupation</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Bâtiments', value: '12', icon: Building2, color: '#D97706' },
          { label: 'En Bon État', value: '8', icon: CheckCircle2, color: '#059669' },
          { label: 'À Rénover', value: '4', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Surface Totale', value: '20 800 m²', icon: Wrench, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Bâtiment</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Surface</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Étages</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">État</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Occupation</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Année</th></tr></thead>
        <tbody>{buildings.map((b, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{b.name}</td><td className="py-3 px-4 text-right">{b.surface.toLocaleString()} m²</td><td className="py-3 px-4 text-center">{b.floors}</td><td className="py-3 px-4"><Badge variant={b.etat === 'Excellent' || b.etat === 'Bon' ? 'success' : b.etat === 'Moyen' ? 'warning' : 'destructive'}>{b.etat}</Badge></td><td className="py-3 px-4 text-right font-medium">{b.occupancy}%</td><td className="py-3 px-4 text-right text-slate-500">{b.year}</td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
