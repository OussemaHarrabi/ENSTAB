"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/ui"

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes Présences</h1>
      <Card><CardContent className="p-6">
        <div className="flex items-center justify-center mb-6"><div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center"><span className="text-2xl font-bold text-emerald-600">85%</span></div></div>
        {[
          { course: 'Algorithmique Avancée', pct: 92, sessions: '22/24' },
          { course: 'Structure de Données', pct: 88, sessions: '19/22' },
          { course: 'Intelligence Artificielle', pct: 95, sessions: '17/18' },
          { course: 'Anglais Technique', pct: 70, sessions: '14/20' },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-600 w-44">{c.course}</span>
            <Progress value={c.pct} className="flex-1" />
            <span className="text-xs text-slate-400 w-16">{c.sessions}</span>
            <Badge variant={c.pct >= 85 ? 'success' : c.pct >= 70 ? 'warning' : 'danger'}>{c.pct}%</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
