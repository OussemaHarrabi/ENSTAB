"use client"

import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { ChatPanel } from "@/components/ai/chat-panel"

export default function InstChatPage() {
  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col">
        <div className="mb-4"><h1 className="text-2xl font-bold text-slate-900">Assistant IA — Institution</h1><p className="text-sm text-slate-500 mt-1">Requêtes en langage naturel sur les données de votre institution</p></div>
        <Card className="flex-1 overflow-hidden border-0 shadow-none"><ChatPanel embedded /></Card>
      </div>
    </div>
  )
}
