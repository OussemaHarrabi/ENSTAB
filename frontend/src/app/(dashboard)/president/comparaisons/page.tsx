"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { allInstitutions } from "@/lib/mock-data"
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

const kpiOptions = [
  { slug: 'success_rate', label: 'Taux de Réussite', unit: '%' },
  { slug: 'budget_execution', label: 'Exécution Budget', unit: '%' },
  { slug: 'employability_rate', label: "Taux d'Emploi", unit: '%' },
  { slug: 'green_score', label: 'Score GreenMetric', unit: '%' },
  { slug: 'publications_count', label: 'Publications', unit: '' },
  { slug: 'staff_stability', label: 'Stabilité Personnel', unit: '%' },
]

function getInstitutionKpi(instId: string, kpiSlug: string): number {
  const base: Record<string, Record<string, number>> = {
    'inst-02': { success_rate: 82, budget_execution: 91, employability_rate: 78, green_score: 78, publications_count: 68, staff_stability: 88 },
    'inst-06': { success_rate: 78, budget_execution: 88, employability_rate: 81, green_score: 72, publications_count: 72, staff_stability: 85 },
    'inst-03': { success_rate: 85, budget_execution: 94, employability_rate: 74, green_score: 68, publications_count: 85, staff_stability: 82 },
    'inst-09': { success_rate: 80, budget_execution: 86, employability_rate: 83, green_score: 65, publications_count: 55, staff_stability: 80 },
    'inst-04': { success_rate: 76, budget_execution: 82, employability_rate: 72, green_score: 62, publications_count: 38, staff_stability: 78 },
    'inst-07': { success_rate: 88, budget_execution: 93, employability_rate: 86, green_score: 81, publications_count: 42, staff_stability: 90 },
    'inst-05': { success_rate: 79, budget_execution: 85, employability_rate: 80, green_score: 74, publications_count: 48, staff_stability: 84 },
    'inst-14': { success_rate: 72, budget_execution: 78, employability_rate: 65, green_score: 58, publications_count: 22, staff_stability: 76 },
  }
  return base[instId]?.[kpiSlug] ?? Math.round(50 + Math.random() * 40)
}

const ucarInstitutions = allInstitutions.filter(inst =>
  ['inst-02','inst-03','inst-05','inst-06','inst-07','inst-14','inst-23','inst-25','inst-27'].includes(inst.id)
)

export default function ComparaisonsPage() {
  const [selectedKpi, setSelectedKpi] = useState(kpiOptions[0].slug)
  const [selectedInsts, setSelectedInsts] = useState<string[]>(['inst-02', 'inst-06', 'inst-07'])

  const kpiDef = kpiOptions.find(k => k.slug === selectedKpi)!

  const toggleInst = (id: string) => {
    setSelectedInsts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(0, 5)
    )
  }

  const comparisonData = selectedInsts.map(id => {
    const inst = allInstitutions.find(i => i.id === id)
    if (!inst) return null
    const value = getInstitutionKpi(id, selectedKpi)
    return { id: inst.id, name: inst.name, code: inst.code, value, avg: 68, diff: value - 68 }
  }).filter(Boolean) as { id: string; name: string; code: string; value: number; avg: number; diff: number }[]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}>
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Comparaisons Multi-Établissements</h1>
              <p className="text-sm text-slate-500">Sélectionnez jusqu'à 5 établissements UCAR et comparez leurs KPIs</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* KPI Selector */}
      <div className="flex flex-wrap gap-2">
        {kpiOptions.map(k => (
          <button key={k.slug} onClick={() => setSelectedKpi(k.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedKpi === k.slug ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {k.label}
          </button>
        ))}
      </div>

      {/* Institution Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Choisir les établissements UCAR (max 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ucarInstitutions.slice(0, 12).map(inst => (
              <button key={inst.id} onClick={() => toggleInst(inst.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedInsts.includes(inst.id) ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                {inst.code}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Comparaison : {kpiDef.label} ({kpiDef.unit})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-3 font-semibold text-slate-700">Établissement</th>
                    <th className="text-right py-3 px-3 font-semibold text-slate-700">Valeur</th>
                    <th className="text-right py-3 px-3 font-semibold text-slate-700">Moy. UCAR</th>
                    <th className="text-right py-3 px-3 font-semibold text-slate-700">Écart</th>
                    <th className="text-right py-3 px-3 font-semibold text-slate-700 w-32">Barre</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.sort((a, b) => b.value - a.value).map(row => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-3 font-medium text-slate-900">{row.name}</td>
                      <td className="py-3 px-3 text-right font-bold text-lg text-slate-900">{row.value}{kpiDef.unit}</td>
                      <td className="py-3 px-3 text-right text-slate-500">{row.avg}{kpiDef.unit}</td>
                      <td className={`py-3 px-3 text-right font-medium ${row.diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        <span className="flex items-center justify-end gap-1">
                          {row.diff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {row.diff >= 0 ? '+' : ''}{row.diff}{kpiDef.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.value >= row.avg ? 'bg-emerald-500' : 'bg-red-400'}`}
                            style={{ width: `${Math.min(row.value * 1.2, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {comparisonData.length >= 2 && (
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-600">
              <strong>{comparisonData[0].code}</strong> est en tête pour <strong>{kpiDef.label}</strong>
              {' '}avec <strong>{comparisonData[0].value}{kpiDef.unit}</strong>,
              {' '}soit <strong className="text-emerald-600">+{comparisonData[0].value - comparisonData[comparisonData.length - 1].value}{kpiDef.unit}</strong> de plus que <strong>{comparisonData[comparisonData.length - 1].code}</strong>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
