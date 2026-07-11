"use client";

import React from "react";
import { motion } from "framer-motion";

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

      </div>
    </section>
  );
});

export default HeroSection;
