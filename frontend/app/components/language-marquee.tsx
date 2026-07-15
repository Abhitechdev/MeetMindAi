// ponytail: no "use client", no framer-motion — CSS marquee runs on compositor thread, zero INP
import React from "react";

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Italian",
  "Dutch", "Japanese", "Korean", "Chinese", "Hindi", "Telugu",
  "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati",
  "Punjabi", "Urdu", "Arabic", "Russian", "Turkish", "Polish"
];

const MARQUEE_ITEMS = [...LANGUAGES, ...LANGUAGES];

const LanguageMarquee = React.memo(function LanguageMarquee() {
  return (
    <div className="w-full overflow-hidden py-10 relative">
      <div className="text-center mb-8 relative z-20">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Supports 99+ Languages</h2>
        <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
          Transcribe and summarize meetings in 99+ languages with automatic language detection.
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        <div className="flex overflow-hidden">
          <div
            className="flex gap-4 whitespace-nowrap"
            style={{ animation: "marquee 35s linear infinite" }}
          >
            {MARQUEE_ITEMS.map((lang, idx) => (
              <div
                key={idx}
                className="glass-card px-5 py-2.5 rounded-full flex items-center justify-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border border-white/5"
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default LanguageMarquee;
