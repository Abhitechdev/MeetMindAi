import GradientBackground from "./components/gradient-background";
import HeroSection from "./components/hero-section";
import BentoFeatures from "./components/bento-features";
import LanguageMarquee from "./components/language-marquee";
import MeetingOrchestrator from "./components/meeting-orchestrator";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Static Server-Rendered Content - Unblocks LCP */}
        <HeroSection />
        <BentoFeatures />
        <LanguageMarquee />
        
        {/* Interactive Client-Side Orchestrator */}
        <MeetingOrchestrator />
      </div>
    </main>
  );
}
