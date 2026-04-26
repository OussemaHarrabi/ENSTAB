import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString('fr-FR')
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ok': case 'success': case 'completed': return 'text-emerald-500'
    case 'warning': case 'partial': return 'text-amber-500'
    case 'critical': case 'failed': case 'overdue': return 'text-red-500'
    default: return 'text-slate-400'
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'ok': case 'success': case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'warning': case 'partial': return 'bg-amber-100 text-amber-700'
    case 'critical': case 'failed': case 'overdue': return 'bg-red-100 text-red-700'
    default: return 'bg-slate-100 text-slate-600'
  }
}

export function getTrafficLightColor(value: number, target: number): string {
  const pct = target > 0 ? (value / target) * 100 : 0
  if (pct >= 90) return 'bg-emerald-500'
  if (pct >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getTrafficLightEmoji(value: number, target: number): string {
  const pct = target > 0 ? (value / target) * 100 : 0
  if (pct >= 90) return '🟢'
  if (pct >= 70) return '🟡'
  return '🔴'
}

export function daysUntil(date: string): number {
  const d = new Date(date)
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function timeAgo(date: string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / (1000 * 60))
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `il y a ${days} jours`
}
