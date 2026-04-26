"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { domainLabels } from "@/lib/mock-data"
import { FileText, Download, Plus } from "lucide-react"

export default function HqStaffReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Préparation de Rapports</h1><Button size="sm"><Plus size={14} className="mr-1" />Nouveau brouillon</Button></div>
      <Card><CardContent className="space-y-3 p-6">
        {['Brouillon rapport académique', 'Projet analyse financière', 'Ébauche benchmarks RH'].map((r, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <span className="text-sm font-medium text-slate-700">{r}</span>
            <Button variant="outline" size="sm"><FileText size={12} className="mr-1" />Éditer</Button>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
