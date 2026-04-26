"use client"

import { Card, CardContent, Badge, Button } from "@/components/ui"
import { FileText, Download, Eye } from "lucide-react"

const reports = [
  { name: 'Exécution Budgétaire Mensuelle', desc: 'Détaillé par service et ligne', type: 'XLSX', date: '24 Avr 2025' },
  { name: 'Prévisions Budgétaires', desc: 'Projections 2025-2027', type: 'PDF', date: '20 Avr 2025' },
  { name: 'Allocations par Institution', desc: 'Répartition budgétaire', type: 'XLSX', date: '18 Avr 2025' },
  { name: 'Analyse des Écarts', desc: 'Budget vs réel', type: 'PDF', date: '15 Avr 2025' },
]

export default function RapportsBudPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B220' }}><FileText size={20} className="text-cyan-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Rapports Budget</h1></div></div></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{reports.map((r, i) => (<Card key={i} className="hover:shadow-md transition-all"><CardContent className="p-5"><div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B215' }}><FileText size={20} className="text-cyan-600" /></div><Badge variant="outline" className="text-[10px]">{r.type}</Badge></div><h3 className="font-semibold text-slate-900 text-sm">{r.name}</h3><p className="text-xs text-slate-400 mt-1">{r.desc}</p><div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100"><span className="text-[10px] text-slate-400">{r.date}</span><div className="flex items-center gap-1"><button className="p-1.5 hover:bg-slate-100 rounded"><Eye size={14} className="text-slate-400" /></button><button className="p-1.5 hover:bg-slate-100 rounded"><Download size={14} className="text-slate-400" /></button></div></div></CardContent></Card>))}</div>
    </div>
  )
}
