"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { AnomalyAlertCard } from "@/components/kpi/anomaly-alert"
import { allAlerts } from "@/lib/mock-data"
import { ShieldAlert, Download, RefreshCw, Filter, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { useState } from "react"

export default function AnomaliesPage() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')

  const filtered = filter === 'all' ? allAlerts : allAlerts.filter(a => a.severity === filter)
  const criticalCount = allAlerts.filter(a => a.severity === 'critical').length
  const warningCount = allAlerts.filter(a => a.severity === 'warning').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EF444420' }}>
              <ShieldAlert size={20} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Anomalies & Alertes IA</h1>
              <p className="text-sm text-slate-500">Détection intelligente d'anomalies avec explications SHAP</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Actualiser</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-700">{criticalCount}</p>
              <p className="text-xs text-red-600">Critiques</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle size={24} className="text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-amber-700">{warningCount}</p>
              <p className="text-xs text-amber-600">Avertissements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{allAlerts.length}</p>
              <p className="text-xs text-blue-600">Total Alertes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all' as const, label: 'Toutes', count: allAlerts.length },
          { key: 'critical' as const, label: 'Critiques', count: criticalCount },
          { key: 'warning' as const, label: 'Avertissements', count: warningCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        {filtered.map(alert => (
          <AnomalyAlertCard key={alert.id} alert={alert} />
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-slate-400">
              <CheckCircle2 size={40} className="mx-auto mb-2 text-emerald-400" />
              <p>Aucune anomalie détectée</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
