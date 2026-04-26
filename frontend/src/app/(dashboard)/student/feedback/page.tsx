"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Progress, Badge } from "@/components/ui"
import { Star, ThumbsUp, MessageSquare, Camera } from "lucide-react"

export default function StudentFeedbackPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Feedbacks Campus</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Évaluation des Cours</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{ name: 'Algorithmique Avancée', note: 4 }, { name: 'Structure de Données', note: 3 }, { name: 'Intelligence Artificielle', note: 5 }].map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{c.name}</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} className={j < c.note ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Signaler un problème</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start"><Camera size={14} className="mr-2" />Problème équipement</Button>
              <Button variant="outline" className="w-full justify-start"><MessageSquare size={14} className="mr-2" />Accessibilité</Button>
              <Button variant="outline" className="w-full justify-start"><ThumbsUp size={14} className="mr-2" />Suggestion</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
