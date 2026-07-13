import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Code, BookOpen, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation | MeetMind AI",
  description: "Integrate MeetMind AI's powerful transcription and summarization capabilities directly into your own applications with our REST API.",
  openGraph: {
    title: "API Documentation | MeetMind AI",
    description: "Integrate MeetMind AI's powerful capabilities into your applications.",
    url: "https://meetmind.ai/api-docs",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmind.ai/api-docs",
  },
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
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
                  <span className="text-foreground font-medium" aria-current="page">API Docs</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            MeetMind API
          </h1>
          <p className="text-lg text-muted">
            Everything you need to integrate our intelligence directly into your workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl border border-card-border bg-surface p-8">
            <Terminal className="h-8 w-8 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Getting Started</h3>
            <p className="text-sm text-muted leading-relaxed">
              Our REST API allows you to upload audio files, poll for processing status, and retrieve structured summaries and action items programmatically. 
            </p>
          </div>
          
          <div className="rounded-2xl border border-card-border bg-surface p-8">
            <Key className="h-8 w-8 text-accent-blue mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Authentication</h3>
            <p className="text-sm text-muted leading-relaxed">
              All API endpoints require a Bearer token. You can generate an API key from your account dashboard once you upgrade to the Pro plan.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-card-border overflow-hidden bg-[#0d1117] mb-12">
          <div className="bg-[#161b22] px-4 py-2 border-b border-card-border flex items-center gap-2">
            <Code className="h-4 w-4 text-muted" />
            <span className="text-xs font-mono text-muted">POST /v1/meetings/upload</span>
          </div>
          <div className="p-6 overflow-x-auto text-sm font-mono text-green-400">
            <pre>{`curl -X POST https://api.meetmind.ai/v1/meetings/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/meeting.mp4" \\
  -F "language=en"`}</pre>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface/50 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to build with MeetMind AI?
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Upgrade to Pro to generate your API keys and start automating your workflow.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-4 text-base font-semibold text-white shadow-sm hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
