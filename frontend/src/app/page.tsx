"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, TrendingUp, BookOpen, TreePine, Shield, Users, BarChart3, MessageSquare, ArrowRight, ChevronDown, Globe, Award, GraduationCap, Sparkles } from "lucide-react"
import { LOGO_NAMES, getLogoSrc } from "@/lib/logos"

const logos = LOGO_NAMES

const stats = [
  { value: '12', label: 'Établissements', icon: Building2 },
  { value: '45 000+', label: 'Étudiants', icon: Users },
  { value: '3 500+', label: 'Personnels', icon: GraduationCap },
  { value: '#401', label: 'Classement THE', icon: Award },
  { value: '6 875', label: 'Score GreenMetric', icon: TreePine },
  { value: '43', label: 'Projets Recherche', icon: BookOpen },
]

const features = [
  { icon: BarChart3, title: 'Pilotage Stratégique', desc: 'Visualisez en temps réel les KPIs de tous vos établissements sur un tableau de bord unique. Prenez des décisions éclairées avec des données consolidées et des analyses prédictives.' },
  { icon: Shield, title: 'Intelligence Artificielle', desc: 'Détection automatique d\'anomalies, prédiction des appels d\'offres, et assistant virtuel pour répondre à toutes vos questions sur les données UCAR.' },
  { icon: TreePine, title: 'GreenMetric & ESG', desc: 'Suivez et améliorez votre score GreenMetric sur 7 critères. UCAR leader national du développement durable universitaire avec une progression de +40% en 5 ans.' },
  { icon: TrendingUp, title: 'Classements Internationaux', desc: 'Améliorez votre visibilité mondiale. THE, QS, GreenMetric — suivez l\'impact de vos actions sur le positionnement international de l\'Université de Carthage.' },
  { icon: Globe, title: 'Coopération Internationale', desc: 'Gérez vos 28 accords internationaux, suivez les mobilités Erasmus+, et développez votre réseau de partenaires académiques à travers 18 pays.' },
  { icon: MessageSquare, title: 'Collecte & Remontée d\'Information', desc: 'Des étudiants et enseignants vers les services, puis vers la présidence. Un flux de données continu et fiable pour une gouvernance透明e et efficace.' },
]

function LogoSlider({ direction = 'left', speed = 30 }: { direction?: 'left' | 'right', speed?: number }) {
  return (
    <div className="relative overflow-hidden w-full">
      <div className={`flex gap-6 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}
        style={{ animationDuration: `${speed}s`, width: 'max-content' }}>
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex-shrink-0 w-24 h-24 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-3 hover:shadow-md transition-shadow">
            <img src={getLogoSrc(logo)} alt={logo}
              className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center"><span className="text-white font-bold text-xs">UC</span></div>
            <span className="font-semibold text-slate-900">UCAR Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/login')} className="text-sm text-slate-600 hover:text-slate-900 font-medium">Connexion</button>
            <button onClick={() => router.push('/login')} className="h-9 px-5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-all flex items-center gap-1.5">
              Se connecter <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/30">
            <Building2 size={36} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
            UCAR <span className="text-blue-300">Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200/80 mb-2 font-light">Plateforme de Gestion Intelligente</p>
          <p className="text-base text-blue-300/60 mb-10 max-w-2xl mx-auto">Centralisez, analysez et optimisez la performance de l'Université de Carthage et de ses 12 établissements</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => router.push('/login')} className="h-12 px-8 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-semibold text-base transition-all shadow-lg flex items-center gap-2">
              Accéder à la Plateforme <ArrowRight size={18} />
            </button>
            <a href="#stats" className="h-12 px-8 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 font-medium text-base transition-all flex items-center gap-2">
              En savoir plus <ChevronDown size={16} />
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <ChevronDown size={24} className="text-white/30 animate-bounce" />
        </div>
      </section>

      {/* ─── LOGOS CAROUSELS ─── */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Nos Établissements</p>
          <p className="text-slate-600 mt-1">Université de Carthage — 12 établissements, une vision</p>
        </div>
        <div className="space-y-4">
          <LogoSlider direction="left" speed={35} />
          <LogoSlider direction="right" speed={40} />
        </div>
        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left { animation: scroll-left linear infinite; }
          .animate-scroll-right { animation: scroll-right linear infinite; }
        `}</style>
      </section>

      {/* ─── STATS ─── */}
      <section id="stats" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">UCAR en Chiffres</h2>
            <p className="text-slate-500 mt-2 text-lg">L'Université de Carthage en mouvement vers l'excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={22} className="text-blue-700" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Une Plateforme, des Solutions</h2>
            <p className="text-slate-500 mt-2 text-lg">Ce que UCAR Intelligence apporte à votre quotidien</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                  <f.icon size={22} className="text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-800/50 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={28} className="text-blue-200" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à transformer la gestion de l'UCAR ?</h2>
          <p className="text-lg text-blue-200/70 mb-8 max-w-2xl mx-auto">Rejoignez les 12 établissements qui font confiance à UCAR Intelligence pour centraliser leurs données et améliorer leur performance.</p>
          <button onClick={() => router.push('/login')} className="h-12 px-8 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-semibold text-base transition-all shadow-lg flex items-center gap-2 mx-auto">
            Accéder à la Plateforme <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-800 flex items-center justify-center"><span className="text-white font-bold text-[10px]">UC</span></div>
            <span className="font-medium text-slate-300">UCAR Intelligence</span>
          </div>
          <p>© {new Date().getFullYear()} Université de Carthage. Tous droits réservés.</p>
          <p className="text-slate-500">Hack4UCAR 2025</p>
        </div>
      </footer>
    </div>
  )
}
