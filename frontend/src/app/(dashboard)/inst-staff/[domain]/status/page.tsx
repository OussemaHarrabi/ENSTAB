"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui"

export default function StatusPage() {
  const items = [
    { ref: 'INV-2025-0425-01', type: 'Facture', date: '25/04/2025', amount: '1,250 TND', status: 'Approuvé' },
    { ref: 'SUP-2025-0424-03', type: 'Fournitures', date: '24/04/2025', amount: '350 TND', status: 'En attente' },
    { ref: 'EXP-2025-0423-12', type: 'Note de frais', date: '23/04/2025', amount: '180 TND', status: 'Rejeté' },
    { ref: 'INV-2025-0422-08', type: 'Facture', date: '22/04/2025', amount: '2,800 TND', status: 'Approuvé' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Suivi des Soumissions</h1>
      <Card><CardContent className="p-6 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <div><p className="text-sm font-medium text-slate-700">{item.ref}</p><p className="text-xs text-slate-400">{item.type} · {item.date} · {item.amount}</p></div>
            <Badge variant={item.status === 'Approuvé' ? 'success' : item.status === 'En attente' ? 'warning' : 'danger'}>{item.status}</Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}
