"use client"

import { Card, CardContent } from "@/components/ui"
import { ChatPanel } from "@/components/ai/chat-panel"
import { MessageSquare } from "lucide-react"

export default function ChatRecPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}><MessageSquare size={20} className="text-purple-600" /></div><div><h1 className="text-2xl font-bold text-slate-900">Assistant Recherche</h1></div></div>
      <Card className="h-[calc(100vh-220px)]"><CardContent className="p-0 h-full"><ChatPanel /></CardContent></Card>
    </div>
  )
}
