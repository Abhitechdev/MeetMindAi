import React from "react";

const BENTO_ITEMS = [
  {
    title: "Speech To Text",
    desc: "Lightning fast transcription using Whisper.",
    icon: "🎙️",
    className: "col-span-1 row-span-1",
  },
  {
    title: "AI Summary",
    desc: "Executive overviews in seconds.",
    icon: "📝",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Action Items",
    desc: "Never miss a followup task.",
    icon: "✅",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Key Decisions",
    desc: "Track critical choices made.",
    icon: "⚡",
    className: "col-span-1 row-span-1",
  },
  {
    title: "AI Meeting Assistant",
    desc: "Ask questions and get instant answers based purely on meeting context.",
    icon: "🧠",
    className: "col-span-1 sm:col-span-2 row-span-1",
    isAiAssistant: true,
  },
];

const BentoFeatures = React.memo(function BentoFeatures() {
  return (
    <section id="features" className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {BENTO_ITEMS.map((item, i) => {
          const isAi = item.isAiAssistant;
          
          return (
            <div
              key={item.title}
              className={`group relative glass-card glass-card-hover p-8 flex flex-col justify-between overflow-hidden animate-fade-in-up ${item.className}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Dynamic hover backgrounds */}
              {isAi ? (
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              )}

              <div className="relative z-10">
                {/* ponytail: CSS icon-float instead of framer-motion JS loop — compositor thread */}
                <div 
                  className="text-3xl mb-4 bg-surface w-12 h-12 flex items-center justify-center rounded-xl border border-card-border shadow-sm"
                  style={{ animation: `icon-float 4s ease-in-out ${i * 0.3}s infinite` }}
                  role="img"
                  aria-label={item.title}
                >
                  {item.icon}
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">{item.title}</h2>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default BentoFeatures;
