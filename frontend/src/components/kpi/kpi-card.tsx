"use client"

import { Card, CardContent } from "@/components/ui"
import { cn, formatNumber } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  percentage?: number
  targetValue?: string | number
  nationalAvg?: string | number
  rank?: string
  status?: 'ok' | 'warning' | 'critical' | 'default'
  icon?: React.ReactNode
  compact?: boolean
}

export function KpiCard({ title, value, unit, trend, trendValue, percentage, targetValue, nationalAvg, rank, status = 'default', icon, compact }: KpiCardProps) {
  const borderColor = status === 'critical' ? 'border-l-red-500' : status === 'warning' ? 'border-l-amber-500' : status === 'ok' ? 'border-l-emerald-500' : 'border-l-blue-600'

  return (
    <Card className={cn('border-l-4', borderColor)}>
      <CardContent className={cn(compact ? 'p-4' : 'p-5')}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">{title}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={cn('font-bold text-slate-900', compact ? 'text-xl' : 'text-3xl')}>
                {typeof value === 'number' ? formatNumber(value) : value}
              </span>
              {unit && <span className="text-sm text-slate-400">{unit}</span>}
            </div>
            {trend && (
              <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400')}>
                {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                <span>{trendValue ? `${trendValue > 0 ? '+' : ''}${trendValue}%` : 'Stable'}</span>
              </div>
            )}
          </div>
          {icon && <div className="p-2 rounded-lg bg-blue-50 text-blue-600">{icon}</div>}
        </div>
        {percentage !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', status === 'critical' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : status === 'ok' ? 'bg-emerald-500' : 'bg-blue-600')} style={{ width: `${Math.min(percentage, 100)}%` }} />
            </div>
          </div>
        )}
        {(targetValue || nationalAvg || rank) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
            {targetValue && <span>Objectif: {targetValue}</span>}
            {nationalAvg && <span>National: {nationalAvg}</span>}
            {rank && <span className="font-medium text-slate-700">Rang: {rank}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
