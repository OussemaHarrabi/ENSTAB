"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  const router = useRouter()

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-800/40 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <Sparkles size={28} className="text-blue-200" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Prêt à transformer la gestion de l'UCAR ?
          </h2>
          <p className="text-lg text-blue-200/70 mb-10 max-w-2xl mx-auto">
            Rejoignez les 12 établissements qui font confiance à UCAR Intelligence pour centraliser
            leurs données, optimiser leurs KPIs et améliorer leur classement international.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="group h-12 px-8 rounded-xl bg-white hover:bg-blue-50 text-slate-900 font-semibold text-base transition-all shadow-lg shadow-black/20 flex items-center gap-2 justify-center"
            >
              Accéder à la Plateforme
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="h-12 px-8 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 font-medium text-base transition-all flex items-center gap-2 justify-center"
            >
              Découvrir les fonctionnalités
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
