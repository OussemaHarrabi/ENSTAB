"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { BookOpen, Award, DollarSign, Search } from "lucide-react"

export default function TeacherResearchPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes Publications & Recherche</h1>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Publications" value={18} icon={<BookOpen size={18} />} compact />
        <KpiCard title="H-index" value="7" icon={<Award size={18} />} compact />
        <KpiCard title="Grants actifs" value={2} icon={<DollarSign size={18} />} compact />
        <KpiCard title="Citations" value={342} trend="up" trendValue={12} compact />
      </div>
      <Card><CardHeader><CardTitle>Soumettre une Publication</CardTitle></CardHeader><CardContent>
        <div className="flex gap-3 items-end">
          <div className="flex-1"><label className="text-xs font-medium text-slate-500">DOI</label><Input placeholder="10.1000/xyz123" /></div>
          <Button size="sm">🔍 Rechercher</Button>
        </div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Publications Récentes</CardTitle></CardHeader><CardContent>
        {[
          { title: 'Deep Learning for Tunisian Dialect Processing', journal: 'IEEE Access', year: 2025, citations: 12 },
          { title: 'Energy Efficiency in Smart Campus IoT', journal: 'Sensors', year: 2024, citations: 28 },
          { title: 'AI-Driven Student Success Prediction', journal: 'Educational Technology', year: 2024, citations: 15 },
        ].map((p, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div><p className="text-sm font-medium text-slate-700">{p.title}</p><p className="text-xs text-slate-400">{p.journal} · {p.year}</p></div>
            <Badge variant="info">{p.citations} citations</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
