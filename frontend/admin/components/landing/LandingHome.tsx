'use client'

import { useEffect } from 'react'
import { HeroSection } from '@/components/landing/hero-section'
import { SimulationSection } from '@/components/landing/simulation-section'
import { FraudPipelineSection } from '@/components/landing/fraud-pipeline-section'
import { IntelligenceSection } from '@/components/landing/intelligence-section'
import { FinaleSection } from '@/components/landing/finale-section'
import { Footer } from '@/components/landing/footer'
import { PortalNav } from '@/components/landing/PortalNav'

export function LandingHome() {
  useEffect(() => {
    document.documentElement.classList.add('landing-active')
    return () => document.documentElement.classList.remove('landing-active')
  }, [])

  return (
    <>
      <PortalNav />
      <main
        className="min-h-screen pt-16"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <HeroSection />
        <SimulationSection />
        <FraudPipelineSection />
        <IntelligenceSection />
        <FinaleSection />
        <Footer />
      </main>
    </>
  )
}
