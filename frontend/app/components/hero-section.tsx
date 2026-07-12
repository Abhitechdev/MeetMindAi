"use client";

import React from "react";
import { motion } from "framer-motion";

const HeroSection = React.memo(function HeroSection() {
  return (
    <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/50 px-3 py-1.5 text-xs font-medium text-muted mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          MeetMind AI 2.0
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-foreground leading-[1.05] mb-6"
        >
          Transform Meetings Into<br className="hidden sm:block" /> Actionable Intelligence
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl"
        >
          Upload recordings and instantly generate transcripts, summaries, action items, decisions, risks, and follow-ups.
        </motion.p>

      </div>
    </section>
  );
});

export default HeroSection;
