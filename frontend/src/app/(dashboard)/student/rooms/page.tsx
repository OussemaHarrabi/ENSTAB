"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { MapPin, Search } from "lucide-react"

export default function StudentRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Réservation de Salles</h1><Button size="sm">Réserver</Button></div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { room: 'Salle d\'étude 1', capacity: 20, equip: 'Tableau, WiFi', status: 'Libre' },
          { room: 'Labo Langues', capacity: 30, equip: 'Casques, Logiciels', status: 'Occupé' },
          { room: 'Salle Multimedia', capacity: 15, equip: 'PC, Projecteur', status: 'Libre' },
        ].map((r, i) => (
          <Card key={i}><CardContent className="p-4"><div className="flex justify-between items-start"><div><h3 className="font-medium text-slate-800">{r.room}</h3><p className="text-xs text-slate-400">{r.capacity} places · {r.equip}</p></div><Badge variant={r.status === 'Libre' ? 'success' : 'danger'}>{r.status}</Badge></div></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
