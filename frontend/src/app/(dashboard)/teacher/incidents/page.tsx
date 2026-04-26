"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { Plus } from "lucide-react"

export default function TeacherIncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Signalement d'Incidents</h1><Button size="sm"><Plus size={14} className="mr-1" />Nouveau</Button></div>
      <Card><CardContent className="space-y-3 p-6">
        {[
          { issue: 'Projecteur défectueux - Salle 204', eq: 'Projecteur Epson', status: 'En cours', date: '25/04' },
          { issue: 'Problème connexion WiFi - Labo 3', eq: 'Routeur', status: 'Résolu', date: '23/04' },
          { issue: 'Tableau blanc abîmé - Salle 101', eq: 'Tableau', status: 'Ouvert', date: '22/04' },
        ].map((inc, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <div><p className="text-sm font-medium text-slate-700">{inc.issue}</p><p className="text-xs text-slate-400">{inc.eq} · {inc.date}</p></div>
            <Badge variant={inc.status === 'Résolu' ? 'success' : inc.status === 'En cours' ? 'warning' : 'info'}>{inc.status}</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
