"use client"

import { motion } from "framer-motion"
import { BarChart3, Shield, MessageSquare, Globe, TrendingUp, Zap } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Pilotage Stratégique",
    desc: "Visualisez en temps réel les KPIs de tous vos établissements sur un tableau de bord unique. Prenez des décisions éclairées avec des données consolidées.",
    color: "#3B82F6",
  },
  {
    icon: Shield,
    title: "Intelligence Artificielle",
    desc: "Détection automatique d'anomalies, prédiction des appels d'offres, et assistant virtuel pour répondre à toutes vos questions sur les données UCAR.",
    color: "#10B981",
  },
  {
    icon: TrendingUp,
    title: "GreenMetric & Classements",
    desc: "Suivez et améliorez votre score GreenMetric sur 7 critères. UCAR leader national du développement durable universitaire, suivi THE et QS.",
    color: "#8B5CF6",
  },
  {
    icon: Globe,
    title: "Coopération Internationale",
    desc: "Gérez vos accords internationaux, suivez les mobilités Erasmus+, et développez votre réseau de partenaires académiques à travers le monde.",
    color: "#F59E0B",
  },
  {
    icon: MessageSquare,
    title: "Collecte & Remontée d'Information",
    desc: "Des étudiants et enseignants vers les services, puis vers la présidence. Un flux de données continu et fiable pour une gouvernance transparente.",
    color: "#EC4899",
  },
  {
    icon: Zap,
    title: "14 Rôles, des Solutions Sur-Mesure",
    desc: "Présidence, RH, Finances, Budget, Enseignement, Recherche, SG, Informatique — chaque service a son mini-ERP avec des indicateurs qui lui sont propres.",
    color: "#06B6D4",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '30px 30px' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Une Plateforme, des Solutions</h2>
          <p className="text-slate-400 mt-2 text-lg">Ce que UCAR Intelligence apporte à votre quotidien</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${f.color}15` }}
              >
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
