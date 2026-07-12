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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Column */}
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/50 px-3 py-1.5 text-xs font-medium text-muted mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MeetMind AI 2.0 is Live
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-foreground leading-[1.05] mb-6"
            >
              Never take meeting notes again.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted leading-relaxed mb-10 max-w-xl"
            >
              Upload your recordings and let our AI instantly generate flawless transcripts, executive summaries, and trackable action items. Stop typing, start engaging.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={scrollToUpload}
                className="px-6 py-3.5 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
              >
                Start Analyzing for Free
              </button>
              <button 
                onClick={() => {
                  window.location.href = "/history";
                }}
                className="px-6 py-3.5 rounded-lg bg-surface border border-card-border text-foreground font-medium hover:bg-surface/80 transition-colors"
              >
                View Sample Summary
              </button>
            </motion.div>
          </div>

          {/* Video Mockup Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-2xl mx-auto lg:mx-0 rounded-xl overflow-hidden border border-card-border bg-surface shadow-2xl"
          >
            {/* Mockup Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border bg-background/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/90" />
            </div>
            
            {/* Mockup Body */}
            <div className="w-full aspect-video bg-black relative">
              <video 
                src="/smpallre.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default HeroSection;
