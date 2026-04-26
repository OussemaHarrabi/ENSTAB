"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Search, Users, Download, RefreshCw, Filter, Building2, Phone, Mail, UserCheck } from "lucide-react"
import { useState } from "react"

const staff = [
  { id: 1, name: 'Oussema Khimissi', role: 'Administrateur', service: 'RH', institution: 'ENSI', status: 'Actif', email: 'o.khimissi@ensi.tn', phone: '+216 98 765 432' },
  { id: 2, name: 'Chiraz Hajji', role: 'Administrateur', service: 'RH', institution: 'ENIT', status: 'Actif', email: 'c.hajji@enit.tn', phone: '+216 97 654 321' },
  { id: 3, name: 'Ahlem Hkimi', role: 'Administrateur', service: 'RH', institution: 'FST', status: 'Actif', email: 'a.hkimi@fst.tn', phone: '+216 96 543 210' },
  { id: 4, name: 'Essia Saidi', role: 'Administrateur', service: 'RH', institution: 'FSEGT', status: 'Actif', email: 'e.saidi@fsegt.tn', phone: '+216 95 432 109' },
  { id: 5, name: 'Mohamed Khedimallah', role: 'Directeur', service: 'RH', institution: 'UCAR', status: 'Actif', email: 'm.khedimallah@ucar.tn', phone: '+216 71 749 100' },
  { id: 6, name: 'Belgacem Chatti', role: 'Chef de Service', service: 'RH', institution: 'UCAR', status: 'Actif', email: 'b.chatti@ucar.tn', phone: '+216 71 749 101' },
]

export default function PersonnelPage() {
  const [search, setSearch] = useState('')
  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.institution.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820' }}><Users size={20} className="text-teal-600" /></div>
            <div><h1 className="text-2xl font-bold text-slate-900">Personnel RH</h1><p className="text-sm text-slate-500">520 agents — Service Ressources Humaines</p></div>
          </div>
        </div>
        <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Effectif Total', value: '520', icon: Users, color: '#0D9488' },
          { label: 'Turnover', value: '4.2%', icon: UserCheck, color: '#F59E0B' },
          { label: 'Ancienneté Moy.', value: '8.5 ans', icon: Building2, color: '#6366F1' },
          { label: 'Taux d\'Absentéisme', value: '3.1%', icon: Filter, color: '#EF4444' },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>
        ))}
      </div>
      <div className="relative max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm" /></div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Nom</th><th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Rôle</th><th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Institution</th><th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Contact</th><th className="text-center py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Statut</th></tr></thead>
          <tbody>{filtered.map(s => (
            <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-4"><div className="flex items-center gap-2"><span className="font-medium text-slate-900">{s.name}</span></div></td>
              <td className="py-3 px-4"><Badge variant="outline" className="text-xs">{s.role}</Badge></td>
              <td className="py-3 px-4 text-slate-600">{s.institution}</td>
              <td className="py-3 px-4"><p className="text-xs text-slate-500">{s.email}</p></td>
              <td className="py-3 px-4 text-center"><Badge variant="success" className="text-[10px]">{s.status}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  )
}
