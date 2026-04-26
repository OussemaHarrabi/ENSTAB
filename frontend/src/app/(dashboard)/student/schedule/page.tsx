"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Emploi du Temps</h1>
      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => (
        <Card key={day}>
          <CardHeader><CardTitle>{day}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { time: '08:00-10:00', course: 'Algorithmique Avancée', room: 'Salle 204' },
              { time: '10:15-12:15', course: 'Structure de Données', room: 'Labo 3' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-2 rounded bg-slate-50">
                <span className="text-xs font-medium text-slate-500 w-24">{s.time}</span>
                <span className="text-sm text-slate-700 flex-1">{s.course}</span>
                <Badge variant="outline">{s.room}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
