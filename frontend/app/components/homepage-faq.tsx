"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, ChevronDown } from "lucide-react";

export const HOMEPAGE_FAQS = [
  {
    question: "What file formats does MeetMind AI support?",
    answer:
      "MeetMind AI supports MP3, WAV, M4A, MP4, WEBM, MOV, and AVI audio and video files up to 100MB per upload.",
  },
  {
    question: "How does MeetMind AI process meeting audio?",
    answer:
      "MeetMind AI uses Whisper models for speech-to-text transcription and high-capacity language models to generate executive summaries, key decisions, and action items.",
  },
  {
    question: "Is there a meeting bot joining my call?",
    answer:
      "No. MeetMind AI requires no bot integration. Simply record your meeting locally or via your preferred platform, then upload the file when ready.",
  },
  {
    question: "Is my meeting data used to train AI models?",
    answer:
      "No. We process your audio recordings securely and never use your private meeting transcripts or summaries to train public AI models.",
  },
];

export default function HomepageFaq() {
  // Open first item by default for immediate context, others collapsible
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2, 3]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="relative my-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/30 px-3.5 py-1 text-xs font-medium text-muted mb-4 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-accent-purple" />
          <span>Common Questions</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
          Quick answers to how MeetMind AI works, data privacy, and supported formats.
        </p>
      </div>

      <div className="space-y-4">
        {HOMEPAGE_FAQS.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-card-border bg-surface/50 overflow-hidden transition-all duration-200 hover:border-card-border/80"
            >
              <button
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple"
              >
                <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-3">
                  <span className="text-accent-purple font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-accent-purple/10">
                    0{idx + 1}.
                  </span>
                  <span>{faq.question}</span>
                </h3>
                <div
                  className={`p-1.5 rounded-full bg-surface border border-card-border text-muted transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-foreground bg-surface/80" : ""
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm text-muted leading-relaxed pl-6 sm:pl-16 animate-fade-in-up">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-purple hover:text-accent-blue transition-colors"
        >
          <span>View all Frequently Asked Questions</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
