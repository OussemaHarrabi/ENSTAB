import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants: Record<string, string> = {
  default: 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50',
  ghost: 'hover:bg-slate-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  link: 'text-blue-700 underline-offset-4 hover:underline',
}
const buttonSizes: Record<string, string> = {
  sm: 'h-8 px-3 text-xs rounded-md',
  default: 'h-10 px-4 py-2 text-sm rounded-md',
  lg: 'h-12 px-6 text-base rounded-lg',
  icon: 'h-10 w-10 rounded-md',
}

export function Button({ className, variant = 'default', size = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) {
  return <button className={cn('inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none', buttonVariants[variant], buttonSizes[size], className)} {...props} />
}

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)} {...props} />
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)} {...props} />
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn('font-semibold text-slate-900 text-lg tracking-tight', className)} {...props} />
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={cn('text-sm text-slate-500', className)} {...props} />
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('p-6 pt-4', className)} {...props} />

export const Badge = ({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) => {
  const badgeVariants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    outline: 'border border-slate-200 text-slate-600',
  }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', badgeVariants[variant], className)} {...props} />
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50', className)} {...props} />
}

export function Avatar({ className, initials, ...props }: React.HTMLAttributes<HTMLDivElement> & { initials?: string }) {
  return <div className={cn('flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium', className)} {...props}>{initials || 'U'}</div>
}

export const Separator = ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => <hr className={cn('border-slate-200', className)} {...props} />

export function Progress({ value, className }: { value: number; className?: string }) {
  return <div className={cn('h-2 bg-slate-200 rounded-full overflow-hidden', className)}><div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(value, 100)}%` }} /></div>
}

export function Tabs({ tabs, activeTab, onTabChange }: { tabs: { id: string; label: string }[]; activeTab: string; onTabChange: (id: string) => void }) {
  return <div className="flex border-b border-slate-200 mb-4">{tabs.map(t => <button key={t.id} onClick={() => onTabChange(t.id)} className={cn('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors', activeTab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700')}>{t.label}</button>)}</div>
}

export function Select({ value, onChange, options, placeholder }: { value?: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return <select value={value} onChange={e => onChange(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{placeholder && <option value="">{placeholder}</option>}{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
}
