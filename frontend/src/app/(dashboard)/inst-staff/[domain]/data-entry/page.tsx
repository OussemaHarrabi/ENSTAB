"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { DataEntryForm } from "@/components/forms"

export default function DataEntryPage() {
  const params = useParams()
  const fields = [
    { label: 'Type d\'opération', type: 'select', options: [{ value: 'invoice', label: 'Facture' }, { value: 'supply', label: 'Demande fournitures' }, { value: 'expense', label: 'Note de frais' }, { value: 'incident', label: 'Signalement incident' }] },
    { label: 'Montant (TND)', type: 'number' },
    { label: 'Description', type: 'textarea' },
    { label: 'Date', type: 'date' },
    { label: 'Pièce jointe', type: 'file' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Saisie Rapide</h1>
      <Card><CardContent className="p-6"><DataEntryForm fields={fields} /></CardContent></Card>
    </div>
  )
}
