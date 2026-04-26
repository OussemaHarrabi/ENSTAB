"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BookOpen, Download, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

const programs = [
  { name: 'Licence Informatique', level: 'Licence', institution: 'ENSI', students: 450, status: 'Accrédité', accreditation: '2027' },
  { name: 'Master Data Science', level: 'Master', institution: 'FST', students: 120, status: 'Accrédité', accreditation: '2026' },
  { name: 'Licence Économie', level: 'Licence', institution: 'FSEGT', students: 580, status: 'Accrédité', accreditation: '2028' },
  { name: 'Master MBA', level: 'Master', institution: 'ISG', students: 85, status: 'En cours', accreditation: '2025' },
  { name: 'Doctorat Physique', level: 'Doctorat', institution: 'FST', students: 65, status: 'Accrédité', accreditation: '2029' },
  { name: 'Licence Droit', level: 'Licence', institution: 'FSEGT', students: 420, status: 'Renouvellement', accreditation: '2025' },
  { name: 'Master Réseaux', level: 'Master', institution: 'SUPCOM', students: 95, status: 'Accrédité', accreditation: '2027' },
  { name: 'Licence Design', level: 'Licence', institution: 'ISAMM', students: 180, status: 'Nouveau', accreditation: '2026' },
]

export default function ProgrammesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E520' }}><BookOpen size={20} className="text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Programmes</h1><p className="text-sm text-slate-500">85 programmes — 12 accrédités</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Programmes', value: '85', icon: BookOpen, color: '#4F46E5' },
          { label: 'Accrédités', value: '12', icon: CheckCircle2, color: '#059669' },
          { label: 'Renouvellement', value: '3', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Nouveaux 2025', value: '5', icon: Clock, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Programme</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Niveau</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Institution</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Étudiants</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Validité</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{programs.map((p, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{p.name}</td><td className="py-3 px-4"><Badge variant="outline" className="text-[10px]">{p.level}</Badge></td><td className="py-3 px-4 text-slate-600">{p.institution}</td><td className="py-3 px-4 text-right">{p.students}</td><td className="py-3 px-4 text-slate-500">{p.accreditation}</td><td className="py-3 px-4 text-center"><Badge variant={p.status === 'Accrédité' ? 'success' : p.status === 'Renouvellement' ? 'warning' : 'default'}>{p.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
