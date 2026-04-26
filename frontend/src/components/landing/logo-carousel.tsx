"use client"

import { motion } from "framer-motion"
import { getLogoSrc } from "@/lib/logos"
import { LOGO_NAMES } from "@/lib/logos"

function LogoRow({ logos, direction = "left", speed = 30 }: { logos: string[]; direction?: "left" | "right"; speed?: number }) {
  return (
    <div className="relative overflow-hidden w-full">
      <motion.div
        className="flex gap-8"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-28 h-28 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-4 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <img src={getLogoSrc(logo)} alt={logo} className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function LogoCarousel() {
  const mid = Math.ceil(LOGO_NAMES.length / 2)
  const row1 = LOGO_NAMES.slice(0, mid)
  const row2 = LOGO_NAMES.slice(mid)

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.2em]">Nos Établissements</p>
          <p className="text-lg text-slate-600 mt-2">Les 12 établissements de l'Université de Carthage — une vision d'excellence</p>
        </motion.div>
      </div>

      <div className="space-y-6">
        <LogoRow logos={row1} direction="left" speed={35} />
        <LogoRow logos={row2} direction="right" speed={40} />
      </div>
    </section>
  )
}
