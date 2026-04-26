"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Progress } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { CheckSquare } from "lucide-react"

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Gestion des Présences</h1><Button size="sm"><CheckSquare size={14} className="mr-1" />Marquer toutes</Button></div>
      <Card><CardHeader><CardTitle>Algorithmique Avancée — Séance du 26/04/2025</CardTitle></CardHeader><CardContent>
        <DataTable
          data={[
            { name: 'Ali Ben Salem', id: 'ET-001', status: 'Présent' },
            { name: 'Sarra Khelifi', id: 'ET-002', status: 'Présent' },
            { name: 'Mohamed Ali', id: 'ET-003', status: 'Absent' },
            { name: 'Nadia Bouazizi', id: 'ET-004', status: 'Retard' },
            { name: 'Khaled Gharbi', id: 'ET-005', status: 'Excuse' },
          ]}
          columns={[
            { key: 'name', label: 'Étudiant', sortable: true },
            { key: 'id', label: 'ID' },
            { key: 'status', label: 'Statut', render: (item: any) => <select defaultValue={item.status} className="h-8 rounded border border-slate-200 text-xs px-2"><option>Présent</option><option>Absent</option><option>Retard</option><option>Excuse</option></select> },
          ]}
        />
        <div className="mt-4 p-3 rounded-lg bg-slate-50"><div className="flex justify-between text-sm"><span>Taux de présence: 78%</span><Badge variant="warning">3 absences aujourd'hui</Badge></div><Progress value={78} className="mt-1" /></div>
      </CardContent></Card>
    </div>
  )
}
