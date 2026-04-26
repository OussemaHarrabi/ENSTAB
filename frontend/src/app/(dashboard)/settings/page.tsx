"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Badge } from "@/components/ui"
import { Bell, Globe, Lock, User, Moon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><User size={16} />Profil</CardTitle></CardHeader><CardContent className="space-y-3">
        <div><label className="text-sm text-slate-600">Nom</label><Input defaultValue="Ali Ben Salem" /></div>
        <div><label className="text-sm text-slate-600">Email</label><Input defaultValue="ali.bensalem@ensi.tn" /></div>
        <Button size="sm">Enregistrer</Button>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Globe size={16} />Langue</CardTitle></CardHeader><CardContent><select className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"><option value="fr">Français</option><option value="en">English</option></select></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell size={16} />Notifications</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between"><span className="text-sm text-slate-600">Alertes anomalies</span><Badge variant="success">Activé</Badge></div></CardContent></Card>
    </div>
  )
}
