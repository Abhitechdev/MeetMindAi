import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | MeetMind AI",
  description: "Simple, transparent pricing for MeetMind AI. Start for free and upgrade when you need unlimited meeting transcription and AI summaries.",
  openGraph: {
    title: "Pricing | MeetMind AI",
    description: "Simple, transparent pricing for MeetMind AI.",
    url: "https://meetmind.ai/pricing",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmind.ai/pricing",
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "MeetMind AI Pro Plan",
    "description": "Unlimited AI meeting transcriptions, summaries, and action item extraction.",
    "brand": {
      "@type": "Brand",
      "name": "MeetMind AI"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://meetmind.ai/pricing",
      "priceCurrency": "USD",
      "price": "19.00",
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Script id="pricing-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
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
                  <span className="text-foreground font-medium" aria-current="page">Pricing</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Stop taking manual notes and start participating. Upgrade whenever you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* Free Plan */}
          <div className="rounded-3xl border border-card-border bg-surface p-8 xl:p-10 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">Free</h3>
              <p className="text-muted mt-2">Perfect for individuals just getting started.</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold tracking-tight text-foreground">$0</span>
              <span className="text-muted">/month</span>
            </div>
            <Link
              href="/login"
              className="mt-4 mb-8 block w-full rounded-xl bg-white/5 hover:bg-white/10 px-3 py-3 text-center text-sm font-semibold text-foreground transition-colors border border-white/10"
            >
              Get Started
            </Link>
            <ul className="space-y-4 flex-1">
              <li className="flex gap-3 text-sm text-muted">
                <Check className="h-5 w-5 flex-shrink-0 text-foreground" />
                <span>3 Meetings per month</span>
              </li>
              <li className="flex gap-3 text-sm text-muted">
                <Check className="h-5 w-5 flex-shrink-0 text-foreground" />
                <span>Standard Transcription</span>
              </li>
              <li className="flex gap-3 text-sm text-muted">
                <Check className="h-5 w-5 flex-shrink-0 text-foreground" />
                <span>Basic AI Summaries</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="rounded-3xl border border-purple-500/30 bg-surface/50 p-8 xl:p-10 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-1 text-xs font-bold text-white rounded-bl-lg">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">Pro</h3>
              <p className="text-muted mt-2">For professionals who live in meetings.</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold tracking-tight text-foreground">$19</span>
              <span className="text-muted">/month</span>
            </div>
            <Link
              href="/login"
              className="mt-4 mb-8 block w-full rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue hover:scale-[1.02] px-3 py-3 text-center text-sm font-semibold text-white transition-all shadow-sm"
            >
              Upgrade to Pro
            </Link>
            <ul className="space-y-4 flex-1">
              <li className="flex gap-3 text-sm text-foreground">
                <Check className="h-5 w-5 flex-shrink-0 text-accent-purple" />
                <span><strong>Unlimited</strong> Meetings</span>
              </li>
              <li className="flex gap-3 text-sm text-foreground">
                <Check className="h-5 w-5 flex-shrink-0 text-accent-purple" />
                <span>Priority Transcription Speed</span>
              </li>
              <li className="flex gap-3 text-sm text-foreground">
                <Check className="h-5 w-5 flex-shrink-0 text-accent-purple" />
                <span>Advanced AI Summaries & Action Items</span>
              </li>
              <li className="flex gap-3 text-sm text-foreground">
                <Check className="h-5 w-5 flex-shrink-0 text-accent-purple" />
                <span>Export to Notion, PDF, Markdown</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Ready to save time in your meetings?
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
