"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { useStore } from "@/lib/store"
import { CheckCircle2 } from "lucide-react"

export default function TasksPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Tâches</h1>
      <Card><CardContent className="space-y-3 p-6">
        {[
          { task: 'Vérifier les factures du mois', from: 'Chef de département', priority: 'Haute', due: '2025-04-30' },
          { task: 'Mettre à jour l\'inventaire', from: 'Chef de département', priority: 'Moyenne', due: '2025-05-05' },
          { task: 'Saisir les notes de frais', from: 'Système', priority: 'Basse', due: '2025-05-10' },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <div><p className="text-sm font-medium text-slate-700">{t.task}</p><p className="text-xs text-slate-400">{t.from} · Échéance: {t.due}</p></div>
            <div className="flex items-center gap-2"><Badge variant={t.priority === 'Haute' ? 'danger' : t.priority === 'Moyenne' ? 'warning' : 'info'}>{t.priority}</Badge><Button size="sm" variant="ghost"><CheckCircle2 size={14} className="text-emerald-500" /></Button></div>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
