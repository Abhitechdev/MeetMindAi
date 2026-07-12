"use client";

import React from "react";
import { motion } from "framer-motion";

const HeroSection = React.memo(function HeroSection() {
  const scrollToUpload = () => {
    const uploader = document.getElementById("audio-uploader");
    if (uploader) {
      uploader.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="relative pt-16 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Subtle Aurora Background */}
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-accent-purple/20 via-accent-blue/10 to-transparent blur-[100px] -z-10 pointer-events-none rounded-full opacity-50" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/30 px-4 py-1.5 text-xs font-medium text-muted mb-6 md:mb-8 shadow-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-purple"></span>
          </span>
          MeetMind AI 2.0 is Live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-[1.1] md:leading-[1.05]"
        >
          Never Take <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Meeting Notes Again
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2"
        >
          Upload your recordings and let our AI instantly generate flawless transcripts, executive summaries, and trackable action items. Stop typing, start engaging.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button 
              onClick={scrollToUpload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Start Analyzing for Free
            </button>
            <button 
              onClick={() => {
                // Scroll to a sample or trigger a demo modal
                window.location.href = "/history"; // For now, direct to history/dashboard
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface border border-card-border text-foreground font-semibold text-sm hover:bg-surface/60 transition-colors"
            >
              View Sample Summary
            </button>
          </div>
        </motion.div>

        {/* Dashboard Mockup - Above the Fold Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto w-full max-w-4xl rounded-xl sm:rounded-2xl border border-card-border bg-background/50 backdrop-blur-xl p-2 sm:p-4 shadow-2xl overflow-hidden"
        >
          {/* Mockup Header */}
          <div className="flex items-center gap-2 px-2 sm:px-4 pb-2 sm:pb-4 border-b border-card-border">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
            <div className="mx-auto h-4 sm:h-5 w-32 sm:w-48 rounded bg-surface/80" />
          </div>
          
          {/* Mockup Body */}
          <div className="w-full aspect-video bg-black/40 relative">
            {/* ponytail: lazy embed, native video tag beats custom players */}
            <video 
              src="/smpallre.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating Gradient to make it look active */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/0 via-accent-purple/10 to-accent-blue/0 -z-10 blur-xl animate-pulse" />
        </motion.div>

      </div>
    </section>
  );
});

export default HeroSection;
