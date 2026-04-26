"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"

interface ExecutiveSummaryProps {
  summary?: string
  confidence?: string
  generatedAt?: string
}

export function ExecutiveSummary({ summary, confidence, generatedAt }: ExecutiveSummaryProps) {
  const confidentColorMap: Record<string, string> = {
    high: "bg-green-50 border-green-200 text-green-700",
    medium: "bg-blue-50 border-blue-200 text-blue-700",
    low: "bg-amber-50 border-amber-200 text-amber-700",
  }

  const confidentColor = confidentColorMap[confidence?.toLowerCase() as string] || confidentColorMap.medium
  const displayConfidence = confidence ? confidence.charAt(0).toUpperCase() + confidence.slice(1) : "Moyen"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-600" />
          Résumé Exécutif — Analyse IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-lg border p-4 ${confidentColor}`}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1">Confiance des données</p>
          <p className="font-medium">{displayConfidence}</p>
        </div>

        {summary && summary.trim() ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{summary}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Aucun résumé disponible.</p>
        )}

        {generatedAt && (
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
            Généré le {new Date(generatedAt).toLocaleString("fr-FR", { timeZone: "UTC" })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
