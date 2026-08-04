import type { Metadata } from "next";
import Link from "next/link";
import { GitCommit } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog & Product Updates | MeetMind AI",
  description: "Track the latest features, performance benchmarks, and software updates released for MeetMind AI.",
  openGraph: {
    title: "Changelog & Product Updates | MeetMind AI",
    description: "Track the latest features, performance benchmarks, and software updates released for MeetMind AI.",
    url: "https://www.meetmindai.co.in/changelog",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.meetmindai.co.in/changelog",
  },
};

const changelog = [
  {
    date: "August 2026",
    version: "v2.1.0",
    title: "Hardware Accelerated Compositing & EEAT Audit",
    changes: [
      "Optimized GPU compositing layers for background gradients and glassmorphism elements, eliminating paint flickering.",
      "Added authentic founder profile, editorial standards, and accessibility statement aligned with WCAG 2.1 AA targets.",
      "Introduced interactive sample output viewer for previewing transcript, summary, decision, and action item outputs."
    ],
    type: "improvement"
  },
  {
    date: "July 2026",
    version: "v2.0.0",
    title: "Whisper Pipeline Optimization & Speaker Diarization",
    changes: [
      "Upgraded underlying transcription engine to Whisper GPU workers, reducing 30-minute recording processing times to under 45 seconds.",
      "Introduced Speaker Detection Mode for qualitative research interviews and multi-person calls.",
      "Fixed an issue where very short recordings (under 30 seconds) failed to generate complete summaries."
    ],
    type: "feature"
  },
  {
    date: "June 2026",
    version: "v1.1.0",
    title: "Expanded Media Format Support & Exporting Options",
    changes: [
      "Added support for MP3, WAV, M4A, MP4, WEBM, MOV, and AVI uploads up to 100MB.",
      "Added instant single-click export options to formatted Markdown (.md) and text (.txt) notes.",
      "Optimized mobile navigation menu and contrast readability."
    ],
    type: "improvement"
  },
  {
    date: "May 2026",
    version: "v1.0.0",
    title: "Public Release of MeetMind AI",
    changes: [
      "Officially launched MeetMind AI product platform.",
      "Introduced 3 free meeting credits per user account with zero credit card required.",
      "Added secure Google OAuth authentication via Supabase."
    ],
    type: "launch"
  }
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-white/5 bg-surface/30">
        <div className="mx-auto max-w-5xl px-6 py-4 sm:px-8 lg:px-8">
          <nav className="flex text-sm text-muted" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted">/</span>
                  <span className="text-foreground font-medium" aria-current="page">Changelog</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Changelog & Product History
          </h1>
          <p className="text-lg text-muted">
            Continuous software improvements, performance benchmarks, and feature releases.
          </p>
        </div>

        <div className="space-y-12 mb-20 border-l border-card-border pl-6 ml-4 relative">
          {changelog.map((release) => (
            <div key={release.version} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              
              <div className="mb-2 flex items-baseline gap-4">
                <time className="text-sm font-medium text-muted">{release.date}</time>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-foreground border border-card-border">
                  <GitCommit className="h-3 w-3 text-purple-400" />
                  {release.version}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">{release.title}</h2>
              
              <ul className="space-y-3">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex gap-3 text-muted leading-relaxed text-sm">
                    <span className="text-purple-400 mt-1.5">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center glass-card p-8 sm:p-12 mt-20 border-purple-500/20 bg-purple-500/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Experience MeetMind AI
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto text-sm">
            Try our Whisper transcription and Gemini AI executive summary generator with 3 free meetings today.
          </p>
          <Link
            href="/#upload-section"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-4 text-base font-semibold text-white shadow-sm hover:scale-[1.03] transition-all"
          >
            Try MeetMind AI Free
          </Link>
        </div>
      </div>
    </div>
  );
}
