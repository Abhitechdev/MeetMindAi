// ponytail: no "use client", no framer-motion — hero <h1> is the LCP element,
// must be server-rendered HTML so it arrives in the first response
import React from "react";

const HeroSection = React.memo(function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle Aurora Background */}
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-accent-purple/20 via-accent-blue/10 to-transparent blur-[100px] -z-10 pointer-events-none rounded-full opacity-50" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/30 px-4 py-1.5 text-xs font-medium text-muted mb-8 shadow-sm backdrop-blur-md animate-fade-in-up">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-purple animate-pulse" />
          MeetMind AI 2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
          Transform Meetings Into
          <br />
          <span className="gradient-text">
            Actionable Intelligence
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
          Upload recordings and instantly generate transcripts, summaries, action items, decisions, risks, and follow-ups.
        </p>

        <div className="flex justify-center animate-fade-in-up animation-delay-300">
          <a
            href="#upload-section"
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-10 py-4 text-base font-semibold text-white shadow-lg shadow-accent-purple/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-purple/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple overflow-hidden"
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            
            <span className="relative">Try it Free</span>
            <svg className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
});

export default HeroSection;
