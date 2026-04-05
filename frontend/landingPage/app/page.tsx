import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { SimulationSection } from "@/components/simulation-section"
import { FraudPipelineSection } from "@/components/fraud-pipeline-section"
import { IntelligenceSection } from "@/components/intelligence-section"
import { FinaleSection } from "@/components/finale-section"
import { Footer } from "@/components/footer"

const portalBtn =
  "inline-flex items-center justify-center px-5 py-2.5 text-white font-medium rounded transition-all duration-300 text-xs uppercase tracking-wider border border-white/20 hover:border-white/40"

export default function BhimaAstraPage() {
  return (
    <main className="min-h-screen relative" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Portal Buttons Header - Landing Page Only */}
<header className="absolute top-0 right-0 z-40 p-4 md:p-8">
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
    <Link
      href="/admin/login"
      className={`${portalBtn} bg-[#8b5cf6]/80 text-black hover:bg-[#8be375] shadow-[0_0_10px_rgba(156,237,134,0.5)] hover:shadow-[0_0_20px_rgba(156,237,134,0.7)]`}
    >
      Admin
    </Link>

    <Link
      href="/manager"
      className={`${portalBtn} bg-[#8b5cf6]/80 text-black hover:bg-[#8be375] shadow-[0_0_10px_rgba(156,237,134,0.5)] hover:shadow-[0_0_20px_rgba(156,237,134,0.7)]`}
    >
      Manager
    </Link>

    <Link
      href="/worker/login"
      className={`${portalBtn} bg-[#8b5cf6]/80 text-black hover:bg-[#8be375] shadow-[0_0_10px_rgba(156,237,134,0.5)] hover:shadow-[0_0_20px_rgba(156,237,134,0.7)]`}
    >
      Worker
    </Link>
  </div>
</header>

      {/* 00.01 - The Hook (Hero with Parallax) */}
      <HeroSection />
      
      {/* 00.02 - The Simulation (Split-Reality with Border Face Marquees) */}
      <SimulationSection />
      
      {/* 00.03 - Fraud Pipeline (Sticky Stacking Cards) */}
      <FraudPipelineSection />
      
      {/* 00.04 - The Intelligence (Be the System Canvas) */}
      <IntelligenceSection />
      
      {/* 00.05 - The Finale (Giant Typography & Stats Marquee) */}
      <FinaleSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
