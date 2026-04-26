"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { Send } from "lucide-react"

export default function StudentSurveyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Enquête d'Employabilité</h1>
      <Card>
        <CardContent className="p-6">
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-6">
            <p className="font-medium text-amber-800">Cette enquête prend 30 secondes</p>
            <p className="text-sm text-amber-600">Vos réponses aident UCAR à améliorer ses indicateurs d'employabilité</p>
          </div>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-slate-700">Situation actuelle</label><select className="w-full h-10 rounded-lg border border-slate-300 mt-1 px-3 text-sm"><option>En recherche d'emploi</option><option>Employé</option><option>En stage</option><option>En poursuite d'études</option></select></div>
            <div><label className="text-sm font-medium text-slate-700">Délai d'obtention du premier emploi</label><select className="w-full h-10 rounded-lg border border-slate-300 mt-1 px-3 text-sm"><option>Moins de 3 mois</option><option>3-6 mois</option><option>6-12 mois</option><option>Plus d'un an</option></select></div>
            <div><label className="text-sm font-medium text-slate-700">Salaire mensuel net (TND)</label><select className="w-full h-10 rounded-lg border border-slate-300 mt-1 px-3 text-sm"><option>Moins de 1000</option><option>1000-1500</option><option>1500-2000</option><option>2000-3000</option><option>3000+</option></select></div>
            <div><label className="text-sm font-medium text-slate-700">Secteur d'activité</label><select className="w-full h-10 rounded-lg border border-slate-300 mt-1 px-3 text-sm"><option>Technologies</option><option>Finance</option><option>Industrie</option><option>Éducation</option><option>Santé</option></select></div>
            <Button className="w-full"><Send size={14} className="mr-2" />Envoyer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
