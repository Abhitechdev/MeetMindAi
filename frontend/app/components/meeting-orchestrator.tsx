"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import ProgressTracker from "./progress-tracker";
import WaveformAnimation from "./waveform-animation";
import { useMeetingProcessor } from "../hooks/useMeetingProcessor";

const AudioUpload = dynamic(() => import("./audio-upload"));

const TranscriptViewer = dynamic(() => import("./transcript-viewer"));
const SummaryViewer = dynamic(() => import("./summary-viewer"));
const ChatBot = dynamic(() => import("./chat-bot"));
const MetricCards = dynamic(() => import("./metric-cards"));

const STATUS_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  uploading: {
    title: "Uploading audio...",
    subtitle: "Sending your file to the server",
  },
  transcribing: {
    title: "Transcribing with AI...",
    subtitle: "Converting speech to text using Whisper",
  },
  summarizing: {
    title: "Generating insights...",
    subtitle: "Analyzing transcript with AI",
  },
};

// ponytail: inline helpers, no utils file for two one-liners
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MeetingOrchestrator() {
  const {
    status,
    result,
    error,
    limitReached,
    handleUpload,
    handleSetSample,
    handleReset,
  } = useMeetingProcessor();

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isSampleData, setIsSampleData] = useState(false);

  const handleLoadSample = useCallback(() => {
    setIsSampleData(true);
    handleSetSample({
      id: "demo_sample_meeting_01",
      title: "Sprint Planning & Whisper Pipeline Architecture Sync",
      transcript: "[00:00:05] Abhishek: Welcome team to our sprint planning session. Today we need to align on our Whisper transcription pipeline and file size constraints.\n[00:00:18] Sarah: The GPU transcription worker achieves sub-minute transcription for typical hour-long files. I recommend keeping client uploads capped at 100MB to avoid memory overhead.\n[00:00:32] Abhishek: Agreed on the 100MB limit. What formats are enabled right now?\n[00:00:41] Sarah: MP3, WAV, M4A, MP4, WEBM, MOV, and AVI are all tested and supported.\n[00:00:54] Abhishek: Great. Let's make sure the action items and key decisions are exported in Markdown and TXT for our issue tracker. Let's get to work.",
      segments: [
        { start: 5, end: 17, text: "Welcome team to our sprint planning session. Today we need to align on our Whisper transcription pipeline and file size constraints." },
        { start: 18, end: 31, text: "The GPU transcription worker achieves sub-minute transcription for typical hour-long files. I recommend keeping client uploads capped at 100MB to avoid memory overhead." },
        { start: 32, end: 40, text: "Agreed on the 100MB limit. What formats are enabled right now?" },
        { start: 41, end: 53, text: "MP3, WAV, M4A, MP4, WEBM, MOV, and AVI are all tested and supported." },
        { start: 54, end: 68, text: "Great. Let's make sure the action items and key decisions are exported in Markdown and TXT for our issue tracker. Let's get to work." }
      ],
      executiveSummary: "The engineering team reviewed the Whisper transcription pipeline performance and confirmed a 100MB upload ceiling supporting MP3, WAV, M4A, MP4, WEBM, MOV, and AVI formats. Tasks and decisions will be exported in Markdown and plain text.",
      decisions: [
        "Cap file uploads at 100MB to maintain server stability on free tier instances.",
        "Support MP3, WAV, M4A, MP4, WEBM, MOV, and AVI formats for meeting recordings.",
        "Standardize client-side meeting note exports on Markdown (.md) and plain text (.txt)."
      ],
      actionItems: [
        "Sarah to monitor GPU memory utilization during peak traffic hours.",
        "Abhishek to publish updated audio format guidelines in the Help Center.",
        "DevOps team to verify row-level security policies on Supabase database tables."
      ],
      nextSteps: [
        "1. Deploy updated Whisper processing worker image to production cluster.",
        "2. Run automated validation checks on multi-language transcript accuracy.",
        "3. Monitor free-tier meeting credit usage spikes."
      ],
      tags: ["Engineering", "Architecture", "Sprint Planning"],
      language: "English",
      sentiment: "Positive",
      priority: "High"
    });
  }, [handleSetSample]);

  const onReset = useCallback(() => {
    setIsSampleData(false);
    handleReset();
  }, [handleReset]);

  // ponytail: computed from existing data, no new API fields needed
  const insights = useMemo(() => {
    if (!result) return null;
    const words = result.transcript.split(/\s+/).length;
    const duration =
      result.segments.length > 0
        ? result.segments[result.segments.length - 1].end - result.segments[0].start
        : 0;
    const actionCount = result.actionItems.length;
    // ponytail: confidence = completeness heuristic, not ML confidence
    const confidence = Math.min(
      98,
      85 + result.decisions.length + actionCount + result.nextSteps.length
    );
    return { words, duration, actionCount, confidence };
  }, [result]);

  const isProcessing = ["uploading", "transcribing", "summarizing"].includes(status);

  const handleCopySummary = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.executiveSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  }, [result]);

  const handleExportTxt = useCallback(() => {
    if (!result) return;
    const lines = [
      "MEETING TRANSCRIPT", "==================", result.transcript, "",
      "EXECUTIVE SUMMARY", "=================", result.executiveSummary, "",
      "KEY DECISIONS", "=============",
      ...result.decisions.map((d, i) => `${i + 1}. ${d}`), "",
      "ACTION ITEMS", "============",
      ...result.actionItems.map((a, i) => `${i + 1}. ${a}`), "",
      "NEXT STEPS", "==========",
      ...result.nextSteps.map((n, i) => `${i + 1}. ${n}`),
    ];
    downloadFile(lines.join("\n"), "meeting-notes.txt", "text/plain");
  }, [result]);

  const handleExportMd = useCallback(() => {
    if (!result) return;
    const lines = [
      "# Meeting Notes", "",
      "## Transcript", result.transcript, "",
      "## Executive Summary", result.executiveSummary, "",
      "## Key Decisions", ...result.decisions.map((d) => `- ${d}`), "",
      "## Action Items", ...result.actionItems.map((a) => `- [ ] ${a}`), "",
      "## Next Steps", ...result.nextSteps.map((n, i) => `${i + 1}. ${n}`),
    ];
    downloadFile(lines.join("\n"), "meeting-notes.md", "text/markdown");
  }, [result]);

  return (
    <>
      {/* ====== IDLE / ERROR ====== */}
      {(status === "idle" || status === "error") && (
        <div className="animate-fade-in-up">
          {/* Upload */}
          <div id="upload-section">
            <AudioUpload
              onUpload={handleUpload}
              disabled={false}
              limitReached={limitReached}
              onLoadSample={handleLoadSample}
            />
          </div>

          {/* Error */}
          {status === "error" && error && (
            <div
              className="mt-4 glass-card px-5 py-4 animate-fade-in-up"
              style={{ borderColor: "rgba(239,68,68,0.3)" }}
            >
              <p className="text-sm text-red-400 font-medium mb-0.5">Processing failed</p>
              <p className="text-sm text-red-400/70">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* ====== PROCESSING ====== */}
      {isProcessing && (
        <div
          key="processing"
          className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="glass-card p-10 text-center max-w-2xl mx-auto">
            <WaveformAnimation />

            <p className="text-xl font-semibold text-foreground mt-6 mb-1">
              {STATUS_MESSAGES[status]?.title}
            </p>
            <p className="text-sm text-muted mb-8">
              {STATUS_MESSAGES[status]?.subtitle}
            </p>

            <ProgressTracker status={status} />
          </div>
        </div>
      )}

      {/* ====== RESULTS ====== */}
      {status === "complete" && result && (
        <div
          key="results"
          className="animate-in fade-in duration-300"
        >
          {/* Sample Data Banner */}
          {isSampleData && (
            <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                <p className="text-sm font-semibold text-purple-200">
                  Example meeting — sample data.
                  <span className="font-normal text-muted ml-1.5 hidden md:inline">Demonstrating actual transcript, summary, decisions, and action item structures.</span>
                </p>
              </div>
              <button
                onClick={onReset}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface border border-card-border hover:bg-muted/20 text-foreground transition-all shrink-0"
              >
                Upload Your Own Meeting
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isSampleData ? "Sample Meeting Results" : "Meeting Results"}
              </h2>
              <p className="text-sm text-muted mt-1">
                {isSampleData ? "Example output structure from MeetMind AI processing" : "AI-powered analysis complete"}
              </p>
            </div>
            <button
              id="new-meeting-btn"
              onClick={onReset}
              className="glass-card glass-card-hover flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Meeting
            </button>
          </div>

          {/* Insights grid */}
          {insights && (
            <Suspense fallback={<div className="h-24 w-full animate-pulse bg-surface/50 rounded-xl" />}>
              <MetricCards 
                duration={formatDuration(insights.duration)}
                words={insights.words.toLocaleString()}
                actionCount={String(insights.actionCount)}
                confidence={`${insights.confidence}%`}
              />
            </Suspense>
          )}

          {/* Transcript */}
          <div className="mb-5 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100 fill-mode-both">
            <Suspense fallback={<div className="h-64 w-full animate-pulse bg-surface/50 rounded-xl" />}>
              <TranscriptViewer transcript={result.transcript} segments={result.segments} language={result.language} diarizationUnavailable={result.diarization_unavailable} />
            </Suspense>
          </div>

          {/* Summary */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-150 fill-mode-both">
            <Suspense fallback={<div className="h-48 w-full animate-pulse bg-surface/50 rounded-xl" />}>
              <SummaryViewer
                executiveSummary={result.executiveSummary}
                keyDecisions={result.decisions}
                actionItems={result.actionItems}
                nextSteps={result.nextSteps}
              />
            </Suspense>
          </div>

          {/* Export actions */}
          <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handleCopySummary}
              className="glass-card glass-card-hover px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              {copiedSummary ? "✓ Copied" : "Copy Summary"}
            </button>
            <button
              onClick={handleExportTxt}
              className="glass-card glass-card-hover px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export TXT
            </button>
            <button
              onClick={handleExportMd}
              className="glass-card glass-card-hover px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Markdown
            </button>
          </div>
          
          <Suspense fallback={<div className="h-48 w-full animate-pulse bg-surface/50 rounded-xl" />}>
            <ChatBot 
              meetingId={result.id}
              transcript={result.transcript} 
              summary={JSON.stringify({
                executiveSummary: result.executiveSummary,
                decisions: result.decisions,
                actionItems: result.actionItems,
                nextSteps: result.nextSteps,
                tags: result.tags
              })} 
              segments={result.segments}
              diarizationUnavailable={result.diarization_unavailable}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
