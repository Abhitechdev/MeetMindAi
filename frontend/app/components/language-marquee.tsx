// ponytail: no "use client", no framer-motion — CSS marquee runs on compositor thread, zero INP
import React from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Italian",
  "Dutch", "Japanese", "Korean", "Chinese", "Hindi", "Telugu",
  "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati",
  "Punjabi", "Urdu", "Arabic", "Russian", "Turkish", "Polish"
];

const MARQUEE_ITEMS = [...LANGUAGES, ...LANGUAGES];

const LanguageMarquee = React.memo(function LanguageMarquee() {
  return (
    <section className="w-full my-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-card-border">
        {/* Centered Heading with structured badge */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/40 px-3.5 py-1 text-xs font-medium text-muted mb-3 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-accent-blue" />
            <span>40+ Languages Supported</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Multilingual Speech & Summaries</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Transcribe and summarize global meetings with automated language detection and translation fidelity.
          </p>
        </div>

        {/* Structured marquee track with prominent fade edge visual affordances */}
        <div className="relative overflow-hidden py-3 rounded-xl bg-surface/30 border border-card-border/50">
          {/* Left and Right linear gradient scroll signifiers */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-surface via-surface/80 to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <div
              className="flex gap-3 whitespace-nowrap"
              style={{ animation: "marquee 35s linear infinite" }}
            >
              {MARQUEE_ITEMS.map((lang, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-full bg-surface/80 border border-card-border flex items-center justify-center text-xs font-medium text-foreground/80 hover:text-foreground hover:border-accent-purple/40 transition-colors shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/60 mr-2 shrink-0" />
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default LanguageMarquee;
