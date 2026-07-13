import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookies Policy | MeetMind AI",
  description: "Learn how MeetMind AI uses cookies for authentication, session management, Google Analytics, and Google AdSense.",
  openGraph: {
    title: "Cookies Policy | MeetMind AI",
    description: "Learn how MeetMind AI uses cookies to improve your experience.",
    url: "https://meetmind.ai/legal/cookies-policy",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmind.ai/legal/cookies-policy",
  },
};

export default function CookiesPolicyPage() {
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
                  <span className="text-muted-foreground">Legal</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">›</span>
                  <span className="text-foreground font-medium" aria-current="page">Cookies Policy</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Cookie className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Cookies Policy
          </h1>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-muted leading-relaxed">
            At MeetMind AI, we believe in complete transparency about how we collect and use your data. This policy explains what cookies are, the specific types of cookies we use on our platform, and how you can manage them.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">What Are Cookies?</h2>
          <p className="text-muted leading-relaxed">
            Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">How We Use Cookies</h2>
          <p className="text-muted leading-relaxed mb-6">
            MeetMind AI currently uses cookies for three specific purposes: ensuring our app functions securely, remembering your sessions, and analyzing site traffic. We may use cookies for advertising in the future, as detailed below.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-card-border bg-surface p-6">
              <h3 className="text-xl font-medium text-foreground flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Authentication Cookies (Essential)
              </h3>
              <p className="text-sm text-muted">
                These are strictly necessary cookies provided by our infrastructure partner, Supabase. They verify your identity when you log in, ensuring that only you can access your private meeting recordings and summaries. Without these cookies, our application cannot function.
              </p>
            </div>

            <div className="rounded-xl border border-card-border bg-surface p-6">
              <h3 className="text-xl font-medium text-foreground flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Session Management (Essential)
              </h3>
              <p className="text-sm text-muted">
                We use session cookies to remember your state as you navigate between pages. For example, if you are uploading a meeting file and navigate away briefly, session cookies help ensure your progress isn't lost. These cookies expire when you close your browser.
              </p>
            </div>

            <div className="rounded-xl border border-card-border bg-surface p-6">
              <h3 className="text-xl font-medium text-foreground flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                Google Analytics (Performance)
              </h3>
              <p className="text-sm text-muted">
                We use Google Analytics to understand how visitors interact with our marketing pages and blog. These cookies collect anonymous information such as the number of visitors to the site, where visitors have come to the site from, and the pages they visited. This helps us improve our website's design and functionality.
              </p>
            </div>

            <div className="rounded-xl border border-card-border bg-surface p-6">
              <h3 className="text-xl font-medium text-foreground flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Advertising (Future)
              </h3>
              <p className="text-sm text-muted">
                MeetMind AI may use advertising services such as Google AdSense in the future to support free educational content on our blog. If advertising is enabled, this Cookies Policy will be updated to explain what cookies are used and how users can manage their preferences. At present, MeetMind AI does not use advertising cookies.
              </p>
            </div>
          </div>

          <div className="mt-12 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-200/80 m-0">
              <strong>Managing Cookies:</strong> Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set essential cookies, you will not be able to log in or use the MeetMind AI application.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center border-t border-card-border pt-16">
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
