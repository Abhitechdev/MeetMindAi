import Link from "next/link";
import GradientBackground from "@/app/components/gradient-background";

export const metadata = {
  title: "Abhishek | Founder & Developer of MeetMind AI",
  description: "Learn about Abhishek, founder and lead developer of MeetMind AI. Discover his background in AI application development and product engineering.",
  alternates: {
    canonical: "/authors/abhishek",
  },
};

export default function AbhishekAuthorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abhishek",
    jobTitle: "Founder & Developer",
    worksFor: {
      "@type": "Organization",
      name: "MeetMind AI",
      url: "https://www.meetmindai.co.in",
    },
    url: "https://www.meetmindai.co.in/authors/abhishek",
    description: "AI Application Developer and Founder of MeetMind AI, specializing in audio transcription workflows and automated meeting intelligence.",
    knowsAbout: [
      "Artificial Intelligence",
      "Speech-to-Text Transcription",
      "Whisper Models",
      "Next.js & Full-Stack Web Development",
      "Meeting Productivity Systems"
    ],
  };

  return (
    <main className="relative min-h-[100dvh]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Header Breadcrumb */}
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Authors</span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Abhishek</span>
        </nav>

        {/* Profile Card */}
        <div className="glass-card p-8 md:p-12 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
              A
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Abhishek</h1>
              <p className="text-base text-purple-400 font-medium mt-1">
                Founder & Lead Developer · MeetMind AI
              </p>
              <p className="text-sm text-muted mt-1">
                AI Application Developer & Product Builder
              </p>
            </div>
          </div>

          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              Abhishek is the founder and primary developer of <strong>MeetMind AI</strong>. Passionate about productivity software and artificial intelligence, he designed MeetMind AI to eliminate the manual burden of taking meeting notes, organizing action items, and summarizing audio recordings.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">Technical Focus & Product Philosophy</h2>
            <p>
              Abhishek focuses on building friction-free web applications that combine state-of-the-art open-weights speech recognition (Whisper) with advanced language models (Gemini AI). His product philosophy prioritizes user privacy, zero mandatory bot integrations, fast processing, and clear human-readable executive summaries.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">Editorial & Quality Role</h2>
            <p>
              As the sole maintainer of MeetMind AI, Abhishek personally drafts, reviews, and fact-checks all technical guides, blog articles, and documentation on this website. Every tutorial on transcription technology or AI meeting workflows is vetted directly against the underlying codebase implementation.
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/about" className="glass-card p-6 block hover:bg-foreground/5 transition-colors">
            <h3 className="font-semibold text-foreground mb-1">About MeetMind AI →</h3>
            <p className="text-xs text-muted">Read our mission, core principles, and technical architecture.</p>
          </Link>
          <Link href="/editorial-policy" className="glass-card p-6 block hover:bg-foreground/5 transition-colors">
            <h3 className="font-semibold text-foreground mb-1">Editorial Policy →</h3>
            <p className="text-xs text-muted">Learn how we research, write, and verify content for quality.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
