import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "./components/nav";
import CursorEffect from "./components/cursor-effect";
import PublicAdWrapper from "@/components/PublicAdWrapper";

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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <CursorEffect />
          <Navigation />
          {children}
          <footer className="mt-auto py-8 text-center text-sm text-muted/60 border-t border-glass-border/30">
            <PublicAdWrapper />
            <p className="mt-4">Developed by <span className="font-semibold text-foreground/80">Abhishek</span></p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
