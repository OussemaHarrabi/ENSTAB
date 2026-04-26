"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { Plus } from "lucide-react"

export default function InstUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des Comptes</h1>
        <Button size="sm"><Plus size={14} className="mr-1" />Nouveau</Button>
      </div>
      <Card>
        <CardContent>
          <DataTable
            data={[
              { name: 'Chef Académique', email: 'chef.acad@ensi.tn', role: 'Chef Dept.', status: 'Actif' },
              { name: 'Responsable RH', email: 'rh@ensi.tn', role: 'Chef Dept.', status: 'Actif' },
              { name: 'Comptable', email: 'compta@ensi.tn', role: 'Staff', status: 'Actif' },
              { name: 'Pr. Amel Mansouri', email: 'amel.mansouri@ensi.tn', role: 'Enseignant', status: 'Actif' },
            ]}
            columns={[
              { key: 'name', label: 'Nom', render: (item: any) => <div className="flex items-center gap-2"><Avatar initials={item.name[0]} className="w-7 h-7 text-[10px]" /><span>{item.name}</span></div> },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Rôle', render: (item: any) => <Badge variant="info">{item.role}</Badge> },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'Actif' ? 'success' : 'danger'}>{item.status}</Badge> },
            ]}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
