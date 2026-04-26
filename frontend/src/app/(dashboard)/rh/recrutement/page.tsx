"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { UserPlus, Download, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

const positions = [
  { title: 'Administrateur RH', dept: 'RH', candidates: 12, status: 'Ouvert', deadline: '15 Mai 2025' },
  { title: 'Assistant de Direction', dept: 'SG', candidates: 8, status: 'Ouvert', deadline: '20 Mai 2025' },
  { title: 'Comptable', dept: 'Finances', candidates: 15, status: 'Évaluation', deadline: '10 Mai 2025' },
  { title: 'Technicien IT', dept: 'Informatique', candidates: 22, status: 'Ouvert', deadline: '30 Mai 2025' },
  { title: 'Bibliothécaire', dept: 'Bibliothèque', candidates: 6, status: 'Clôturé', deadline: '01 Mai 2025' },
  { title: 'Chef de Projet', dept: 'Équipement', candidates: 9, status: 'Ouvert', deadline: '25 Mai 2025' },
  { title: 'Juriste', dept: 'Juridique', candidates: 5, status: 'Évaluation', deadline: '12 Mai 2025' },
  { title: 'Attaché de Recherche', dept: 'Recherche', candidates: 18, status: 'Ouvert', deadline: '05 Juin 2025' },
]

const pipelineData = [
  { stage: 'Candidatures', count: 95 },
  { stage: 'Pré-sélection', count: 62 },
  { stage: 'Entretiens', count: 38 },
  { stage: 'Tests', count: 25 },
  { stage: 'Offres', count: 12 },
  { stage: 'Acceptées', count: 8 },
]

export default function RecrutementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820' }}><UserPlus size={20} className="text-teal-600" /></div>
            <div><h1 className="text-2xl font-bold text-slate-900">Recrutement</h1><p className="text-sm text-slate-500">8 postes ouverts — 95 candidats en pipeline</p></div>
          </div>
        </div>
        <Button size="sm" className="flex items-center gap-1.5" style={{ backgroundColor: '#0D9488' }}><UserPlus size={14} /> Nouveau poste</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Postes Ouverts', value: '8', icon: UserPlus, color: '#0D9488' },
          { label: 'Candidats', value: '95', icon: Clock, color: '#2563EB' },
          { label: 'En Évaluation', value: '12', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Acceptés', value: '8', icon: CheckCircle2, color: '#059669' },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Pipeline de Recrutement</CardTitle></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={pipelineData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="stage" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="count" fill="#0D9488" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Postes Ouverts</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">{positions.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div><p className="text-sm font-medium text-slate-900">{p.title}</p><p className="text-xs text-slate-400">{p.dept} — {p.candidates} candidats</p></div>
              <div className="flex items-center gap-2"><Badge variant={p.status === 'Ouvert' ? 'warning' : p.status === 'Évaluation' ? 'default' : 'success'}>{p.status}</Badge><span className="text-xs text-slate-400">{p.deadline}</span></div>
            </div>
          ))}</div></CardContent></Card>
      </div>
    </div>
  )
}
