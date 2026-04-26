import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "UCAR Intelligence",
  description: "Plateforme de Gestion Intelligente - Université de Carthage",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
