"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { ScrollText, Download, RefreshCw, TrendingUp, AlertTriangle, Clock, CheckCircle2, FileText, Plus } from "lucide-react"
import { useState } from "react"

const predictedOffres = [
  { id: 'AO-001', title: 'Fourniture d\'équipements informatiques', service: 'Service Informatique', budget: 450000, probability: 92, deadline: 'Juin 2025', status: 'high' },
  { id: 'AO-002', title: 'Travaux de rénovation bâtiment A', service: 'Service Équipement', budget: 1200000, probability: 85, deadline: 'Sep 2025', status: 'high' },
  { id: 'AO-003', title: 'Abonnements bibliothèque numérique', service: 'Service Bibliothèque', budget: 180000, probability: 78, deadline: 'Aoû 2025', status: 'medium' },
  { id: 'AO-004', title: 'Formation continue du personnel', service: 'Service RH', budget: 250000, probability: 72, deadline: 'Oct 2025', status: 'medium' },
  { id: 'AO-005', title: 'Maintenance des systèmes solaires', service: 'Service Équipement', budget: 350000, probability: 65, deadline: 'Déc 2025', status: 'low' },
]

const activeOffres = [
  { id: 'AO-101', title: 'Acquisition de mobiliers de bureau', service: 'Service Budget', budget: 300000, status: 'open', deadline: '15 Mai 2025', responses: 4 },
  { id: 'AO-102', title: 'Prestation de nettoyage 2025-2026', service: 'Service Juridique', budget: 600000, status: 'evaluation', deadline: '30 Avr 2025', responses: 7 },
  { id: 'AO-103', title: 'Renouvellement licences logicielles', service: 'Service Informatique', budget: 150000, status: 'awarded', deadline: '01 Mai 2025', responses: 3, winner: 'TechSoft Tunisie' },
]

export default function AppelsOffresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0891B220' }}>
              <ScrollText size={20} className="text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Appels d'Offres</h1>
              <p className="text-sm text-slate-500">Gestion prévisionnelle et suivi des appels d'offres UCAR</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex items-center gap-1.5"><Plus size={14} /> Nouvel AO</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Prédictions IA', value: '5', icon: TrendingUp, color: '#0891B2', sub: 'Nouveaux besoins' },
          { label: 'En Cours', value: '3', icon: Clock, color: '#D97706', sub: 'En traitement' },
          { label: 'Budget Total', value: '2.85M', icon: FileText, color: '#059669', sub: 'DT' },
          { label: 'Économies', value: '12%', icon: TrendingUp, color: '#2563EB', sub: 'Via IA' },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <s.icon size={16} style={{ color: s.color }} /> {s.label}
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Predicted */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-500" />
            Prédictions IA — Appels d'Offres à Venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictedOffres.map((ao, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-cyan-200 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{ao.title}</span>
                    <Badge variant={ao.status === 'high' ? 'destructive' : ao.status === 'medium' ? 'warning' : 'default'} className="text-[10px]">
                      {ao.probability}%
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{ao.service} — Budget: {ao.budget.toLocaleString()} DT — Échéance: {ao.deadline}</p>
                </div>
                <div className="h-8 w-20 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ width: `${ao.probability}%`, backgroundColor: ao.probability >= 80 ? '#059669' : ao.probability >= 70 ? '#D97706' : '#94A3B8' }}>
                    {ao.probability}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Appels d'Offres Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeOffres.map((ao, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{ao.title}</span>
                    <Badge variant={ao.status === 'open' ? 'warning' : ao.status === 'evaluation' ? 'default' : 'success'}>
                      {ao.status === 'open' ? 'Ouvert' : ao.status === 'evaluation' ? 'Évaluation' : 'Attribué'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{ao.service} — Budget: {ao.budget.toLocaleString()} DT — {ao.responses} réponses</p>
                  {ao.winner && <p className="text-xs text-emerald-600 mt-0.5">Attribué à: {ao.winner}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{ao.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
