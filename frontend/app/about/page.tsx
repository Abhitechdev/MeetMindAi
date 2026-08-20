"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import GradientBackground from "../components/gradient-background";

export default function AboutPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
            <span>Our Mission & Vision</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Building Memory for <span className="bg-gradient-to-r from-accent-purple via-foreground to-accent-blue bg-clip-text text-transparent">Modern Teams</span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            MeetMind AI was founded on a simple premise: human conversation is the most powerful tool for collaboration, but the hardest medium to recall accurately.
          </p>
        </motion.div>

        {/* Meet the Founder Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative glass-card glass-card-hover p-8 md:p-10 mb-16 rounded-2xl border border-accent-purple/20 bg-accent-purple/5 shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-blue/10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden border-2 border-accent-purple/50 shadow-xl shrink-0">
              <Image
                src="/images/abhishek-kumar.jpg"
                alt="Abhishek - Founder & Lead Developer of MeetMind AI"
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                Founder & Lead Developer
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Built by Abhishek</h2>
              <p className="text-sm text-muted leading-relaxed max-w-xl">
                &quot;I created MeetMind AI to eliminate manual note-taking and ensure teams never lose critical decisions or action items after a call.&quot;
              </p>
              <Link 
                href="/authors/abhishek" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-purple hover:text-accent-blue transition-colors pt-2"
              >
                <span>Read Founder Profile & Bio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Problem vs Solution Bento Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card glass-card-hover p-8 md:p-10 rounded-2xl border border-card-border/80"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">The Problem</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Every day, professionals spend thousands of hours in meetings. Brilliant ideas are shared, critical decisions are finalized, and complex action items are assigned.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Yet within 24 hours, over 70% of conversation details decay. Context gets lost, decisions are re-debated, and teams waste time figuring out what was committed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card glass-card-hover p-8 md:p-10 rounded-2xl border border-accent-purple/20 bg-accent-purple/5"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mb-6 text-accent-purple">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Our Solution</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              MeetMind AI acts as an objective, instant memory for your workflow. By combining Faster Whisper speech recognition with Gemini AI models.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              We don&apos;t just generate raw text—we extract actionable intelligence: executive overviews, decision logs, and task assignments so you can focus on the meeting itself.
            </p>
          </motion.div>
        </div>

        {/* Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">Core Principles</h2>
            <p className="text-sm text-muted max-w-lg mx-auto">The engineering and privacy standards guiding every feature we ship.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-card-border/80">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mb-4 text-accent-blue">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Frictionless Capture</h3>
              <p className="text-xs text-muted leading-relaxed">No intrusive bots joining your video calls. Simply upload your audio or video file whenever you are ready.</p>
            </div>
            
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-card-border/80">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mb-4 text-accent-purple">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Private by Design</h3>
              <p className="text-xs text-muted leading-relaxed">Your audio recordings are processed securely on protected infrastructure and never used to train public AI models.</p>
            </div>
            
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-card-border/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Signal Over Noise</h3>
              <p className="text-xs text-muted leading-relaxed">We filter out casual chatter and filler words to highlight actionable decisions, promises, and deliverables.</p>
            </div>
          </div>
        </motion.div>

        {/* Publisher & Editorial Standards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-10 text-left rounded-2xl border border-card-border/80 mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-accent-purple" />
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Publisher & Editorial Standards</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed mb-8">
            MeetMind AI is committed to maintaining strict standards for all public documentation, help guides, and technical articles published on our platform. Our editorial philosophy prioritizes accuracy, transparency, and actionable value for technical leaders and remote teams.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Publisher Information</h3>
              <p className="text-sm text-muted leading-relaxed">
                MeetMind AI is an independent software tool built to provide privacy-first meeting intelligence. All content, comparative guides, and product documentation are published directly by the core engineering team. We do not accept sponsored placements or paid product reviews.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Editorial Approach & Verification</h3>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Our content strategy strictly adheres to an objective, engineering-first perspective. We verify every technical claim against actual code behavior.
              </p>
              <ul className="list-disc list-inside text-sm text-muted space-y-2 ml-2">
                <li><strong className="text-foreground">Human Engineering Review:</strong> All architecture guides and comparison matrices are reviewed by our founding developer.</li>
                <li><strong className="text-foreground">Fact-Checking:</strong> Product capabilities (both ours and competitors) are verified using official documentation, API references, and hands-on testing.</li>
                <li><strong className="text-foreground">Zero Hallucinations Guarantee:</strong> Meeting summaries and AI chat responses are strictly grounded in your uploaded transcript context.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Corrections Policy</h3>
              <p className="text-sm text-muted leading-relaxed">
                The AI landscape moves rapidly. When new models are released or competitor features are updated, we actively revise our documentation. If a factual error is identified in our technical reviews or product guides, we correct it promptly and add a "Last Updated" timestamp to the article to reflect the change.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Contact Us</h3>
              <p className="text-sm text-muted leading-relaxed">
                We welcome feedback, corrections, and questions regarding our editorial content or privacy practices. You can reach our editorial team directly at:
              </p>
              <a href="mailto:support@meetmindai.co.in" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-purple hover:text-accent-blue transition-colors mt-2">
                support@meetmindai.co.in <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
