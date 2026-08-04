"use client";

import { useState } from "react";

const DEMO_DATA = {
  transcript: `[00:00:05] Abhishek: Welcome team to our Q3 product sync. Today we need to align on the Whisper transcription pipeline and API rate limit safeguards.
[00:00:18] Sarah: I've benchmarked the Whisper processing speed on GPU workers. Transcribing a 30-minute meeting now takes less than 45 seconds.
[00:00:32] Abhishek: That's a huge speedup. What about user file size constraints?
[00:00:41] Sarah: We capped client audio uploads at 100MB to prevent memory overhead on free tier instances. Supported formats are MP3, WAV, M4A, MP4, WEBM, MOV, and AVI.
[00:00:58] Abhishek: Perfect. Let's make sure the executive summary highlights key decisions and action items cleanly. Meeting adjourned.`,
  executiveSummary: "The team reviewed Q3 product benchmarks for the Whisper transcription pipeline. Performance optimization reduced 30-minute audio processing time to under 45 seconds on GPU workers. Upload safeguards were confirmed with a 100MB file limit supporting major audio/video formats.",
  keyDecisions: [
    "GPU worker optimizations finalized, reducing 30-minute transcription times to under 45 seconds.",
    "File upload limit capped at 100MB for optimal server stability.",
    "Supported formats expanded to include MP3, WAV, M4A, MP4, WEBM, MOV, and AVI."
  ],
  actionItems: [
    "Sarah to monitor GPU memory utilization during peak traffic hours.",
    "Abhishek to publish updated format guidelines in the Help Center.",
    "DevOps team to enforce row-level security policies on Supabase audio storage."
  ],
  nextSteps: [
    "1. Deploy updated Whisper processing worker image to production cluster.",
    "2. Run automated validation checks on multi-language transcript accuracy.",
    "3. Monitor free-tier meeting credit usage spikes."
  ],
  chatSample: [
    { q: "What is the maximum file size supported?", a: "The upload limit is 100MB per file, supporting MP3, WAV, M4A, MP4, WEBM, MOV, and AVI formats." },
    { q: "How long does a 30-minute recording take to process?", a: "With GPU worker optimization, a 30-minute recording is processed in under 45 seconds." }
  ]
};

export default function InteractiveSampleViewer() {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "decisions" | "actions" | "chat">("summary");

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

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "summary" ? "bg-purple-500 text-white shadow-sm" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            📝 Executive Summary
          </button>
          <button
            onClick={() => setActiveTab("decisions")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "decisions" ? "bg-amber-500 text-white shadow-sm" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            ⚡ Key Decisions ({DEMO_DATA.keyDecisions.length})
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "actions" ? "bg-emerald-500 text-white shadow-sm" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            ✅ Action Items ({DEMO_DATA.actionItems.length})
          </button>
          <button
            onClick={() => setActiveTab("transcript")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "transcript" ? "bg-blue-500 text-white shadow-sm" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            🎙️ Verbatim Transcript
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "chat" ? "bg-indigo-500 text-white shadow-sm" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            🧠 AI Assistant Chat
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="rounded-xl bg-surface/50 border border-card-border p-6 min-h-[220px]">
          {activeTab === "summary" && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">AI Executive Summary</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{DEMO_DATA.executiveSummary}</p>
              <div className="pt-3 border-t border-card-border text-xs text-muted">
                <strong>Next Steps:</strong> {DEMO_DATA.nextSteps.join(" · ")}
              </div>
            </div>
          )}

          {activeTab === "decisions" && (
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Key Decisions Recorded</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {DEMO_DATA.keyDecisions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Extracted Action Items</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {DEMO_DATA.actionItems.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Whisper Speech-to-Text Output</h3>
              <pre className="text-xs text-muted whitespace-pre-wrap font-mono leading-relaxed bg-background/50 p-4 rounded-lg border border-card-border">
                {DEMO_DATA.transcript}
              </pre>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Context-Aware AI Chat Q&A</h3>
              <div className="space-y-3 text-xs">
                {DEMO_DATA.chatSample.map((c, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="font-semibold text-foreground">User: {c.q}</p>
                    <p className="text-muted bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                      <strong>MeetMind AI:</strong> {c.a}
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
