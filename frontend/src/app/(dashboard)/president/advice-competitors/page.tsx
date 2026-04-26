"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Lightbulb, RefreshCw } from "lucide-react"

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { useStore } from "@/lib/store"

import {
  extractKpiComparatorRows,
  fetchAdviceReport,
  getTopCompetitors,
  getQuickWins,
  getStrategicPriorities,
} from "./_lib/advice-client"
import type { AdviceReport } from "./_lib/types"
import { CompetitorRankings } from "./_components/competitor-rankings"
import { StrategicAdvice } from "./_components/strategic-advice"
import { ExecutiveSummary } from "./_components/executive-summary"
import { GapAnalysis } from "./_components/gap-analysis"

export default function AdviceCompetitorsPage() {
  const { currentRole } = useStore()
  const [report, setReport] = useState<AdviceReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isPresident = currentRole === "president"

  async function loadReport() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAdviceReport()
      setReport(data)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erreur de chargement du serveur Advice"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isPresident) {
      setIsLoading(false)
      return
    }
    loadReport()
  }, [isPresident])

  const comparatorRows = useMemo(() => {
    if (!report) return []
    return extractKpiComparatorRows(report)
  }, [report])

  const topCompetitors = useMemo(() => {
    if (!report) return []
    return getTopCompetitors(report)
  }, [report])

  const quickWins = useMemo(() => {
    if (!report) return []
    return getQuickWins(report)
  }, [report])

  const priorities = useMemo(() => {
    if (!report) return []
    return getStrategicPriorities(report)
  }, [report])

  if (!isPresident) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            Accès restreint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Cet onglet est réservé au chef de l&apos;Université de Carthage (rôle Présidence).
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1E3A5F20" }}>
              <Lightbulb size={20} style={{ color: "#1E3A5F" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Conseils Concurrents</h1>
              <p className="text-sm text-slate-500">
                Analyse IA des écarts avec 10 concurrents proches, pilotée par Advice Server
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadReport} disabled={isLoading}>
          <RefreshCw size={14} className="mr-1" />
          Actualiser
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700 font-semibold uppercase">Concurrents analysés</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{report?.meta?.competitors_analyzed ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-xs text-red-700 font-semibold uppercase">Écarts critiques</p>
            <p className="text-2xl font-bold text-red-900 mt-1">{report?.analysis?.critical_gaps?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <p className="text-xs text-emerald-700 font-semibold uppercase">Confiance données</p>
            <Badge
              variant={
                report?.analysis?.data_confidence === "high"
                  ? "success"
                  : report?.analysis?.data_confidence === "medium"
                    ? "info"
                    : "warning"
              }
              className="mt-1"
            >
              {report?.analysis?.data_confidence ?? "—"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Loading & Error States */}
  {isLoading && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-slate-400" />
                <p className="text-sm text-slate-500">Chargement des données...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && !isLoading && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-sm text-amber-700">
            <p className="font-medium mb-1">⚠️ Serveur indisponible</p>
            <p>Affichage des données de démonstration. Reconnectez-vous pour les données en direct.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && report && (
        <>
          {/* Executive Summary */}
          <ExecutiveSummary
            summary={report.executive_summary}
            confidence={report.analysis?.data_confidence}
            generatedAt={report.meta?.generated_at}
          />

          {/* Competitor Rankings */}
          {topCompetitors.length > 0 && <CompetitorRankings competitors={topCompetitors} />}

          {/* Strategic Advice */}
          {(quickWins.length > 0 || priorities.length > 0) && (
            <StrategicAdvice priorities={priorities} quickWins={quickWins} />
          )}

          {/* Gap Analysis */}
          {report.analysis?.critical_gaps && report.analysis.critical_gaps.length > 0 && (
            <GapAnalysis gaps={report.analysis.critical_gaps} />
          )}

          {/* Competitor Summary Table */}
          {report.analysis?.competitor_summary && report.analysis.competitor_summary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Vue d&apos;ensemble des concurrents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Concurrent</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Rang</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">KPI où ils dépassent UCAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.analysis.competitor_summary.map((c) => (
                        <tr key={c.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{c.name}</td>
                          <td className="py-3 px-4 text-slate-600">{c.world_rank ?? "—"}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {(c.beats_ucar_in || []).length === 0 ? (
                                <Badge variant="outline">Aucun</Badge>
                              ) : (
                                (c.beats_ucar_in || []).map((kpi) => (
                                  <Badge key={`${c.name}-${kpi}`} variant="warning">
                                    {kpi}
                                  </Badge>
                                ))
                              )}
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

          {/* KPI Comparator Table */}
          {comparatorRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Tableau comparatif KPI — UCAR vs Concurrents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">KPI</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Concurrent</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase">UCAR</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Valeur</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Verdict</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparatorRows.map((row, idx) => (
                        <tr key={`${row.kpi}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{row.kpi}</td>
                          <td className="py-3 px-4 text-slate-700">{row.competitor}</td>
                          <td className="py-3 px-4 text-right text-slate-700">{row.ucarValue}</td>
                          <td className="py-3 px-4 text-right text-slate-700">{row.competitorValue}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                row.verdict === "Competitor leads"
                                  ? "danger"
                                  : row.verdict === "UCAR leads"
                                    ? "success"
                                    : row.verdict === "Parity"
                                      ? "info"
                                      : "outline"
                              }
                            >
                              {row.verdict}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
