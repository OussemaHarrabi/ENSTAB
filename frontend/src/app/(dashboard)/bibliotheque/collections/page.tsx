"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, Download, TrendingUp, Monitor, Users, BookMarked } from "lucide-react"

const collectionData = [
  { type: 'Livres Papier', count: 45000, color: '#B45309' },
  { type: 'Livres Numériques', count: 12000, color: '#D97706' },
  { type: 'Revues Papier', count: 3500, color: '#F59E0B' },
  { type: 'Revues Numériques', count: 8500, color: '#92400E' },
  { type: 'Thèses & Mémoires', count: 6500, color: '#78350F' },
  { type: 'Bases de Données', count: 12, color: '#451A03' },
]

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B4530920' }}><BookOpen size={20} className="text-amber-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Collections</h1><p className="text-sm text-slate-500">75 512 ressources — 12 bases de données</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Ressources Papier', value: '48 500', icon: BookOpen, color: '#B45309' },
          { label: 'Ressources Numériques', value: '20 512', icon: Monitor, color: '#2563EB' },
          { label: 'Nouv. Acquisitions/mois', value: '450', icon: TrendingUp, color: '#059669' },
          { label: 'Utilisateurs Actifs', value: '8 500', icon: Users, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle className="text-sm font-semibold">Répartition des Collections</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={collectionData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="type" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#B45309" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    </div>
  )
}
