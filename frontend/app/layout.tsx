import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/nav";
import CursorEffect from "./components/cursor-effect";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
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
          <footer className="mt-auto py-12 text-center text-sm text-muted border-t border-card-border bg-surface/30">
            <nav className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 mt-4 mb-4 text-xs sm:text-sm tracking-wide" aria-label="Legal">
              <a href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="/legal/ai-transparency" className="hover:text-foreground transition-colors">AI Transparency</a>
              <a href="/legal/acceptable-use" className="hover:text-foreground transition-colors">Acceptable Use</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            </nav>
            <p className="mb-1">&copy; 2026 MeetMind AI. All rights reserved.</p>
            <p>Developed by <span className="font-semibold text-foreground/80">Abhishek</span></p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
