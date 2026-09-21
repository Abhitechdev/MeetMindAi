import React from "react";

const BENTO_ITEMS = [
  {
    title: "Speech To Text",
    desc: "Lightning fast transcription powered by Whisper models.",
    icon: "🎙️",
    className: "col-span-1",
  },
  {
    title: "AI Summary",
    desc: "Executive overviews and structured notes in seconds.",
    icon: "📝",
    className: "col-span-1",
  },
  {
    title: "Action Items",
    desc: "Automatically extract followup tasks and owners.",
    icon: "✅",
    className: "col-span-1",
  },
  {
    title: "Key Decisions",
    desc: "Track critical choices made throughout the meeting.",
    icon: "⚡",
    className: "col-span-1",
  },
  {
    title: "AI Meeting Assistant",
    desc: "Ask contextual questions and receive grounded citations directly from your transcripts.",
    icon: "🧠",
    className: "col-span-1 sm:col-span-2",
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
              className={`group relative glass-card glass-card-hover p-6 sm:p-8 overflow-hidden animate-fade-in-up ${item.className}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Dynamic hover backgrounds */}
              {isAi ? (
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-accent-blue/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              )}

              {isAi ? (
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-md">
                    {/* Consistent icon box baseline */}
                    <div
                      className="text-3xl mb-4 bg-surface w-12 h-12 flex items-center justify-center rounded-xl border border-card-border shadow-sm shrink-0"
                      style={{ animation: `icon-float 4s ease-in-out ${i * 0.3}s infinite` }}
                      role="img"
                      aria-label={item.title}
                    >
                      {item.icon}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">{item.title}</h2>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Balanced visual element on the right to eliminate empty dead space */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 md:min-w-[220px]">
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 border border-card-border text-xs text-foreground/80 shadow-xs">
                      <span className="text-accent-purple">💬</span>
                      <span className="font-mono text-[11px]">&quot;Summarize core risks&quot;</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 border border-card-border text-xs text-foreground/80 shadow-xs">
                      <span className="text-accent-blue">⚡</span>
                      <span>Sub-second semantic lookup</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 border border-card-border text-xs text-foreground/80 shadow-xs">
                      <span className="text-emerald-400">🔒</span>
                      <span>Zero model training retention</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Consistent icon box baseline */}
                    <div
                      className="text-3xl mb-4 bg-surface w-12 h-12 flex items-center justify-center rounded-xl border border-card-border shadow-sm"
                      style={{ animation: `icon-float 4s ease-in-out ${i * 0.3}s infinite` }}
                      role="img"
                      aria-label={item.title}
                    >
                      {item.icon}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">{item.title}</h2>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default BentoFeatures;
