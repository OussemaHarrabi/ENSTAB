"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"
import { domainLabels, institutions } from "@/lib/mock-data"
import { CheckCircle2, XCircle } from "lucide-react"

export default function DomainCompliancePage() {
  const params = useParams()
  const domain = params.domain as string

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[domain] || domain} — Conformité</h1>
      <Card>
        <CardHeader><CardTitle>Conformité Réglementaire par Institution</CardTitle></CardHeader>
        <CardContent>
          {institutions.slice(0, 10).map(inst => (
            <div key={inst.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">{inst.code}</span>
              <div className="flex items-center gap-2">
                {inst.accreditationStatus.length > 0
                  ? <><CheckCircle2 size={16} className="text-emerald-500" /><Badge variant="success">Conforme</Badge></>
                  : <><XCircle size={16} className="text-red-500" /><Badge variant="danger">Non conforme</Badge></>
                }
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
