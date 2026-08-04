import Link from "next/link";
import Image from "next/image";
import GradientBackground from "@/app/components/gradient-background";

export const metadata = {
  title: "About the Author | Abhishek - Founder of MeetMind AI",
  description: "Abhishek is the founder and developer of MeetMind AI and creator of AbhiTech Decoded. Learn how MeetMind AI uses Whisper and Gemini AI for automated meeting intelligence.",
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
    image: "https://www.meetmindai.co.in/images/abhishek-kumar.jpg",
    worksFor: {
      "@type": "Organization",
      name: "MeetMind AI",
      url: "https://www.meetmindai.co.in",
    },
    url: "https://www.meetmindai.co.in/authors/abhishek",
    description: "Abhishek is the founder and developer of MeetMind AI and the creator of AbhiTech Decoded. He created MeetMind AI to help users save time by automatically transcribing meeting recordings, generating AI-powered summaries, identifying action items, and organizing key decisions.",
    knowsAbout: [
      "Artificial Intelligence",
      "Speech-to-Text Transcription",
      "Whisper Models",
      "Gemini AI Integration",
      "Next.js & Web Product Development",
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
        <nav className="mb-8 text-sm text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Authors</span>
          <span>/</span>
          <span className="text-foreground font-medium">Abhishek</span>
        </nav>

        {/* Profile Card */}
        <div className="glass-card p-8 md:p-12 mb-12 rounded-2xl border border-card-border/80 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden border-2 border-accent-purple/50 shadow-xl shrink-0 group">
              <Image
                src="/images/abhishek-kumar.jpg"
                alt="Abhishek - Founder & Lead Developer of MeetMind AI"
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20 mb-2">
                Founder & Chief Architect
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Abhishek</h1>
              <p className="text-base bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent font-semibold mt-1">
                Founder & Lead Developer · MeetMind AI (AbhiTech Decoded)
              </p>
              <p className="text-sm text-muted mt-1">
                AI Application Developer & Tech Educator
              </p>
            </div>
          </div>

          <div className="space-y-6 text-muted leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">About the Author</h2>
            <p className="text-base leading-relaxed">
              Abhishek is the founder and developer of <strong>MeetMind AI</strong> and the creator of <strong>AbhiTech Decoded</strong>.
            </p>
            <p className="text-base leading-relaxed">
              He created MeetMind AI to help users save time by automatically transcribing meeting recordings, generating AI-powered summaries, identifying action items, and organizing key decisions.
            </p>
            <p className="text-base leading-relaxed">
              His work focuses on building practical AI-powered web applications that are simple to use and solve real productivity problems. MeetMind AI combines Whisper for speech transcription with Gemini AI to help users turn conversations into structured notes and insights.
            </p>
            <p className="text-base leading-relaxed">
              As the sole developer and maintainer of MeetMind AI, Abhishek writes and maintains the product documentation, help guides, and blog articles published on this website. Content is reviewed against the current functionality of the product and updated as features change to keep the information accurate and relevant.
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/about" className="glass-card p-6 block hover:bg-foreground/5 transition-colors rounded-xl">
            <h3 className="font-semibold text-foreground mb-1">About MeetMind AI →</h3>
            <p className="text-xs text-muted">Read our mission, core principles, and technical architecture.</p>
          </Link>
          <Link href="/editorial-policy" className="glass-card p-6 block hover:bg-foreground/5 transition-colors rounded-xl">
            <h3 className="font-semibold text-foreground mb-1">Editorial Policy →</h3>
            <p className="text-xs text-muted">Learn how we research, write, and verify content for quality.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
