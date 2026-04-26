"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Megaphone, Download, Users, CalendarDays, MessageSquare, Heart, Music } from "lucide-react"

const activities = [
  { name: 'Club Robotique', members: 45, events: 12, status: 'Actif', category: 'Scientifique' },
  { name: 'Tunisian Red Crescent', members: 120, events: 8, status: 'Actif', category: 'Social' },
  { name: 'Club Théâtre', members: 35, events: 6, status: 'Actif', category: 'Culturel' },
  { name: 'Club Sport', members: 200, events: 15, status: 'Actif', category: 'Sportif' },
  { name: 'Junior Entreprise', members: 30, events: 5, status: 'Actif', category: 'Entrepreneuriat' },
  { name: 'Green Club', members: 65, events: 10, status: 'Actif', category: 'Environnement' },
]

export default function VieEtudiantePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4F46E520' }}><Megaphone size={20} className="text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Vie Étudiante</h1><p className="text-sm text-slate-500">18 clubs actifs — 495 membres — 56 événements/an</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Clubs Actifs', value: '18', icon: Users, color: '#4F46E5' },
          { label: 'Membres', value: '495', icon: Heart, color: '#EF4444' },
          { label: 'Événements/An', value: '56', icon: CalendarDays, color: '#059669' },
          { label: 'Catégories', value: '6', icon: Music, color: '#2563EB' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{activities.map((a, i) => (<Card key={i}><CardContent className="p-5"><div className="flex items-start justify-between"><h3 className="font-semibold text-slate-900 text-sm">{a.name}</h3><Badge variant="outline" className="text-[10px]">{a.category}</Badge></div><p className="text-xs text-slate-400 mt-1">{a.members} membres — {a.events} événements</p><Badge variant="success" className="mt-2">{a.status}</Badge></CardContent></Card>))}</div>
    </div>
  )
}
