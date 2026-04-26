"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Monitor, Download, CheckCircle2, AlertTriangle, Server, Shield } from "lucide-react"

const systems = [
  { name: 'ERP UCAR', version: 'v4.2', uptime: 99.8, status: 'OK', type: 'Critique' },
  { name: 'Base de Données', version: 'PostgreSQL 16', uptime: 99.5, status: 'OK', type: 'Critique' },
  { name: 'Portail Étudiant', version: 'v3.1', uptime: 98.2, status: 'OK', type: 'Important' },
  { name: 'Messagerie', version: 'Exchange 2024', uptime: 99.9, status: 'OK', type: 'Critique' },
  { name: 'Site Web UCAR', version: 'WordPress 6.5', uptime: 97.5, status: 'Warning', type: 'Standard' },
  { name: 'Système Paie', version: 'v2.8', uptime: 99.7, status: 'OK', type: 'Critique' },
  { name: 'WiFi Université', version: 'Controller 8.1', uptime: 95.8, status: 'Warning', type: 'Important' },
  { name: 'Stockage Cloud', version: 'Nextcloud 28', uptime: 99.2, status: 'OK', type: 'Standard' },
]

export default function SystemesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}><Server size={20} className="text-blue-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Systèmes</h1><p className="text-sm text-slate-500">24 systèmes supervisés — Disponibilité moyenne: 99.2%</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Systèmes', value: '24', icon: Monitor, color: '#2563EB' },
          { label: 'Opérationnels', value: '22', icon: CheckCircle2, color: '#059669' },
          { label: 'Avertissements', value: '2', icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Indisponibles', value: '0', icon: Shield, color: '#EF4444' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Système</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Version</th><th className="text-right py-3 px-4 font-semibold text-xs uppercase">Uptime</th><th className="text-left py-3 px-4 font-semibold text-xs uppercase">Type</th><th className="text-center py-3 px-4 font-semibold text-xs uppercase">Statut</th></tr></thead>
        <tbody>{systems.map((s, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 px-4 font-medium text-slate-900">{s.name}</td><td className="py-3 px-4 text-xs text-slate-500">{s.version}</td><td className="py-3 px-4 text-right font-medium">{s.uptime}%</td><td className="py-3 px-4"><Badge variant={s.type === 'Critique' ? 'destructive' : s.type === 'Important' ? 'warning' : 'outline'} className="text-[10px]">{s.type}</Badge></td><td className="py-3 px-4 text-center"><Badge variant={s.status === 'OK' ? 'success' : 'warning'}>{s.status}</Badge></td></tr>))}</tbody></table></CardContent></Card>
    </div>
  )
}
