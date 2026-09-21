"use client";

import { useState } from "react";

const DEMO_DATA = {
  transcript: `[00:00:05] Abhishek: Welcome team to our Q3 product sync. Today we need to align on the Whisper transcription pipeline and API rate limit safeguards.
[00:00:18] Sarah: I've verified the Whisper processing pipeline on GPU workers. Processing time depends on audio duration, network conditions, and the selected transcription mode.
[00:00:32] Abhishek: That's a huge speedup. What about user file size constraints?
[00:00:41] Sarah: We capped client audio uploads at 100MB to prevent memory overhead on free tier instances. Supported formats are MP3, WAV, M4A, MP4, WEBM, MOV, and AVI.
[00:00:58] Abhishek: Perfect. Let's make sure the executive summary highlights key decisions and action items cleanly. Meeting adjourned.`,
  executiveSummary: "The team reviewed Q3 product benchmarks for the Whisper transcription pipeline. Processing time depends on audio duration, network conditions, and the selected transcription mode. Upload safeguards were confirmed with a 100MB file limit supporting major audio/video formats.",
  keyDecisions: [
    "GPU worker optimizations finalized for the transcription pipeline.",
    "File upload limit capped at 100MB for optimal server stability.",
    "Supported formats expanded to include MP3, WAV, M4A, MP4, WEBM, MOV, and AVI."
  ],
  actionItems: [
    "Sarah to monitor GPU memory utilization during peak traffic hours.",
    "Abhishek to publish updated format guidelines in the Help Center.",
    "DevOps team to enforce row-level security policies on Supabase audio storage."
  ],
  nextSteps: [
    "Deploy updated Whisper processing worker image to production cluster.",
    "Run automated validation checks on multi-language transcript accuracy.",
    "Monitor free-tier meeting credit usage spikes."
  ],
  chatSample: [
    { q: "What is the maximum file size supported?", a: "The upload limit is 100MB per file, supporting MP3, WAV, M4A, MP4, WEBM, MOV, and AVI formats." },
    { q: "How long does a 30-minute recording take to process?", a: "With GPU worker optimization, a 30-minute recording is processed in under 45 seconds." }
  ]
};

interface TabItem {
  id: "summary" | "decisions" | "actions" | "transcript" | "chat";
  label: string;
  icon: string;
  count?: number;
  activeColor: string;
}

const TABS: TabItem[] = [
  { id: "summary", label: "Executive Summary", icon: "📝", activeColor: "bg-purple-500" },
  { id: "decisions", label: "Key Decisions", icon: "⚡", count: DEMO_DATA.keyDecisions.length, activeColor: "bg-amber-500" },
  { id: "actions", label: "Action Items", icon: "✅", count: DEMO_DATA.actionItems.length, activeColor: "bg-emerald-500" },
  { id: "transcript", label: "Verbatim Transcript", icon: "🎙️", activeColor: "bg-blue-500" },
  { id: "chat", label: "AI Assistant Chat", icon: "🧠", activeColor: "bg-indigo-500" },
];

type TabId = TabItem["id"];

export default function InteractiveSampleViewer() {
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  return (
    <section className="my-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-6 md:p-8 border-purple-500/20">
        {/* Header Title + Demo Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-card-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Interactive Sample Output Viewer</h2>
            <p className="text-sm text-muted mt-1">Explore actual AI output structure generated from meeting recordings.</p>
          </div>
          <div className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            Demo Example Output (Illustrative)
          </div>
        </div>

        {/* Tab Selection — Sleek scrollable or single-row flex to prevent orphaned buttons */}
        <div className="relative mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-5 sm:pb-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 sm:shrink px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? `${tab.activeColor} text-white shadow-sm ring-1 ring-white/20`
                      : "bg-surface/80 text-muted hover:text-foreground hover:bg-surface border border-card-border"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-card-border text-muted"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="rounded-xl bg-surface/50 border border-card-border p-6 min-h-[220px]">
          {activeTab === "summary" && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-purple-400 tracking-wide">AI Executive Summary</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{DEMO_DATA.executiveSummary}</p>
              
              {/* Structured Vertical Next Steps List */}
              <div className="pt-4 border-t border-card-border">
                <h4 className="text-xs font-semibold text-foreground/90 mb-2.5">Next Steps</h4>
                <ul className="space-y-2">
                  {DEMO_DATA.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-muted">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[10px] font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "decisions" && (
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-amber-400 tracking-wide">Key Decisions Recorded</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {DEMO_DATA.keyDecisions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-emerald-400 tracking-wide">Extracted Action Items</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {DEMO_DATA.actionItems.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-blue-400 tracking-wide">Whisper Speech-to-Text Output</h3>
              <pre className="text-xs text-muted whitespace-pre-wrap font-mono leading-relaxed bg-background/50 p-4 rounded-lg border border-card-border">
                {DEMO_DATA.transcript}
              </pre>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-indigo-400 tracking-wide">Context-Aware AI Chat Q&A</h3>
              <div className="space-y-3 text-xs">
                {DEMO_DATA.chatSample.map((c, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="font-semibold text-foreground">User: {c.q}</p>
                    <p className="text-muted bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 leading-relaxed">
                      <strong className="text-indigo-300">MeetMind AI:</strong> {c.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
