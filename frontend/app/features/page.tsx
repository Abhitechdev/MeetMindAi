import { Metadata } from "next";
import BentoFeatures from "../components/bento-features";
import GradientBackground from "../components/gradient-background";

export const metadata: Metadata = {
  title: "Features - MeetMind AI",
  description: "Explore the powerful features of MeetMind AI including speech-to-text, AI summaries, and more.",
};

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-12 flex flex-col">
      <GradientBackground />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Powerful Features
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Everything you need to extract maximum value from your meetings, powered by advanced AI.
          </p>
        </div>
        
        <BentoFeatures />
      </div>
    </main>
  );
}
