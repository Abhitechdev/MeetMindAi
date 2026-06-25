"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TranscriptionSegment } from "@/lib/types";

interface TranscriptViewerProps {
  transcript: string;
  segments: TranscriptionSegment[];
  language?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TranscriptViewer({ transcript, segments, language = "English" }: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [search, setSearch] = useState("");
  const [translatedTranscript, setTranslatedTranscript] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const displayTranscript = translatedTranscript || transcript;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslate = async () => {
    if (translatedTranscript) {
      setTranslatedTranscript(null);
      return;
    }
    setIsTranslating(true);
    try {
      const { translateTranscript } = await import("@/lib/api");
      const res = await translateTranscript(transcript, language, "English");
      setTranslatedTranscript(res.translated_transcript);
    } catch (err) {
      console.error(err);
      alert("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const filteredSegments = search
    ? segments.filter((s) => s.text.toLowerCase().includes(search.toLowerCase()))
    : segments;

  // ponytail: inline highlight, no util needed for single-use
  const highlightMatch = (text: string) => {
    if (!search) return text;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-accent-purple/30 text-foreground rounded px-0.5">{text.slice(idx, idx + search.length)}</mark>
        {text.slice(idx + search.length)}
      </>
    );
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.15))" }}
          >
            <svg className="h-[18px] w-[18px] text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Transcript {language !== "English" && `(${language})`}</h2>
        </div>
        <div className="flex items-center gap-2">
          {language !== "English" && (
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-accent-purple bg-accent-purple/10 hover:bg-accent-purple/20 transition-colors disabled:opacity-50"
            >
              {isTranslating ? "Translating..." : (translatedTranscript ? "Show Original" : "Translate to English")}
            </button>
          )}
          <button
            onClick={() => setShowTimestamps(!showTimestamps)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            {showTimestamps ? "Hide" : "Show"} timestamps
          </button>
          <button
            id="copy-transcript-btn"
            onClick={handleCopy}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transcript..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-surface border border-glass-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent-purple/50 transition-colors"
        />
      </div>

      <div className="max-h-96 overflow-y-auto space-y-0.5 pr-2">
        {showTimestamps && filteredSegments.length > 0
          ? filteredSegments.map((seg, i) => (
              <motion.div
                key={i}
                className="flex gap-3 py-1 group hover:bg-white/[0.03] rounded px-2 -mx-2 transition-colors border-l-2 border-transparent hover:border-accent-purple/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
              >
                <span className="shrink-0 text-[11px] font-mono text-accent-purple/70 pt-0.5 w-12 text-right">
                  {formatTime(seg.start)}
                </span>
                <p className="text-[13px] font-medium text-foreground/80 leading-snug">
                  {highlightMatch(seg.text)}
                </p>
              </motion.div>
            ))
          : (
            <p className="text-[13px] font-medium text-foreground/80 leading-snug whitespace-pre-wrap">
              {displayTranscript}
            </p>
          )}
      </div>
    </div>
  );
}
