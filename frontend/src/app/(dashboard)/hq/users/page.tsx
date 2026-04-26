"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Avatar } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { institutions } from "@/lib/mock-data"
import { Plus, Shield, UserCog } from "lucide-react"

export default function UsersPage() {
  const users = [
    { name: 'Président UCAR', email: 'president@ucar.tn', role: 'Super Admin UCAR', institution: 'UCAR', status: 'Actif' },
    { name: 'Directeur ENSI', email: 'directeur@ensi.tn', role: 'Admin Institution', institution: 'ENSI', status: 'Actif' },
    { name: 'Chef Département Académique', email: 'chef.acad@fst.tn', role: 'Chef Dept. (UCAR)', institution: 'FST', status: 'Actif' },
    { name: 'Responsable RH', email: 'rh@isg.tn', role: 'Chef Dept. (Inst.)', institution: 'ISG', status: 'Actif' },
    { name: 'Professeur Mehdi Ben Ali', email: 'mehdi.benali@insat.tn', role: 'Enseignant', institution: 'INSAT', status: 'Actif' },
    { name: 'Staff Financier', email: 'finance@enib.tn', role: 'Staff Institution', institution: 'ENICarthage', status: 'Actif' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-sm text-slate-500 mt-1">{users.length} utilisateurs · 35 institutions</p>
        </div>
        <Button size="sm"><Plus size={14} className="mr-1" />Nouvel utilisateur</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            data={users}
            columns={[
              { key: 'name', label: 'Nom', render: (item: any) => <div className="flex items-center gap-2"><Avatar initials={item.name[0]} className="w-7 h-7 text-[10px]" /><span className="font-medium text-slate-700">{item.name}</span></div>, sortable: true },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Rôle', render: (item: any) => <Badge variant="info">{item.role}</Badge> },
              { key: 'institution', label: 'Institution' },
              { key: 'status', label: 'Statut', render: (item: any) => <Badge variant={item.status === 'Actif' ? 'success' : 'danger'}>{item.status}</Badge> },
            ]}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
