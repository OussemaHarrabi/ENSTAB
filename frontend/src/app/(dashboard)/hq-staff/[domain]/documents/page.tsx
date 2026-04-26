"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { domainLabels } from "@/lib/mock-data"
import { FileText, Download, Upload } from "lucide-react"

const docs = [
  { name: 'Circulaire N°2025-012', type: 'PDF', date: '2025-04-20', dept: 'Tous' },
  { name: 'Guide des Procédures Académiques', type: 'PDF', date: '2025-04-15', dept: 'Académique' },
  { name: 'Modèle de Rapport Annuel', type: 'DOCX', date: '2025-04-10', dept: 'Tous' },
  { name: 'Règlement Intérieur Révisé', type: 'PDF', date: '2025-04-05', dept: 'Juridique' },
]

export default function DocumentsPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Documents — {domainLabels[params.domain as string] || params.domain}</h1><Button size="sm"><Upload size={14} className="mr-1" />Ajouter</Button></div>
      <Card><CardContent className="space-y-2 p-6">
        {docs.map((d, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3"><FileText size={18} className="text-slate-400" /><div><p className="text-sm font-medium text-slate-700">{d.name}</p><p className="text-xs text-slate-400">{d.date} · {d.dept}</p></div></div>
            <div className="flex items-center gap-2"><Badge variant="outline">{d.type}</Badge><Button variant="ghost" size="sm"><Download size={14} /></Button></div>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
