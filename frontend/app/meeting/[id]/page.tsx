"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { getMeeting } from "@/lib/api";
import type { ProcessingResponse } from "@/lib/types";
import GradientBackground from "@/app/components/gradient-background";

const MetricCards = dynamic(() => import("@/app/components/metric-cards"));
const SummaryViewer = dynamic(() => import("@/app/components/summary-viewer"));
const TranscriptViewer = dynamic(() => import("@/app/components/transcript-viewer"));
const ChatBot = dynamic(() => import("@/app/components/chat-bot"));

const FLAG_MAP: Record<string, string> = {
  English: "🇺🇸", Telugu: "🇮🇳", Hindi: "🇮🇳", Tamil: "🇮🇳", Kannada: "🇮🇳",
  Malayalam: "🇮🇳", Marathi: "🇮🇳", Bengali: "🇮🇳", Gujarati: "🇮🇳", Punjabi: "🇮🇳", Urdu: "🇮🇳",
  Spanish: "🇪🇸", French: "🇫🇷", German: "🇩🇪", Portuguese: "🇵🇹", Italian: "🇮🇹", Dutch: "🇳🇱",
  Japanese: "🇯🇵", Korean: "🇰🇷", Chinese: "🇨🇳",
};

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

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [meeting, setMeeting] = useState<ProcessingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchMeeting() {
      try {
        const data = await getMeeting(id);
        setMeeting(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load meeting details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMeeting();
    }
  }, [id]);

  const insights = useMemo(() => {
    if (!meeting) return null;
    const words = meeting.transcript ? meeting.transcript.split(/\s+/).length : 0;
    const duration =
      meeting.segments && meeting.segments.length > 0
        ? meeting.segments[meeting.segments.length - 1].end - meeting.segments[0].start
        : 0;
    const actionCount = meeting.actionItems?.length || 0;
    const confidence = Math.min(
      98,
      85 + (meeting.decisions?.length || 0) + actionCount + (meeting.nextSteps?.length || 0)
    );
    return { words, duration, actionCount, confidence };
  }, [meeting]);

  const handleCopySummary = useCallback(async () => {
    if (!meeting) return;
    await navigator.clipboard.writeText(meeting.executiveSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  }, [meeting]);

  const handleExportTxt = useCallback(() => {
    if (!meeting) return;
    const lines = [
      "MEETING TRANSCRIPT", "==================", meeting.transcript, "",
      "EXECUTIVE SUMMARY", "=================", meeting.executiveSummary, "",
      "KEY DECISIONS", "=============",
      ...(meeting.decisions || []).map((d, i) => `${i + 1}. ${d}`), "",
      "ACTION ITEMS", "============",
      ...(meeting.actionItems || []).map((a, i) => `${i + 1}. ${a}`), "",
      "NEXT STEPS", "==========",
      ...(meeting.nextSteps || []).map((n, i) => `${i + 1}. ${n}`),
    ];
    downloadFile(lines.join("\n"), `${(meeting.title || "meeting").replace(/[^a-z0-9]/gi, "_")}.txt`, "text/plain");
  }, [meeting]);

  const handleExportMd = useCallback(() => {
    if (!meeting) return;
    const lines = [
      `# ${meeting.title || "Meeting Notes"}`, "",
      "## Transcript", meeting.transcript, "",
      "## Executive Summary", meeting.executiveSummary, "",
      "## Key Decisions", ...(meeting.decisions || []).map((d) => `- ${d}`), "",
      "## Action Items", ...(meeting.actionItems || []).map((a) => `- [ ] ${a}`), "",
      "## Next Steps", ...(meeting.nextSteps || []).map((n, i) => `${i + 1}. ${n}`),
    ];
    downloadFile(lines.join("\n"), `${(meeting.title || "meeting").replace(/[^a-z0-9]/gi, "_")}.md`, "text/markdown");
  }, [meeting]);

  return (
    <main className="relative min-h-screen pb-24">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to History
          </Link>

          <Link
            href="/meeting/new"
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-card-border bg-surface text-foreground hover:bg-muted/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Meeting
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-28 text-center">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-foreground mb-4" />
            <p className="text-sm font-medium text-muted">Loading meeting details...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-card p-10 text-center max-w-xl mx-auto border-red-500/20">
            <h2 className="text-lg font-bold text-red-400 mb-2">Unable to Load Meeting</h2>
            <p className="text-sm text-muted mb-6">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                getMeeting(id).then(setMeeting).catch(e => setError(e.message)).finally(() => setLoading(false));
              }}
              className="px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Meeting Content */}
        {!loading && meeting && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Meeting Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-card-border pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface text-foreground text-xs font-medium border border-card-border">
                    {FLAG_MAP[meeting.language || "English"] || "🌐"} {meeting.language || "English"}
                  </span>
                  {meeting.sentiment && (
                    <span className="px-2.5 py-0.5 rounded-full bg-surface text-muted text-xs font-medium border border-card-border">
                      {meeting.sentiment}
                    </span>
                  )}
                  {meeting.priority && (
                    <span className="px-2.5 py-0.5 rounded-full bg-surface text-muted text-xs font-medium border border-card-border">
                      {meeting.priority} Priority
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {meeting.title || "Untitled Meeting"}
                </h1>
                {meeting.tags && meeting.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {meeting.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-surface text-[11px] font-medium text-muted border border-card-border">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-muted/10 text-foreground border border-card-border transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  {copiedSummary ? "Copied" : "Copy Summary"}
                </button>
                <button
                  onClick={handleExportTxt}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-muted/10 text-foreground border border-card-border transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  TXT
                </button>
                <button
                  onClick={handleExportMd}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-muted/10 text-foreground border border-card-border transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Markdown
                </button>
              </div>
            </div>

            {/* Metric Cards */}
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

            {/* Summary Section */}
            <div className="space-y-6">
              <Suspense fallback={<div className="h-48 w-full animate-pulse bg-surface/50 rounded-xl" />}>
                <SummaryViewer
                  executiveSummary={meeting.executiveSummary}
                  keyDecisions={meeting.decisions || []}
                  actionItems={meeting.actionItems || []}
                  nextSteps={meeting.nextSteps || []}
                />
              </Suspense>
            </div>

            {/* Transcript Section */}
            <div className="space-y-6">
              <Suspense fallback={<div className="h-64 w-full animate-pulse bg-surface/50 rounded-xl" />}>
                <TranscriptViewer
                  transcript={meeting.transcript}
                  segments={meeting.segments || []}
                  language={meeting.language}
                  diarizationUnavailable={meeting.diarization_unavailable}
                />
              </Suspense>
            </div>

            {/* ChatBot with meeting context */}
            <Suspense fallback={null}>
              <ChatBot
                meetingId={meeting.id}
                transcript={meeting.transcript}
                summary={JSON.stringify({
                  executiveSummary: meeting.executiveSummary,
                  decisions: meeting.decisions,
                  actionItems: meeting.actionItems,
                  nextSteps: meeting.nextSteps,
                  tags: meeting.tags,
                })}
                segments={meeting.segments}
                diarizationUnavailable={meeting.diarization_unavailable}
              />
            </Suspense>
          </motion.div>
        )}
      </div>
    </main>
  );
}
