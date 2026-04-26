"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { DocumentUpload } from "@/components/forms"

export default function IngestionPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Ingestion de Documents (IA)</h1>
      <DocumentUpload />
      <Card><CardHeader><CardTitle>Statut de l'Ingestion</CardTitle></CardHeader><CardContent>
        <div className="flex justify-between text-sm"><span>Documents traités aujourd'hui</span><Badge variant="success">12</Badge></div>
        <div className="flex justify-between text-sm mt-2"><span>En attente</span><Badge variant="warning">3</Badge></div>
        <div className="flex justify-between text-sm mt-2"><span>Échecs</span><Badge variant="danger">1</Badge></div>
      </CardContent></Card>
    </div>
  )
}
