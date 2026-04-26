"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CalendarDays, Download, CheckCircle2, Clock, Wrench } from "lucide-react"

const projects = [
  { name: 'Rénovation Bâtiment A', budget: 1200000, progress: 65, status: 'En cours', deadline: 'Déc 2025' },
  { name: 'Construction Nouvel Amphi', budget: 2500000, progress: 25, status: 'En cours', deadline: 'Juin 2026' },
  { name: 'Mise aux Normes Sécurité', budget: 450000, progress: 80, status: 'En cours', deadline: 'Sep 2025' },
  { name: 'Rénovation Bibliothèque', budget: 800000, progress: 100, status: 'Terminé', deadline: 'Avr 2025' },
  { name: 'Installation Panneaux Solaires', budget: 600000, progress: 15, status: 'Planifié', deadline: 'Mar 2026' },
]

export default function ProjetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D9770620' }}><CalendarDays size={20} className="text-orange-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Projets</h1><p className="text-sm text-slate-500">5 projets actifs — Budget total: 5.55M DT</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En Cours', value: '3', icon: Wrench, color: '#D97706' },
          { label: 'Terminés', value: '1', icon: CheckCircle2, color: '#059669' },
          { label: 'Planifiés', value: '1', icon: Clock, color: '#2563EB' },
          { label: 'Budget Total', value: '5.55M', icon: CalendarDays, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Projet</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Budget</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase w-48"><div className="flex items-center gap-2"><span>Progression</span></div></th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Échéance</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{projects.map((p, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{p.name}</td><td className="py-3 px-4 text-right font-medium">{p.budget.toLocaleString()} DT</td><td className="py-3 px-4"><div className="flex items-center gap-2"><div className="flex-1 h-2.5 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.progress === 100 ? '#059669' : p.progress >= 50 ? '#D97706' : '#F59E0B' }}></div></div><span className="text-xs font-medium">{p.progress}%</span></div></td><td className="py-3 px-4 text-slate-500">{p.deadline}</td><td className="py-3 px-4 text-center"><Badge variant={p.status === 'Terminé' ? 'success' : p.status === 'En cours' ? 'warning' : 'default'}>{p.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
