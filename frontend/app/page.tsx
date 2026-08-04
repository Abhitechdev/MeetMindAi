import { Metadata } from 'next';
import GradientBackground from "./components/gradient-background";
import HeroSection from "./components/hero-section";
import BentoFeatures from "./components/bento-features";
import LanguageMarquee from "./components/language-marquee";
import WorkflowSteps from "./components/workflow-steps";
import InteractiveSampleViewer from "./components/interactive-sample-viewer";
import MeetingOrchestrator from "./components/meeting-orchestrator";

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

const HOMEPAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What file formats does MeetMind AI support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MeetMind AI supports MP3, WAV, M4A, MP4, WEBM, MOV, and AVI audio and video files up to 100MB per upload."
      }
    },
    {
      "@type": "Question",
      name: "How does MeetMind AI process meeting audio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MeetMind AI uses Whisper models for speech-to-text transcription and Gemini AI to generate executive summaries, key decisions, and action items."
      }
    },
    {
      "@type": "Question",
      name: "Is there a meeting bot joining my call?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. MeetMind AI requires no bot integration. Simply record your meeting locally or via your preferred platform, then upload the file when ready."
      }
    },
    {
      "@type": "Question",
      name: "Is my meeting data used to train AI models?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We process your audio recordings securely and never use your private meeting transcripts or summaries to train public AI models."
      }
    }
  ]
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_FAQ_SCHEMA) }}
      />
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero & Product Feature Overview */}
        <HeroSection />
        <BentoFeatures />
        
        {/* 3-Step Visual Workflow */}
        <WorkflowSteps />
        
        {/* Multilingual Support Marquee */}
        <LanguageMarquee />

        {/* Interactive Illustrative Output Viewer */}
        <InteractiveSampleViewer />
        
        {/* Interactive Client-Side Upload & Orchestrator */}
        <MeetingOrchestrator />
      </div>
    </main>
  );
}
