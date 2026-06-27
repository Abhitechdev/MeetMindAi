"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProcessingResponse, ProcessingStatus } from "@/lib/types";
import { processMeeting, UsageLimitError, getUsage } from "@/lib/api";
import UpgradeModal from "./components/upgrade-modal";
import GradientBackground from "./components/gradient-background";
import ProgressTracker from "./components/progress-tracker";
import WaveformAnimation from "./components/waveform-animation";
import AudioUpload from "./components/audio-upload";
import TranscriptViewer from "./components/transcript-viewer";
import SummaryViewer from "./components/summary-viewer";
import ChatBot from "./components/chat-bot";
import HeroSection from "./components/hero-section";
import BentoFeatures from "./components/bento-features";
import MetricCards from "./components/metric-cards";
import LanguageMarquee from "./components/language-marquee";

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
    subtitle: "Analyzing transcript with Gemini AI",
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

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [result, setResult] = useState<ProcessingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const fetchUsage = () => {
      getUsage().then(usage => setLimitReached(usage.used >= usage.limit)).catch(console.error);
    };
    fetchUsage();
    window.addEventListener("usage-updated", fetchUsage);
    
    const handleOpenModal = () => setIsUpgradeModalOpen(true);
    window.addEventListener("open-upgrade-modal", handleOpenModal);
    
    return () => {
      window.removeEventListener("usage-updated", fetchUsage);
      window.removeEventListener("open-upgrade-modal", handleOpenModal);
    };
  }, []);

  const handleUpload = useCallback(async (file: File, outputLanguage: string) => {
    setError(null);
    setResult(null);
    setStatus("uploading");

    try {
      // ponytail: brief delay so user sees the upload step before it jumps to transcribing
      await new Promise((r) => setTimeout(r, 600));
      setStatus("transcribing");

      const data = await processMeeting(file, outputLanguage);

      // ponytail: brief summarizing step so all 4 progress steps are visible
      setStatus("summarizing");
      await new Promise((r) => setTimeout(r, 800));

      setResult(data);
      setStatus("complete");
      window.dispatchEvent(new Event("usage-updated"));
      router.refresh();
    } catch (err) {
      if (err instanceof UsageLimitError) {
        setIsUpgradeModalOpen(true);
        setStatus("idle");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    }
  }, [router]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

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
    <main className="relative min-h-screen">
      <GradientBackground />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* ====== IDLE / ERROR ====== */}
          {(status === "idle" || status === "error") && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HeroSection />
              <BentoFeatures />
              <LanguageMarquee />

              {/* Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AudioUpload onUpload={handleUpload} disabled={false} limitReached={limitReached} />
              </motion.div>

              {/* Error */}
              {status === "error" && error && (
                <motion.div
                  className="mt-4 glass-card px-5 py-4"
                  style={{ borderColor: "rgba(239,68,68,0.3)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-sm text-red-400 font-medium mb-0.5">Processing failed</p>
                  <p className="text-sm text-red-400/70">{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ====== PROCESSING ====== */}
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="pt-8"
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
            </motion.div>
          )}

          {/* ====== RESULTS ====== */}
          {status === "complete" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Meeting Results</h2>
                  <p className="text-sm text-muted mt-1">AI-powered analysis complete</p>
                </div>
                <motion.button
                  id="new-meeting-btn"
                  onClick={handleReset}
                  className="glass-card glass-card-hover flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Meeting
                </motion.button>
              </div>

              {/* Insights grid */}
              {insights && (
                <MetricCards 
                  duration={formatDuration(insights.duration)}
                  words={insights.words.toLocaleString()}
                  actionCount={String(insights.actionCount)}
                  confidence={`${insights.confidence}%`}
                />
              )}

              {/* Transcript */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-5"
              >
                <TranscriptViewer transcript={result.transcript} segments={result.segments} language={result.language} />
              </motion.div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <SummaryViewer
                  executiveSummary={result.executiveSummary}
                  keyDecisions={result.decisions}
                  actionItems={result.actionItems}
                  nextSteps={result.nextSteps}
                />
              </motion.div>

              {/* Export actions */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  onClick={handleCopySummary}
                  className="glass-card glass-card-hover px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  {copiedSummary ? "✓ Copied" : "Copy Summary"}
                </motion.button>
                <motion.button
                  onClick={handleExportTxt}
                  className="glass-card glass-card-hover px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export TXT
                </motion.button>
                <motion.button
                  onClick={handleExportMd}
                  className="glass-card glass-card-hover px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export Markdown
                </motion.button>
              </motion.div>
              
              {/* ChatBot */}
              <ChatBot 
                meetingId={result.id}
                transcript={result.transcript} 
                summary={result.executiveSummary} 
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
