"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { Calendar, Plus } from "lucide-react"

export default function TeacherRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Réservation de Salles</h1><Button size="sm"><Plus size={14} className="mr-1" />Réserver</Button></div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { room: 'Salle 204', capacity: 48, equip: 'Projecteur, Tableau', status: 'Disponible' },
          { room: 'Labo 3', capacity: 24, equip: 'PC, Logiciels', status: 'Occupé' },
          { room: 'Amphi A', capacity: 200, equip: 'Son, Projecteur', status: 'Disponible' },
        ].map((r, i) => (
          <Card key={i}><CardContent className="p-4"><div className="flex justify-between items-start"><div><h3 className="font-medium text-slate-800">{r.room}</h3><p className="text-xs text-slate-400">{r.capacity} places · {r.equip}</p></div><Badge variant={r.status === 'Disponible' ? 'success' : 'danger'}>{r.status}</Badge></div></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
