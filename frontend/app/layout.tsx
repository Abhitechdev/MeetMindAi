import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/nav";
import CursorEffect from "./components/cursor-effect";
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
  title: "MeetMind AI — Meeting Insights Powered by AI",
  description:
    "Upload your meeting recording and instantly get a transcript, executive summary, key decisions, action items, and next steps — all powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased scroll-smooth ${inter.variable} ${poppins.variable}`}>
      <head>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XTH4Y4K2JM" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XTH4Y4K2JM');
          `}
        </Script>
        <Script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js" type="module" strategy="afterInteractive" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <CursorEffect />
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
                    <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Resources</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                    <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                    {/* ponytail: disabled per requirement for future */}
                    <li className="opacity-50 cursor-not-allowed">API Docs</li>
                    <li className="opacity-50 cursor-not-allowed">Help Center</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Company</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                    <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                    <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Trust</h3>
                  <ul className="space-y-3 text-sm text-muted">
                    <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                    <li><Link href="/legal/ai-transparency" className="hover:text-foreground transition-colors">AI Transparency</Link></li>
                    <li><Link href="/legal/cookies-policy" className="hover:text-foreground transition-colors">Cookies Policy</Link></li>
                    <li><Link href="/legal/acceptable-use" className="hover:text-foreground transition-colors">Acceptable Use</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-card-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
                <p>&copy; 2026 MeetMind AI. All rights reserved.</p>
                <p>Developed by <span className="font-semibold text-foreground/80">Abhishek</span></p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
