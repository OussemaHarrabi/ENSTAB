"use client"

import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { RefreshCw, Download } from "lucide-react"

export default function BlueprintSyncPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Synchronisation Blueprint</h1><Button size="sm"><RefreshCw size={14} className="mr-1" />Vérifier</Button></div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50">
            <div><p className="font-medium text-amber-800">Mise à jour disponible</p><p className="text-sm text-amber-600">Version 2.4 du blueprint publiée le 25/04/2026</p></div>
            <Button className="bg-amber-600 hover:bg-amber-700"><RefreshCw size={14} className="mr-1" />Synchroniser</Button>
          </div>
          <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
            <p className="font-medium text-emerald-800">Dernière synchro: 15/04/2026</p>
            <p className="text-sm text-emerald-600">Aucune modification locale en attente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
