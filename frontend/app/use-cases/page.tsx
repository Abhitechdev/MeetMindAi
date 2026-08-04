import Link from "next/link";
import GradientBackground from "@/app/components/gradient-background";

export const metadata = {
  title: "Use Cases & Workflow Workflows | MeetMind AI",
  description: "Discover how students, academic researchers, freelancers, and team leads use MeetMind AI to transcribe recordings, extract action items, and synthesize meeting notes.",
  alternates: {
    canonical: "/use-cases",
  },
};

const USE_CASES = [
  {
    id: "students",
    badge: "Education",
    title: "Students & Lecture Capture",
    description: "Convert recorded lectures, seminars, and study group sessions into searchable text transcripts and executive study summaries.",
    workflow: [
      "Upload MP3, WAV, or MP4 recordings of lectures (up to 100MB).",
      "Process audio using Whisper speech-to-text to capture technical terms.",
      "Review Gemini AI executive summary for key lecture concepts.",
      "Ask the AI Assistant direct questions about formulas, definitions, or exam topics mentioned in class."
    ],
    benefits: ["Save hours of manual typing", "Instant keyword search across lectures", "Multi-language support for foreign language courses"]
  },
  {
    id: "researchers",
    badge: "Academia & Qualitative Research",
    title: "Academic Researchers & Fieldwork",
    description: "Transcribe qualitative interviews, oral histories, and research panels with privacy-first data handling.",
    workflow: [
      "Upload recorded audio or video interviews from field research.",
      "Select 'Speaker Detection Mode' to separate distinct interviewees.",
      "Generate verbatim transcripts and structural topic breakdowns.",
      "Export structured notes to Markdown or TXT for qualitative analysis software."
    ],
    benefits: ["No third-party bot joining sensitive calls", "Data processed securely without model training", "Speaker diarization for multi-person panels"]
  },
  {
    id: "freelancers",
    badge: "Client Management",
    title: "Freelancers & Independent Consultants",
    description: "Turn client briefing calls and project discovery sessions into clear action items and scope agreements.",
    workflow: [
      "Record discovery or status calls with clients.",
      "Process audio post-call without interrupting the conversation flow.",
      "Instantly extract agreed deliverables, deadlines, and client decisions.",
      "Export action items directly into client emails or project boards."
    ],
    benefits: ["Prevent scope creep with explicit decision logs", "Never miss client deliverables", "Professional summary exports in one click"]
  },
  {
    id: "business",
    badge: "Team Productivity",
    title: "Team Leads & Remote Workflows",
    description: "Keep cross-functional teams aligned by converting weekly standups and strategy meetings into structured meeting minutes.",
    workflow: [
      "Upload weekly sync recordings or project reviews.",
      "Generate automated executive summaries and categorized next steps.",
      "Share decision logs with absent team members for rapid catch-up.",
      "Query meeting context with the AI Assistant to recall past project commitments."
    ],
    benefits: ["Eliminate meeting catch-up overhead", "Centralized decision archive", "Clear task accountability"]
  }
];

export default function UseCasesPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Use Cases</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
            Tailored Workflows for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Every Persona</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            See how different professionals use MeetMind AI to transcribe audio, automate meeting notes, and extract actionable intelligence.
          </p>
        </div>

        <div className="space-y-12 mb-16">
          {USE_CASES.map((uc) => (
            <div key={uc.id} id={uc.id} className="glass-card p-8 md:p-10 scroll-mt-28">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
                {uc.badge}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{uc.title}</h2>
              <p className="text-muted leading-relaxed mb-6">{uc.description}</p>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-card-border">
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Step-by-Step Workflow</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-muted">
                    {uc.workflow.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Key Advantages</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {uc.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="glass-card p-8 text-center border-purple-500/20 bg-purple-500/5">
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to transform your meeting workflow?</h2>
          <p className="text-sm text-muted mb-6">Start free today with 3 complimentary meeting credits. No credit card required.</p>
          <Link href="/#upload-section" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform">
            Try MeetMind AI Free
          </Link>
        </div>
      </div>
    </main>
  );
}
