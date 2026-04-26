"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Shield, Download, CheckCircle2, AlertTriangle, Target, Lock } from "lucide-react"

const vulnData = [
  { level: 'Critique', count: 2 }, { level: 'Élevée', count: 5 }, { level: 'Moyenne', count: 12 }, { level: 'Faible', count: 18 },
]

const securityItems = [
  { check: 'Pare-feu actif', status: 'OK', score: 100 },
  { check: 'Anti-virus à jour', status: 'OK', score: 95 },
  { check: 'MFA activé', status: 'Warning', score: 72 },
  { check: 'Sauvegardes automatiques', status: 'OK', score: 98 },
  { check: 'Politique mots de passe', status: 'OK', score: 85 },
  { check: 'Audit trimestriel', status: 'Warning', score: 65 },
  { check: 'VPN obligatoire', status: 'OK', score: 90 },
  { check: 'Chiffrement données', status: 'OK', score: 88 },
]

export default function SecuritePage() {
  const score = Math.round(securityItems.reduce((a, i) => a + i.score, 0) / securityItems.length)
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}><Shield size={20} className="text-blue-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Sécurité</h1><p className="text-sm text-slate-500">Score global: {score}% — Dernier audit: Mars 2025</p></div></div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Score Sécurité', value: `${score}%`, icon: Shield, color: '#2563EB' },
          { label: 'Vulnérabilités', value: '37', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Audits Passés', value: '4', icon: CheckCircle2, color: '#059669' },
          { label: 'Conformité RGPD', value: '82%', icon: Target, color: '#0D9488' },
        ].map((s, i) => (<Card key={i}><CardContent className="p-4 flex items-center gap-3"><s.icon size={20} style={{ color: s.color }} /><div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Vulnérabilités</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={vulnData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="level" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#EF4444" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-semibold">Contrôles de Sécurité</CardTitle></CardHeader><CardContent><div className="space-y-2">{securityItems.map((c, i) => (<div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100"><div className="flex items-center gap-2"><Lock size={14} className={c.status === 'OK' ? 'text-emerald-500' : 'text-amber-500'} /><span className="text-sm text-slate-700">{c.check}</span></div><div className="flex items-center gap-2"><div className="h-2 w-16 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.score >= 90 ? '#059669' : c.score >= 70 ? '#F59E0B' : '#EF4444' }}></div></div><Badge variant={c.status === 'OK' ? 'success' : 'warning'} className="text-[10px]">{c.status}</Badge></div></div>))}</div></CardContent></Card>
      </div>
    </div>
  )
}
