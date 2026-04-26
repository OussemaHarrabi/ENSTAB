"use client"

import { HeroCarousel } from "@/components/landing/hero-carousel"
import { LogoCarousel } from "@/components/landing/logo-carousel"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroCarousel />
      <LogoCarousel />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
