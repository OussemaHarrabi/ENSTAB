"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Users, Download, RefreshCw, ArrowRight, Building2, Wallet, Wrench, Monitor, BookOpen, Shield, Scale, School, FlaskConical, GraduationCap } from "lucide-react"
import { ROLE_LABELS, ROLE_ACCENT_COLORS, ROLE_ICONS, ROLE_SHORT_LABELS, type RoleSlug } from "@/lib/types"
import Link from "next/link"

const services: { slug: RoleSlug; memberCount: number; director?: string }[] = [
  { slug: 'svc_rh', memberCount: 16, director: 'Mohamed Khedimallah' },
  { slug: 'svc_enseignement', memberCount: 8, director: 'Samar Ben Younes' },
  { slug: 'svc_bibliotheque', memberCount: 3, director: 'Ridha Makadmi' },
  { slug: 'svc_finances', memberCount: 4, director: 'Samir Ghodhbani' },
  { slug: 'svc_equipement', memberCount: 8, director: 'Neffisa Razouk' },
  { slug: 'svc_informatique', memberCount: 4, director: 'Iness Hmissi' },
  { slug: 'svc_budget', memberCount: 7, director: 'Abdelkader Dehliz' },
  { slug: 'svc_juridique', memberCount: 2, director: 'Rawia Elwafi' },
  { slug: 'svc_academique', memberCount: 5, director: 'Hatem Khaloui' },
  { slug: 'svc_recherche', memberCount: 9, director: 'Mehrez Hammami' },
  { slug: 'svc_secretaire', memberCount: 3, director: 'Wahida Boutabba' },
]

const iconComponents: Record<string, React.ReactNode> = {
  Users: <Users size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  BookOpen: <BookOpen size={20} />,
  Wallet: <Wallet size={20} />,
  Wrench: <Wrench size={20} />,
  Monitor: <Monitor size={20} />,
  Calculator: <Wallet size={20} />,
  Scale: <Scale size={20} />,
  School: <School size={20} />,
  FlaskConical: <FlaskConical size={20} />,
  FileText: <BookOpen size={20} />,
}

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1E3A5F20' }}>
              <Building2 size={20} className="text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Services UCAR</h1>
              <p className="text-sm text-slate-500">Vue d'ensemble des 11 services centraux de l'Université de Carthage</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => {
          const accent = ROLE_ACCENT_COLORS[s.slug]
          const iconName = ROLE_ICONS[s.slug]
          return (
            <Link key={s.slug} href={s.slug === 'svc_secretaire' ? '/sg' : `/${s.slug.replace('svc_', '')}`}>
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden h-full">
                <div className="h-1" style={{ backgroundColor: accent }} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent + '15' }}>
                      {iconComponents[iconName] || <Building2 size={20} style={{ color: accent }} />}
                    </div>
                    <Badge style={{ backgroundColor: accent + '15', color: accent }} className="border-0">
                      {s.memberCount} membres
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-3">{ROLE_LABELS[s.slug]}</h3>
                  {s.director && <p className="text-xs text-slate-400 mt-0.5">Dir.: {s.director}</p>}
                  <div className="flex items-center gap-1 mt-4 text-xs font-medium" style={{ color: accent }}>
                    <span>Accéder au tableau de bord</span>
                    <ArrowRight size={12} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
