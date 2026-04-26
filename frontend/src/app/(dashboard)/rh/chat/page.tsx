"use client"

import { Card, CardContent } from "@/components/ui"
import { ChatPanel } from "@/components/ai/chat-panel"
import { MessageSquare } from "lucide-react"

export default function ChatRHPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D948820' }}><MessageSquare size={20} className="text-teal-600" /></div>
        <div><h1 className="text-2xl font-bold text-slate-900">Assistant RH</h1><p className="text-sm text-slate-500">Posez vos questions sur les ressources humaines</p></div>
      </div>
      <Card className="h-[calc(100vh-220px)]"><CardContent className="p-0 h-full"><ChatPanel /></CardContent></Card>
    </div>
  )
}
