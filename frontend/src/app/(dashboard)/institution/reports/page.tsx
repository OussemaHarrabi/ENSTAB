"use client"

import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { Download } from "lucide-react"

export default function InstReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Rapports Institutionnels</h1>
      <Card><CardContent className="space-y-3 p-6">
        {['Rapport institutionnel mensuel', 'Analyse de performance', 'Rapport budget vs réel'].map((r, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <span className="text-sm text-slate-700">{r}</span>
            <Button variant="outline" size="sm"><Download size={12} className="mr-1" />Télécharger</Button>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
