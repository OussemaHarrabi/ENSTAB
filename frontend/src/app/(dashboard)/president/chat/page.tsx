"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { ChatPanel } from "@/components/ai/chat-panel"
import { MessageSquare, Download, RefreshCw } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563EB20' }}>
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Assistant IA</h1>
              <p className="text-sm text-slate-500">Assistant intelligent pour l'analyse des données UCAR</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="h-[calc(100vh-220px)]">
        <CardContent className="p-0 h-full">
          <ChatPanel />
        </CardContent>
      </Card>
    </div>
  )
}
