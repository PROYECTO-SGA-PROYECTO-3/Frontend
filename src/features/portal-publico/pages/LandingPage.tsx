import { LandingNavbar } from '../components/LandingNavbar'
import { HeroSection } from '../components/HeroSection'
import { MisionVisionSection } from '../components/MisionVisionSection'
import { PilaresSection } from '../components/PilaresSection'
import { FooterSection } from '../components/FooterSection'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingNavbar />

      <main>
        <div id="inicio">
          <HeroSection />
        </div>
        <div id="institucional">
          <MisionVisionSection />
        </div>
        <div id="pilares">
          <PilaresSection />
        </div>
      </main>

      <div id="contacto">
        <FooterSection />
      </div>
    </div>
  )
}
