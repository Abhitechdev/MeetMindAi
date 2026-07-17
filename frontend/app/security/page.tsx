import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileX, Database, Server, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Security | MeetMind AI",
  description: "Learn about MeetMind AI's privacy-first architecture, data retention policies, encryption, and our commitment to protecting your meeting data.",
  openGraph: {
    title: "Security | MeetMind AI",
    description: "Learn about MeetMind AI's privacy-first architecture, data retention policies, and encryption.",
    url: "https://meetmindai.co.in/security",
    siteName: "MeetMind AI",
    images: [
      {
        url: "https://meetmindai.co.in/images/og/security.jpg",
        width: 1200,
        height: 630,
        alt: "MeetMind AI Security",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmindai.co.in/security",
  },
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-white/5 bg-surface/30">
        <div className="mx-auto max-w-5xl px-6 py-4 sm:px-8 lg:px-8">
          <nav className="flex text-sm text-muted" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">›</span>
                  <span className="text-foreground font-medium" aria-current="page">Security</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Privacy-First Architecture
          </h1>
          <p className="text-lg leading-8 text-muted">
            Your meeting recordings contain sensitive, proprietary information. At MeetMind AI, we have engineered our platform from the ground up to ensure your data remains private, secure, and entirely under your control.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="rounded-2xl border border-card-border bg-surface p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Encryption in Transit and at Rest</h3>
            <p className="text-muted leading-relaxed">
              All data transmitted between your browser and our servers is protected using industry-standard TLS 1.2+ encryption. Once stored, your files, transcripts, and summaries are encrypted at rest using AES-256 encryption within our Supabase infrastructure.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Strict AI Processing Workflow</h3>
            <p className="text-muted leading-relaxed">
              We pass your transcripts to secure APIs to generate summaries and extract action items. We enforce strict zero-retention policies with our AI partners. <strong>Your meeting data is never used to train public Large Language Models (LLMs).</strong>
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FileX className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Data Retention & Deletion</h3>
            <p className="text-muted leading-relaxed">
              You own your data. When you delete a meeting from your history, it triggers a hard delete across our databases and storage buckets. We do not retain hidden copies or soft-delete backups of your proprietary recordings.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">GDPR-Ready & Compliance</h3>
            <p className="text-muted leading-relaxed">
              Our infrastructure is built to support GDPR and CCPA requirements. We provide tooling for data export and complete account deletion. We are also actively building out our compliance framework with <strong>SOC 2 certification currently planned</strong> for our upcoming enterprise roadmap.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface/50 p-8 sm:p-12 text-center">
          <Server className="mx-auto h-12 w-12 text-muted mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Secure Infrastructure</h2>
          <p className="text-muted max-w-2xl mx-auto mb-8">
            MeetMind AI is built on top of enterprise-grade infrastructure. We leverage Supabase for authentication and database management, inheriting their robust physical and network security protocols.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" /> Secure Auth
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" /> Row Level Security
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" /> Automated Backups
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Ready to save time in your meetings securely?
          </h2>
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
