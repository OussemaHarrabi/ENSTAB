"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/ui"

export default function StudentGradesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes Notes</h1>
      <Card><CardContent className="p-6 space-y-3">
        {[
          { course: 'Algorithmique Avancée', ds: 14, tp: 16, exam: 12, final: 13.5, credits: 6 },
          { course: 'Structure de Données', ds: 15, tp: 14, exam: 16, final: 15.3, credits: 4 },
          { course: 'Intelligence Artificielle', ds: 17, tp: 18, exam: 15, final: 16.2, credits: 6 },
          { course: 'Anglais Technique', ds: 13, tp: 15, exam: 14, final: 14.0, credits: 3 },
        ].map((c, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div><p className="text-sm font-medium text-slate-700">{c.course}</p><p className="text-xs text-slate-400">{c.credits} crédits</p></div>
            <div className="flex items-center gap-3"><span className={`text-sm font-semibold ${c.final >= 14 ? 'text-emerald-600' : c.final >= 10 ? 'text-amber-600' : 'text-red-600'}`}>{c.final}/20</span></div>
          </div>
        ))}
      </CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-sm text-slate-600">Moyenne Semestrielle</span><span className="text-lg font-bold text-blue-700">14.2/20</span></div><div className="flex items-center justify-between mt-2"><span className="text-sm text-slate-600">Crédits validés</span><span className="font-medium">19/19</span></div></CardContent></Card>
    </div>
  )
}
