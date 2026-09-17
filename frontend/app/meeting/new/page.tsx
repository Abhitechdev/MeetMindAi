import { Metadata } from "next";
import Link from "next/link";
import GradientBackground from "@/app/components/gradient-background";
import MeetingOrchestrator from "@/app/components/meeting-orchestrator";

export const metadata: Metadata = {
  title: "New Meeting | MeetMind AI",
  description: "Upload audio or video recordings to automatically transcribe, summarize, and extract actionable decisions.",
  alternates: {
    canonical: "/meeting/new",
  },
};

export default function NewMeetingPage() {
  return (
    <main className="relative min-h-screen">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-muted mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/history" className="hover:text-foreground transition-colors">
              History
            </Link>
            <span>/</span>
            <span className="text-foreground">New Meeting</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                New Meeting
              </h1>
              <p className="text-sm text-muted mt-1.5 max-w-2xl">
                Upload your audio or video recording to generate transcripts, summaries, decisions, and action items.
              </p>
            </div>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl border border-card-border bg-surface text-sm font-medium text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </Link>
          </div>
        </div>

        {/* Meeting Upload & Processing Pipeline */}
        <div className="mt-4">
          <MeetingOrchestrator />
        </div>
      </div>
    </main>
  );
}
