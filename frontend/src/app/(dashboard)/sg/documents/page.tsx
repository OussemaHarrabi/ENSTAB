"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { FileText, Download, Eye, FileArchive, FileSpreadsheet } from "lucide-react"

const docs = [
  { name: 'PV Conseil 25-03-2025', type: 'PDF', size: '2.4 MB', date: '25 Mar 2025', category: 'PV' },
  { name: 'Rapport Annuel 2024', type: 'PDF', size: '8.1 MB', date: '15 Fév 2025', category: 'Rapports' },
  { name: 'Organigramme UCAR', type: 'PDF', size: '1.2 MB', date: '10 Jan 2025', category: 'Organisation' },
  { name: 'Budget 2025 signé', type: 'PDF', size: '4.5 MB', date: '20 Déc 2024', category: 'Budget' },
  { name: 'Procès-verbal CA', type: 'PDF', size: '3.2 MB', date: '15 Déc 2024', category: 'PV' },
  { name: 'Plan stratégique', type: 'PDF', size: '12 MB', date: '01 Nov 2024', category: 'Stratégie' },
  { name: 'Règlement intérieur (version 2024)', type: 'PDF', size: '0.8 MB', date: '01 Sep 2024', category: 'Règlementaire' },
]

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A556820' }}><FileArchive size={20} className="text-slate-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Documents</h1><p className="text-sm text-slate-500">Archive documentaire du Secrétariat Général</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Documents', value: '245', icon: FileText, color: '#4A5568' },
          { label: 'PV & Comptes Rendus', value: '85', icon: FileText, color: '#2563EB' },
          { label: 'Rapports', value: '42', icon: FileSpreadsheet, color: '#059669' },
          { label: 'Archives 2025', value: '38', icon: FileArchive, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Document</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Catégorie</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Format</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Taille</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Date</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Actions</th></tr></thead>
        <tbody>{docs.map((d, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{d.name}</td><td className="py-3 px-4"><Badge variant="outline" className="text-[10px]">{d.category}</Badge></td><td className="py-3 px-4 text-center text-slate-500">{d.type}</td><td className="py-3 px-4 text-right text-slate-500">{d.size}</td><td className="py-3 px-4 text-right text-slate-500">{d.date}</td><td className="py-3 px-4 text-center"><div className="flex items-center justify-center gap-1"><button className="p-1.5 hover:bg-slate-100 rounded"><Eye size={14} className="text-slate-400" /></button><button className="p-1.5 hover:bg-slate-100 rounded"><Download size={14} className="text-slate-400" /></button></div></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
