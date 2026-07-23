"use client";

import { motion } from "framer-motion";
import GradientBackground from "../components/gradient-background";

export default function AboutPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            We build memory for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">modern teams</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            MeetMind AI was founded on a simple premise: human conversation is the most powerful tool for collaboration, but the worst medium for retention.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">The Problem</h2>
            <p className="text-muted leading-relaxed mb-4">
              Every day, teams spend thousands of hours in meetings. Brilliant ideas are shared, critical decisions are made, and complex action items are distributed.
            </p>
            <p className="text-muted leading-relaxed">
              But within 24 hours, 70% of that information decays. Context is lost, decisions are re-litigated, and teams spend their next meeting trying to remember what happened in the last one.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-8 md:p-10 border-purple-500/20 bg-purple-500/5"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Solution</h2>
            <p className="text-muted leading-relaxed mb-4">
              We built MeetMind AI to act as a flawless, objective memory for your organization. By combining state-of-the-art speech recognition with advanced language models.
            </p>
            <p className="text-muted leading-relaxed">
              We don't just transcribe what was said—we understand what it means. We extract the decisions, assign the action items, and synthesize the context so you can focus on the conversation, not the notes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-12">Core Principles</h2>
          
          <div className="grid sm:grid-cols-3 gap-6 text-left mb-24">
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Frictionless</h3>
              <p className="text-sm text-muted">No bots joining your calls. Just upload your audio when you're ready, and we handle the rest instantly.</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Private by Design</h3>
              <p className="text-sm text-muted">Your meetings are your business. We process your audio securely and never use your private conversations to train our models.</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Signal over Noise</h3>
              <p className="text-sm text-muted">We don't just give you a wall of text. Our AI separates the crucial decisions from the casual chatter.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-8">Editorial Transparency & Human Review</h2>
          <div className="glass-card p-8 md:p-10 text-left mb-16 border-blue-500/20 bg-blue-500/5">
            <h3 className="text-xl font-semibold text-foreground mb-4">How We Create Content</h3>
            <p className="text-muted leading-relaxed mb-4">
              At MeetMind AI, we believe in radical transparency regarding our use of Artificial Intelligence. While we build AI tools for productivity, we maintain strict editorial standards for our public content, blog posts, and educational resources.
            </p>
            <ul className="list-disc pl-6 space-y-4 text-muted leading-relaxed">
              <li><strong>AI Assistance:</strong> We utilize Large Language Models to help brainstorm topics, generate outlines, and draft initial content blocks. We also use AI for creating article illustrations and diagrams.</li>
              <li><strong>Human Editorial Review:</strong> No article is published without rigorous human review. Our founding engineering team and product managers fact-check all technical claims, rewrite sections for clarity and accuracy, and ensure the content aligns with our mission.</li>
              <li><strong>Who Reviews:</strong> All content is reviewed by our lead developers who actively write the software powering MeetMind AI. If an article discusses a technical concept like "Faster Whisper" or "Row-Level Security," it is vetted by the engineer who implemented it.</li>
            </ul>
          </div>

        </motion.div>
      </div>
    </main>
  );
}
