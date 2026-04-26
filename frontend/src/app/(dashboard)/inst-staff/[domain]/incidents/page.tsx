"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { Plus } from "lucide-react"

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Signalements Incidents</h1><Button size="sm"><Plus size={14} className="mr-1" />Nouveau</Button></div>
      <Card><CardContent className="space-y-3 p-6">
        {[
          { incident: 'Projecteur défectueux Salle 204', by: 'Enseignant', date: '25/04/2025', status: 'En cours' },
          { incident: 'Climatisation en panne', by: 'Étudiant', date: '24/04/2025', status: 'Résolu' },
          { incident: 'Problème réseau informatique', by: 'Personnel', date: '23/04/2025', status: 'Ouvert' },
        ].map((inc, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <div><p className="text-sm font-medium text-slate-700">{inc.incident}</p><p className="text-xs text-slate-400">{inc.by} · {inc.date}</p></div>
            <Badge variant={inc.status === 'Résolu' ? 'success' : inc.status === 'En cours' ? 'warning' : 'info'}>{inc.status}</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
