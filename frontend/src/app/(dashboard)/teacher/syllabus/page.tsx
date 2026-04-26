"use client"

import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui"

export default function SyllabusPage() {
  const topics = [
    { name: 'Chapitre 1: Introduction', progress: 100, status: 'Terminé' },
    { name: 'Chapitre 2: Structures linéaires', progress: 100, status: 'Terminé' },
    { name: 'Chapitre 3: Arbres et graphes', progress: 75, status: 'En cours' },
    { name: 'Chapitre 4: Algorithmes de tri', progress: 40, status: 'En cours' },
    { name: 'Chapitre 5: Programmation dynamique', progress: 10, status: 'À venir' },
    { name: 'TP: Projet pratique', progress: 30, status: 'En cours' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Avancement du Programme</h1>
      <Card><CardContent className="p-6 space-y-3">
        {topics.map((t, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-400 w-8 text-right">{t.progress}%</span>
            <Progress value={t.progress} className="flex-1" />
            <span className="text-sm text-slate-700 w-48">{t.name}</span>
            <Badge variant={t.status === 'Terminé' ? 'success' : t.status === 'En cours' ? 'warning' : 'outline'}>{t.status}</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
