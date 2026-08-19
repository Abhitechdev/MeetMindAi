import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/nav";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ponytail: next/font self-hosts fonts, adds font-display: swap, eliminates render-blocking @import
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.meetmindai.co.in"),
  title: "MeetMind AI | Free AI Meeting Summaries & Audio Transcription",
  description:
    "Upload meeting audio or video to instantly generate transcripts, action items, and summaries in multiple languages. Try MeetMind AI 2.0 free today.",
  openGraph: {
    title: "MeetMind AI | Free AI Meeting Summaries & Audio Transcription",
    description: "Upload meeting audio or video to instantly generate transcripts, action items, and summaries in multiple languages. Try MeetMind AI 2.0 free today.",
    url: "https://www.meetmindai.co.in",
    siteName: "MeetMind AI",
    images: [{ url: "/images/og-card.png", width: 1200, height: 630, alt: "MeetMind AI dashboard showing meeting transcript and AI summary" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetMind AI | Free AI Meeting Summaries & Audio Transcription",
    description: "Upload meeting audio or video to instantly generate transcripts, action items, and summaries in multiple languages.",
    images: ["/images/og-card.png"],
  },
  other: {
    "trustpilot-one-time-domain-verification-id": "3fe46a1d-8988-427f-b8b8-d61535403d2b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased scroll-smooth ${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "MeetMind AI",
                url: "https://www.meetmindai.co.in",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                description: "AI-powered meeting transcription, summarization, and action item extraction supporting multiple languages.",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "INR",
                  name: "Free Plan",
                  description: "3 meetings free, includes transcription and AI summaries",
                },
                featureList: [
                  "AI Meeting Transcription",
                  "Executive Summary Generation",
                  "Action Item Extraction",
                  "Decision Tracking",
                  "Multilingual Support",
                  "AI Meeting Chat Assistant",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "MeetMind AI",
                url: "https://www.meetmindai.co.in",
                logo: "https://www.meetmindai.co.in/images/og-card.png",
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "meetmindai.help@zohomail.in",
                  contactType: "customer support"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "MeetMind AI",
                url: "https://www.meetmindai.co.in",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://www.meetmindai.co.in/blog?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ]),
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col bg-background text-foreground ${inter.className}`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-8627957484050006"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HS4WZF1K1M" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HS4WZF1K1M');
          `}
        </Script>

        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navigation />
          {children}
          <Analytics />
          <SpeedInsights />
          <footer className="mt-auto border-t border-card-border bg-surface/30 pt-16 pb-8">
            <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Product</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link href="/use-cases" className="hover:text-foreground transition-colors">Use Cases</Link></li>
                    <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                    <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
                    <li><Link href="/reviews" className="hover:text-foreground transition-colors">Reviews</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Resources</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                    <li><Link href="/help-center" className="hover:text-foreground transition-colors">Help Center</Link></li>
                    <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                    <li><a href="https://www.instagram.com/meetmindai.app/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a></li>
                    <li><a href="https://www.facebook.com/people/Meetmindai/61591537005949/?rdid=GfeN5LHv6wJRasp7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GeR76utG5%2F" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Facebook Page</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Company</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                    <li><Link href="/authors/abhishek" className="hover:text-foreground transition-colors">Founder Bio</Link></li>
                    <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                    <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Trust & Standards</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                    <li><Link href="/editorial-policy" className="hover:text-foreground transition-colors">Editorial Policy</Link></li>
                    <li><Link href="/accessibility" className="hover:text-foreground transition-colors">Accessibility Statement</Link></li>
                    <li><Link href="/legal/ai-transparency" className="hover:text-foreground transition-colors">AI Transparency</Link></li>
                    <li><Link href="/legal/cookies-policy" className="hover:text-foreground transition-colors">Cookies Policy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-card-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
                <p>&copy; 2026 MeetMind AI. All rights reserved.</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/meetmindai.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 border border-card-border hover:border-pink-500/50 hover:bg-pink-500/10 transition-all text-xs font-medium text-muted hover:text-foreground shadow-sm"
                    aria-label="Follow MeetMind AI on Instagram"
                  >
                    <svg className="w-4 h-4 text-muted group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.facebook.com/people/Meetmindai/61591537005949/?rdid=GfeN5LHv6wJRasp7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GeR76utG5%2F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 border border-card-border hover:border-blue-500/50 hover:bg-blue-500/10 transition-all text-xs font-medium text-muted hover:text-foreground shadow-sm"
                    aria-label="Follow MeetMind AI on Facebook"
                  >
                    <svg className="w-4 h-4 text-muted group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
                <p>Developed by <Link href="/authors/abhishek" className="font-semibold text-foreground/80 hover:text-foreground transition-colors">Abhishek</Link></p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
