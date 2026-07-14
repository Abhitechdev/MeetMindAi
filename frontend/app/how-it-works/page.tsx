"use client";

import React from "react";
import { motion } from "framer-motion";
import GradientBackground from "../components/gradient-background";

const STEPS = [
  {
    number: "01",
    title: "Upload Your Meeting",
    desc: "Simply upload your audio or video file. We support all major formats including MP3, MP4, WAV, and M4A.",
    icon: "📤",
  },
  {
    number: "02",
    title: "AI Transcription",
    desc: "Our system uses advanced Whisper AI models to convert speech to text with near-human accuracy, even with multiple speakers.",
    icon: "🎙️",
  },
  {
    number: "03",
    title: "Extract Insights",
    desc: "Gemini AI analyzes the transcript to generate an executive summary, identify key decisions, and extract action items.",
    icon: "🧠",
  },
  {
    number: "04",
    title: "Chat & Export",
    desc: "Ask the AI assistant questions about the meeting, or export your notes to Markdown, TXT, or copy them directly.",
    icon: "✨",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-20 flex flex-col">
      <GradientBackground />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            How It Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Four simple steps to transform your raw meeting recordings into actionable insights.
          </motion.p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-purple/50 via-accent-blue/50 to-transparent -translate-x-1/2 z-0 hidden sm:block" />

          <div className="space-y-12">
            {STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-12 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Number / Icon bubble */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl glass-card border border-card-border flex items-center justify-center text-2xl shadow-xl shadow-background/20 z-10 mx-auto sm:mx-0 bg-surface/80 backdrop-blur-md">
                    {step.icon}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 glass-card p-8 rounded-2xl glass-card-hover group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    <div className="relative z-10">
                      <span className="text-accent-purple font-mono text-sm font-semibold tracking-wider mb-2 block">
                        STEP {step.number}
                      </span>
                      <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
