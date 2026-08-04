import Link from "next/link";
import GradientBackground from "@/app/components/gradient-background";

export const metadata = {
  title: "Editorial Policy | MeetMind AI",
  description: "Learn about MeetMind AI's editorial standards, single-maintainer review process, technical fact-checking, and AI usage disclosures.",
  alternates: {
    canonical: "/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Editorial Policy</span>
        </nav>

        <div className="glass-card p-8 md:p-12 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
            Editorial Policy & Content Standards
          </h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            At MeetMind AI, we hold our documentation, educational articles, and product guides to rigorous standards of accuracy, transparency, and practical utility.
          </p>

          <div className="space-y-8 text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">1. Authentic Single-Maintainer Review Process</h2>
              <p>
                MeetMind AI is developed and maintained by founder and lead developer <strong>Abhishek</strong>. All public content—including blog posts, technical explainers, help center guides, and release notes—follows a direct, accountable review workflow:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Drafting & Research:</strong> Content is outlined and drafted around real user challenges in meeting transcription, AI summarization, and productivity workflows.</li>
                <li><strong>Technical Fact-Checking:</strong> Every technical claim regarding Whisper transcription, Gemini AI models, security protocols, or API behavior is vetted directly against our active codebase by Abhishek.</li>
                <li><strong>Source Verification:</strong> Claims referencing third-party frameworks, academic papers, or industry benchmarks are cross-referenced with authoritative documentation before publishing.</li>
                <li><strong>Maintenance Updates:</strong> When software features, upload limits, or UI workflows change, corresponding documentation and articles are updated to reflect active product reality.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">2. Responsible AI Assistance Disclosure</h2>
              <p>
                We build AI products and utilize artificial intelligence responsibly in our writing workflow:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Brainstorming & Drafting:</strong> Large Language Models are used as drafting tools for structuring outlines, suggesting headings, or summarizing complex technical documentation.</li>
                <li><strong>Human Authority & Tone:</strong> No AI-generated text is published without human editing, voice alignment, and technical verification. We strictly avoid repetitive AI filler and synthetic marketing claims.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">3. Product Documentation Grounding</h2>
              <p>
                We do not publish placeholder marketing copy or unverified feature claims. If a feature or integration is in development, it is clearly labeled as <em>&quot;Roadmap&quot;</em> or <em>&quot;Planned&quot;</em>. All available product documentation reflects currently implemented software.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">4. Feedback & Corrections</h2>
              <p>
                We welcome feedback from our users and community. If you identify an inaccuracy or outdated detail in any of our guides, please contact us at <a href="mailto:meetmindai.help@zohomail.in" className="text-purple-400 hover:underline">meetmindai.help@zohomail.in</a>. Corrections are investigated and updated promptly.
              </p>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/authors/abhishek" className="glass-card px-6 py-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors">
            Meet the Founder (Abhishek) →
          </Link>
          <Link href="/about" className="glass-card px-6 py-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors">
            About MeetMind AI →
          </Link>
        </div>
      </div>
    </main>
  );
}
