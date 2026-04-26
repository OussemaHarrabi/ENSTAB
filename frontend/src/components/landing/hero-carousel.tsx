"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronRight, Sparkles } from "lucide-react"

const slides = [
  {
    title: "UCAR Intelligence",
    subtitle: "Plateforme de Gestion Intelligente — Université de Carthage",
    tagline: "Centralisez, analysez et optimisez la performance de l'Université de Carthage",
    image: null,
  },
  {
    title: "Gouvernance & KPIs en Temps Réel",
    subtitle: "Tableaux de bord institutionnels, académiques et GreenMetric",
    tagline: "Taux de réussite · Budget · Publications · Classements THE/QS",
    image: null,
  },
  {
    title: "12 Établissements, Une Vision",
    subtitle: "Fédération des établissements d'enseignement supérieur de l'UCAR",
    tagline: "ENICarthage · INSAT · EPT · SUP'COM · IHEC · et 7 autres",
    image: null,
  },
]

export function HeroCarousel() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [])

  const gradients = [
    "from-blue-900 via-blue-950 to-slate-900",
    "from-emerald-900 via-teal-950 to-slate-900",
    "from-indigo-900 via-violet-950 to-slate-900",
  ]

  return (
    <section className="relative min-h-[85vh] overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradients[current]}`}
        />
      </AnimatePresence>

      {/* Animated grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80 mb-8"
            >
              <Sparkles size={14} className="text-blue-300" />
              Hack4UCAR 2025
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                {slides[current].title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto mb-4 font-light">
              {slides[current].subtitle}
            </p>
            <p className="text-base text-blue-200/50 max-w-2xl mx-auto mb-10 font-light">
              {slides[current].tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="group h-12 px-8 rounded-xl bg-white hover:bg-blue-50 text-slate-900 font-semibold text-base transition-all shadow-lg shadow-black/20 flex items-center gap-2 justify-center"
              >
                Accéder à la Plateforme
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#features"
                className="h-12 px-8 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 font-medium text-base transition-all flex items-center gap-2 justify-center"
              >
                En savoir plus
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-3 mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? "w-10 h-2 bg-white shadow-lg shadow-white/25"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
