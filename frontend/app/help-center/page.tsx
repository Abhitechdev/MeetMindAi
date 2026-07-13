import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Settings, CreditCard, Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | MeetMind AI",
  description: "Get help with MeetMind AI. Browse tutorials, troubleshooting guides, and contact our support team.",
  openGraph: {
    title: "Help Center | MeetMind AI",
    description: "Get help with MeetMind AI. Browse tutorials and troubleshooting guides.",
    url: "https://meetmind.ai/help-center",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmind.ai/help-center",
  },
};

export default function HelpCenterPage() {
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
                  <span className="text-foreground font-medium" aria-current="page">Help Center</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-muted">
            Browse categories or contact our support team directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <Link href="/faq" className="rounded-2xl border border-card-border bg-surface p-6 flex flex-col hover:border-foreground/20 transition-colors">
            <Mic className="h-8 w-8 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Audio & Uploads</h3>
            <p className="text-sm text-muted">Learn about supported formats, file limits, and how to get the best transcription quality.</p>
          </Link>
          
          <Link href="/faq" className="rounded-2xl border border-card-border bg-surface p-6 flex flex-col hover:border-foreground/20 transition-colors">
            <CreditCard className="h-8 w-8 text-accent-blue mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Billing & Plans</h3>
            <p className="text-sm text-muted">Manage your subscription, view invoices, and understand usage limits.</p>
          </Link>

          <Link href="/faq" className="rounded-2xl border border-card-border bg-surface p-6 flex flex-col hover:border-foreground/20 transition-colors">
            <Settings className="h-8 w-8 text-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Account Settings</h3>
            <p className="text-sm text-muted">Update your profile, change passwords, and manage data privacy settings.</p>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface/50 p-8 sm:p-12">
          <LifeBuoy className="mx-auto h-12 w-12 text-muted mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Our support team is available Monday through Friday to answer any specific questions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-4 text-base font-semibold text-white shadow-sm hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
