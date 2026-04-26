"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { domainLabels } from "@/lib/mock-data"
import { FileText, Download } from "lucide-react"

export default function DomainReportsPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[params.domain as string] || params.domain} — Rapports</h1>
      <Card>
        <CardContent className="space-y-3 p-6">
          {['Analyse hebdomadaire', 'Tendances mensuelles', 'Benchmark institutionnel', 'Rapport de conformité'].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-slate-700">{r}</span>
              <Button variant="outline" size="sm"><Download size={12} className="mr-1" />Télécharger</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
