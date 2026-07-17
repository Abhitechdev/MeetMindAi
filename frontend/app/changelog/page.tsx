import type { Metadata } from "next";
import Link from "next/link";
import { GitCommit } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog | MeetMind AI",
  description: "See what's new in MeetMind AI. Keep track of our latest features, performance improvements, and bug fixes.",
  openGraph: {
    title: "Changelog | MeetMind AI",
    description: "Keep track of our latest features, performance improvements, and bug fixes.",
    url: "https://meetmindai.co.in/changelog",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmindai.co.in/changelog",
  },
};

const changelog = [
  {
    date: "July 10, 2026",
    version: "v1.2.0",
    title: "Faster Whisper Integration & Improved Action Items",
    changes: [
      "Upgraded our underlying transcription engine to Faster-Whisper, reducing transcription time by 40%.",
      "Enhanced the LLM prompt for Action Items to better identify assignees and deadlines.",
      "Fixed an issue where very short meetings (under 2 minutes) failed to generate a summary."
    ],
    type: "feature"
  },
  {
    date: "June 25, 2026",
    version: "v1.1.5",
    title: "Export to Notion and UI Polish",
    changes: [
      "Added the ability to export meeting transcripts and summaries directly to Notion.",
      "Updated the dashboard UI with a new progress tracker for processing meetings.",
      "Optimized the mobile navigation menu for better accessibility."
    ],
    type: "improvement"
  },
  {
    date: "June 12, 2026",
    version: "v1.1.0",
    title: "Audio Upload Limits Increased",
    changes: [
      "Pro users can now upload audio files up to 2GB in size.",
      "Added support for M4A and WAV file formats.",
      "Resolved a bug causing the waveform animation to stutter on Safari."
    ],
    type: "feature"
  },
  {
    date: "May 28, 2026",
    version: "v1.0.0",
    title: "Public Launch of MeetMind AI",
    changes: [
      "Officially launched MeetMind AI out of beta.",
      "Introduced the Free and Pro subscription tiers.",
      "Added secure Google and Email authentication via Supabase."
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
                  <span className="mx-2 text-muted-foreground">›</span>
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
            Changelog
          </h1>
          <p className="text-lg text-muted">
            New updates and improvements to MeetMind AI.
          </p>
        </div>

        <div className="space-y-12 mb-20 border-l border-card-border pl-6 ml-4 relative">
          {changelog.map((release) => (
            <div key={release.version} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              
              <div className="mb-2 flex items-baseline gap-4">
                <time className="text-sm font-medium text-muted">{release.date}</time>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-foreground border border-card-border">
                  <GitCommit className="h-3 w-3" />
                  {release.version}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">{release.title}</h2>
              
              <ul className="space-y-3">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex gap-3 text-muted leading-relaxed">
                    <span className="text-accent-blue mt-1.5">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface/50 p-8 sm:p-12 mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to save time in your meetings?
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Experience our latest features and start maximizing your productivity.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-4 text-base font-semibold text-white shadow-sm hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
          >
            Try MeetMind AI for free
          </Link>
        </div>
      </div>
    </div>
  );
}
