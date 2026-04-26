"use client"

import { motion } from "framer-motion"
import { Building2, Users, GraduationCap, Award, TreePine, BookOpen } from "lucide-react"

const stats = [
  { label: "Établissements", value: "12", icon: Building2, color: "#3B82F6" },
  { label: "Étudiants", value: "45 000+", icon: Users, color: "#10B981" },
  { label: "Personnels", value: "3 500+", icon: GraduationCap, color: "#8B5CF6" },
  { label: "Classement THE", value: "#401", icon: Award, color: "#F59E0B" },
  { label: "Score GreenMetric", value: "6 875", icon: TreePine, color: "#059669" },
  { label: "Projets Recherche", value: "43", icon: BookOpen, color: "#EC4899" },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '30px 30px' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">UCAR en Chiffres</h2>
          <p className="text-slate-400 mt-2 text-lg">L'Université de Carthage en mouvement vers l'excellence</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
