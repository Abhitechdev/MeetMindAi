"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, FileText, CheckSquare, Layers, Clock } from "lucide-react";

export default function UIPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "decisions" | "actions" | "chat">("summary");

  return (
    <div className="rounded-2xl border border-card-border bg-surface/60 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Chrome Window Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-card-border px-4 py-3 bg-muted/5 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-muted/70 ml-2">MeetMind AI — Production Meeting Dashboard</span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          Example meeting — sample data.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-card-border bg-background/50 px-3 pt-2 gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-t-2 ${
            activeTab === "summary"
              ? "border-accent text-foreground bg-surface/80"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab("decisions")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-t-2 ${
            activeTab === "decisions"
              ? "border-accent text-foreground bg-surface/80"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Decisions (3)
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-t-2 ${
            activeTab === "actions"
              ? "border-accent text-foreground bg-surface/80"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Action Items (3)
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-t-2 ${
            activeTab === "transcript"
              ? "border-accent text-foreground bg-surface/80"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Transcript
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-t-2 ${
            activeTab === "chat"
              ? "border-accent text-foreground bg-surface/80"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Meeting Chat
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {/* Metric Cards Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-surface border border-card-border">
            <span className="text-[11px] text-muted block mb-1">Duration</span>
            <span className="text-base font-bold text-foreground">12m 45s</span>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-card-border">
            <span className="text-[11px] text-muted block mb-1">Total Words</span>
            <span className="text-base font-bold text-foreground">1,842</span>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-card-border">
            <span className="text-[11px] text-muted block mb-1">Action Items</span>
            <span className="text-base font-bold text-emerald-400">3 tasks</span>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-card-border">
            <span className="text-[11px] text-muted block mb-1">Language</span>
            <span className="text-base font-bold text-foreground">English</span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === "summary" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-surface border border-card-border">
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Executive Summary</h4>
              <p className="text-sm text-foreground/90 leading-relaxed">
                The engineering team aligned on the GPU-accelerated Whisper transcription pipeline, establishing a 100MB file ceiling for MP3, WAV, M4A, MP4, WEBM, MOV, and AVI formats. Meeting outputs standardize on client-side Markdown and text exports with strict Supabase row-level security.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface/50 border border-card-border">
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Meeting Tags</h4>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-md bg-muted/10 text-xs text-foreground">#Engineering</span>
                <span className="px-2.5 py-1 rounded-md bg-muted/10 text-xs text-foreground">#Architecture</span>
                <span className="px-2.5 py-1 rounded-md bg-muted/10 text-xs text-foreground">#Whisper</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "decisions" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {[
              "Cap client-side audio/video uploads at 100MB to preserve memory headroom on compute nodes.",
              "Enable direct export in both Markdown (.md) and plain text (.txt) without external API dependencies.",
              "Enforce row-level security on all database queries so audio metadata is strictly isolated by authenticated user ID."
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-card-border">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "actions" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {[
              { task: "Sarah to profile GPU memory consumption during peak audio ingestion batches.", owner: "Sarah" },
              { task: "Abhishek to update Help Center documentation with supported codecs and audio compression benchmarks.", owner: "Abhishek" },
              { task: "DevOps to verify RLS policy coverage across production Supabase tables.", owner: "DevOps" }
            ].map((a, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-surface border border-card-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{a.task}</p>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted/10 text-muted shrink-0 border border-card-border">
                  {a.owner}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transcript" && (
          <div className="space-y-2 font-mono text-xs animate-in fade-in duration-200">
            <div className="p-3 rounded-lg bg-surface/50 border border-card-border">
              <span className="text-accent font-semibold">[00:00:05] Abhishek:</span>
              <span className="text-muted ml-2">Welcome team to our sprint planning session. Today we need to align on our Whisper transcription pipeline and file size constraints.</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/50 border border-card-border">
              <span className="text-accent font-semibold">[00:00:18] Sarah:</span>
              <span className="text-muted ml-2">The GPU transcription worker achieves sub-minute transcription for typical hour-long files. I recommend keeping client uploads capped at 100MB to avoid memory overhead.</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/50 border border-card-border">
              <span className="text-accent font-semibold">[00:00:32] Abhishek:</span>
              <span className="text-muted ml-2">Agreed on the 100MB limit. What formats are enabled right now?</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/50 border border-card-border">
              <span className="text-accent font-semibold">[00:00:41] Sarah:</span>
              <span className="text-muted ml-2">MP3, WAV, M4A, MP4, WEBM, MOV, and AVI are all tested and supported.</span>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="space-y-3 text-xs animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-surface border border-card-border">
              <p className="font-semibold text-foreground mb-1">User Question:</p>
              <p className="text-muted">What is the upload size limit and what formats are supported?</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="font-semibold text-purple-300 mb-1">MeetMind AI Chat:</p>
              <p className="text-muted leading-relaxed">
                According to the discussion at [00:00:41], the upload ceiling is 100MB, supporting MP3, WAV, M4A, MP4, WEBM, MOV, and AVI formats.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
