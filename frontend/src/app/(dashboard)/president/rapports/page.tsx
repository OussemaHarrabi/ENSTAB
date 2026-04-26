"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { FileText, Download, RefreshCw, TrendingUp, BarChart3, FileSpreadsheet, Printer, Eye, Calendar } from "lucide-react"
import { useState } from "react"

const reportTemplates = [
  { name: 'Rapport de Performance Global', desc: 'KPIs, tendances, classements et alertes - Vue présidence', type: 'PDF', icon: FileText, color: '#1E3A5F', lastGenerated: '24 Avr 2025' },
  { name: 'GreenMetric Annuel', desc: 'Analyse détaillée des 7 critères GreenMetric par établissement', type: 'PDF', icon: FileText, color: '#059669', lastGenerated: '20 Avr 2025' },
  { name: 'Rapport Recherche', desc: 'Publications, affiliations, projets et doctorants UCAR', type: 'PDF', icon: FileText, color: '#7C3AED', lastGenerated: '18 Avr 2025' },
  { name: 'Budget Exécution', desc: 'Taux d\'exécution budgétaire par service et par établissement', type: 'XLSX', icon: FileSpreadsheet, color: '#2563EB', lastGenerated: '15 Avr 2025' },
  { name: 'Classements Internationaux', desc: 'Évolution THE, QS, GreenMetric et THE Impact', type: 'PDF', icon: FileText, color: '#D97706', lastGenerated: '12 Avr 2025' },
  { name: 'Conformité ISO', desc: 'Progression des certifications ISO 21001/14001/9001', type: 'PDF', icon: FileText, color: '#0891B2', lastGenerated: '10 Avr 2025' },
]

const scheduledReports = [
  { name: 'Rapport Mensuel Présidence', frequency: 'Mensuel', nextRun: '01 Mai 2025', format: 'PDF', recipients: 'Présidence, VP' },
  { name: 'GreenMetric Trimestriel', frequency: 'Trimestriel', nextRun: '01 Juin 2025', format: 'PDF', recipients: 'Présidence, SG' },
  { name: 'Synthèse Budget', frequency: 'Mensuel', nextRun: '05 Mai 2025', format: 'XLSX', recipients: 'Budget, Finances' },
]

export default function RapportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1E3A5F20' }}>
              <FileText size={20} className="text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Rapports & Export</h1>
              <p className="text-sm text-slate-500">Génération de rapports personnalisés pour la présidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTemplates.map((r, i) => (
          <Card key={i} className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: r.color + '15' }}>
                  <r.icon size={20} style={{ color: r.color }} />
                </div>
                <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{r.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">Dernier: {r.lastGenerated}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-slate-100 rounded"><Eye size={14} className="text-slate-400" /></button>
                  <button className="p-1.5 hover:bg-slate-100 rounded"><Download size={14} className="text-slate-400" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduled */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Rapports Programmés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledReports.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.frequency} — Vers: {r.recipients}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-700">Prochain: {r.nextRun}</p>
                    <p className="text-[10px] text-slate-400">Format: {r.format}</p>
                  </div>
                  <Button size="sm" variant="outline"><Printer size={14} className="mr-1" /> Générer</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
