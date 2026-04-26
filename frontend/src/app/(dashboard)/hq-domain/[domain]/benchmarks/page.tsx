"use client"

import { useParams } from "next/navigation"
import { ComparisonChart } from "@/components/kpi/comparison-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { domainLabels } from "@/lib/mock-data"

export default function DomainBenchmarksPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[params.domain as string] || params.domain} — Benchmarks</h1>
      <ComparisonChart />
      <Card><CardContent className="p-8 text-center text-slate-400">Benchmarks détaillés par sous-indicateur — à venir</CardContent></Card>
    </div>
  )
}
