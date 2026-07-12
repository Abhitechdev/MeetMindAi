import type { Metadata } from "next";
import Link from "next/link";
// Launch prep: ensuring metadata types are imported
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/nav";
import CursorEffect from "./components/cursor-effect";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${inter.variable}`}>
      <head>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-sans tracking-tight">
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
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/legal/ai-transparency" className="hover:text-foreground transition-colors">AI Transparency</Link>
              <Link href="/legal/acceptable-use" className="hover:text-foreground transition-colors">Acceptable Use</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
            <div className="flex justify-center gap-4 mb-6">
              <a href="https://www.instagram.com/meetmindai.app/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="mailto:support@meetmindai.co.in" className="text-muted hover:text-foreground transition-colors" aria-label="Email Support">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
            <div className="space-y-1">
              <p>&copy; {new Date().getFullYear()} MeetMind AI. All rights reserved.</p>
              <p>Developed by <span className="font-semibold text-foreground/80">Abhishek</span></p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
