"use client"

import { Card, CardContent, Badge, Button } from "@/components/ui"
import { Search, GraduationCap, Download, Users, Award, BookOpen } from "lucide-react"
import { useState } from "react"

const teachers = [
  { name: 'Pr. Mohamed Salah', rank: 'Professeur', institution: 'ENSI', status: 'Actif', publications: 45, hIndex: 12 },
  { name: 'Dr. Amira Ben Salah', rank: 'MCF', institution: 'FST', status: 'Actif', publications: 28, hIndex: 8 },
  { name: 'Dr. Karim Jarraya', rank: 'MA', institution: 'ENIT', status: 'Actif', publications: 15, hIndex: 5 },
  { name: 'Pr. Sana Mejri', rank: 'Professeur', institution: 'FSEGT', status: 'Actif', publications: 52, hIndex: 15 },
  { name: 'Dr. Ahmed Ben Ali', rank: 'MCF', institution: 'ISAMM', status: 'Congé', publications: 22, hIndex: 7 },
  { name: 'Dr. Leila Trabelsi', rank: 'MA', institution: 'INSAT', status: 'Actif', publications: 18, hIndex: 4 },
]

export default function EnseignantsPage() {
  const [search, setSearch] = useState('')
  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.institution.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7C3AED20' }}><GraduationCap size={20} className="text-violet-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Enseignants</h1><p className="text-sm text-slate-500">845 enseignants — 12 établissements</p></div></div></div>
        <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Professeurs', value: '185', icon: Award, color: '#7C3AED' },
          { label: 'MCF', value: '320', icon: Users, color: '#2563EB' },
          { label: 'MA', value: '340', icon: Users, color: '#059669' },
          { label: 'HDR', value: '145', icon: BookOpen, color: '#D97706' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="relative max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm" /></div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Nom</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Grade</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Institution</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Publications</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">H-Index</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{filtered.map((t, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{t.name}</td><td className="py-3 px-4"><Badge variant="outline" className="text-xs">{t.rank}</Badge></td><td className="py-3 px-4 text-slate-600">{t.institution}</td><td className="py-3 px-4 text-right font-medium">{t.publications}</td><td className="py-3 px-4 text-right">{t.hIndex}</td><td className="py-3 px-4 text-center"><Badge variant={t.status === 'Actif' ? 'success' : 'warning'} className="text-[10px]">{t.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
