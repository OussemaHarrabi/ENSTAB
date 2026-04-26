"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Progress } from "@/components/ui"
import { DataTable } from "@/components/tables/data-table"
import { useState } from "react"
import { Save, AlertTriangle } from "lucide-react"

export default function TeacherGradesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Saisie des Notes</h1><Button size="sm"><Save size={14} className="mr-1" />Enregistrer</Button></div>
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /><span className="text-sm text-amber-700">Attention: La distribution des notes s'écarte de la moyenne nationale de 15%</span></div>
      <Card><CardContent>
        <DataTable
          data={[
            { name: 'Ali Ben Salem', ds: 14, tp: 16, exam: 12, final: 13.5 },
            { name: 'Sarra Khelifi', ds: 17, tp: 18, exam: 15, final: 16.2 },
            { name: 'Mohamed Ali', ds: 8, tp: 10, exam: 11, final: 9.8 },
            { name: 'Nadia Bouazizi', ds: 15, tp: 14, exam: 16, final: 15.3 },
          ]}
          columns={[
            { key: 'name', label: 'Étudiant' },
            { key: 'ds', label: 'DS /20', render: (item: any) => <input defaultValue={item.ds} className="w-16 h-8 rounded border border-slate-200 text-center text-sm" /> },
            { key: 'tp', label: 'TP /20', render: (item: any) => <input defaultValue={item.tp} className="w-16 h-8 rounded border border-slate-200 text-center text-sm" /> },
            { key: 'exam', label: 'Examen /20', render: (item: any) => <input defaultValue={item.exam} className="w-16 h-8 rounded border border-slate-200 text-center text-sm" /> },
            { key: 'final', label: 'Moyenne', render: (item: any) => <span className={`font-semibold ${item.final >= 14 ? 'text-emerald-600' : item.final >= 10 ? 'text-amber-600' : 'text-red-600'}`}>{item.final}</span> },
          ]}
        />
      </CardContent></Card>
    </div>
  )
}
