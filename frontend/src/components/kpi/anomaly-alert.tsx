"use client"

import { Badge, Card, CardContent } from "@/components/ui"
import { cn, timeAgo } from "@/lib/utils"
import type { AnomalyAlert as AlertType } from "@/lib/types"
import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react"

export function AnomalyAlertCard({ alert, showActions = true }: { alert: AlertType; showActions?: boolean }) {
  const severityIcon = alert.severity === 'critical' ? <AlertCircle size={16} className="text-red-500" /> :
    alert.severity === 'warning' ? <AlertTriangle size={16} className="text-amber-500" /> : <Info size={16} className="text-blue-500" />

  const severityBg = alert.severity === 'critical' ? 'border-l-red-500 bg-red-50/50' :
    alert.severity === 'warning' ? 'border-l-amber-500 bg-amber-50/50' : 'border-l-blue-500 bg-blue-50/50'

  const statusLabel = alert.status === 'pending' ? 'En attente' : alert.status === 'acknowledged' ? 'Accusé' :
    alert.status === 'investigating' ? 'En cours' : 'Faux positif'
  const statusColor = alert.status === 'pending' ? 'danger' : alert.status === 'acknowledged' ? 'warning' :
    alert.status === 'investigating' ? 'info' : 'success'

  return (
    <Card className={cn('border-l-4', severityBg)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{severityIcon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}>
                {alert.severity === 'critical' ? 'CRITIQUE' : alert.severity === 'warning' ? 'ATTENTION' : 'INFO'}
              </Badge>
              <span className="text-xs font-medium text-slate-500">{alert.institutionName}</span>
              <span className="text-xs text-slate-400">{alert.domain}</span>
              <Badge variant={statusColor as any}>{statusLabel}</Badge>
              <span className="text-xs text-slate-400 ml-auto">{timeAgo(alert.timestamp)}</span>
            </div>
            <h4 className="text-sm font-medium text-slate-900 mt-1">{alert.title}</h4>
            <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
            {alert.shapFactors.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium text-slate-500">Facteurs contributifs (SHAP):</p>
                {alert.shapFactors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-40 truncate">{f.name}</span>
                    <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', alert.severity === 'critical' ? 'bg-red-400' : alert.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400')} style={{ width: `${f.contribution}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-8 text-right">{f.contribution}%</span>
                  </div>
                ))}
              </div>
            )}
            {showActions && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <button className="text-xs px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 font-medium text-slate-700">🔍 Investiguer</button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 font-medium text-slate-700">✓ Accuser réception</button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 font-medium text-slate-500">✕ Faux positif</button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
