"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle Aurora Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-accent-purple/20 via-accent-blue/10 to-transparent blur-[100px] -z-10 pointer-events-none rounded-full opacity-50" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/30 px-4 py-1.5 text-xs font-medium text-muted mb-8 shadow-sm backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-purple animate-pulse" />
          MeetMind AI 2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
        >
          Transform Meetings Into
          <br />
          <span className="gradient-text">
            Actionable Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
        >
          Upload recordings and instantly generate transcripts, summaries, action items, decisions, risks, and follow-ups.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-4 mb-10"
        >
          {/* @ts-ignore */}
          <dotlottie-wc src="https://lottie.host/de3c229a-8178-4113-9937-1d2b03ad4444/e9RdggEUwX.lottie" style={{ width: "300px", height: "300px" }} autoplay loop></dotlottie-wc>
        </motion.div>

      </div>
    </section>
  );
}
