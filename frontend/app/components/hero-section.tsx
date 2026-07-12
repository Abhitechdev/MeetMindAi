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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle Aurora Background */}
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-accent-purple/20 via-accent-blue/10 to-transparent blur-[100px] -z-10 pointer-events-none rounded-full opacity-50" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/30 px-4 py-1.5 text-xs font-medium text-muted mb-8 shadow-sm backdrop-blur-md"
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
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
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
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your recordings and let our AI instantly generate flawless transcripts, executive summaries, and trackable action items. Stop typing, start engaging.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={scrollToUpload}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-foreground text-background font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Start Analyzing for Free
          </button>
          
          <div className="flex items-center gap-3 text-sm text-muted mt-4 sm:mt-0 px-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-surface flex items-center justify-center text-[10px] font-bold z-${5-i}`}>
                  {i === 4 ? "+2k" : "👤"}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start text-xs">
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
              <span>Loved by teams</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default HeroSection;
