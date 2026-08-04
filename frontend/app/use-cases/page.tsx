import Link from "next";
import { GraduationCap, Microscope, Briefcase, Users, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import GradientBackground from "@/app/components/gradient-background";

export const metadata = {
  title: "Use Cases & Workflows | MeetMind AI",
  description: "Discover how students, academic researchers, freelancers, and team leads use MeetMind AI to transcribe recordings, extract action items, and synthesize meeting notes.",
  alternates: {
    canonical: "/use-cases",
  },
};

const USE_CASES = [
  {
    id: "students",
    badge: "Education & Study Groups",
    title: "Students & Lecture Capture",
    icon: GraduationCap,
    accentColor: "from-accent-purple/20 via-accent-purple/5 to-transparent",
    badgeStyle: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
    description: "Convert recorded lectures, seminars, and study group sessions into searchable text transcripts and executive study summaries.",
    workflow: [
      "Upload MP3, WAV, or MP4 recordings of lectures (up to 100MB).",
      "Process audio using Whisper speech-to-text to capture technical terms.",
      "Review Gemini AI executive summary for key lecture concepts.",
      "Ask the AI Assistant direct questions about formulas, definitions, or exam topics."
    ],
    benefits: [
      "Save hours of manual typing and re-listening",
      "Instant keyword search across all class recordings",
      "Multi-language support for foreign language courses"
    ]
  },
  {
    id: "researchers",
    badge: "Academia & Qualitative Research",
    title: "Academic Researchers & Fieldwork",
    icon: Microscope,
    accentColor: "from-accent-blue/20 via-accent-blue/5 to-transparent",
    badgeStyle: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    description: "Transcribe qualitative interviews, oral histories, and research panels with privacy-first data handling.",
    workflow: [
      "Upload recorded audio or video interviews from field research.",
      "Select Speaker Detection Mode to separate distinct interviewees.",
      "Generate verbatim transcripts and structural topic breakdowns.",
      "Export structured notes to Markdown or TXT for analysis software."
    ],
    benefits: [
      "No third-party bot joining sensitive research calls",
      "Data processed securely with zero AI model training",
      "Speaker diarization for multi-person panels"
    ]
  },
  {
    id: "freelancers",
    badge: "Client Management",
    title: "Freelancers & Consultants",
    icon: Briefcase,
    accentColor: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Turn client briefing calls and project discovery sessions into clear action items and scope agreements.",
    workflow: [
      "Record discovery or status calls with clients.",
      "Process audio post-call without interrupting conversation flow.",
      "Instantly extract agreed deliverables, deadlines, and client decisions.",
      "Export action items directly into client emails or project boards."
    ],
    benefits: [
      "Prevent scope creep with explicit decision logs",
      "Never miss client deliverables or key promises",
      "Professional summary exports in one click"
    ]
  },
  {
    id: "business",
    badge: "Team Productivity",
    title: "Team Leads & Remote Workflows",
    icon: Users,
    accentColor: "from-purple-500/20 via-purple-500/5 to-transparent",
    badgeStyle: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Keep cross-functional teams aligned by converting weekly standups and strategy meetings into structured meeting minutes.",
    workflow: [
      "Upload weekly sync recordings or project reviews.",
      "Generate automated executive summaries and categorized next steps.",
      "Share decision logs with absent team members for rapid catch-up.",
      "Query meeting context with the AI Assistant to recall past project commitments."
    ],
    benefits: [
      "Eliminate meeting catch-up overhead across time zones",
      "Centralized, searchable decision archive",
      "Clear task accountability for every project"
    ]
  }
];

export default function UseCasesPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-sm text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Use Cases</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
            <span>Tailored Solutions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Workflows Built for <span className="bg-gradient-to-r from-accent-purple via-foreground to-accent-blue bg-clip-text text-transparent">Every Persona</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            See how different professionals use MeetMind AI to transcribe audio, automate meeting notes, and extract actionable intelligence.
          </p>
        </div>

        {/* Grid of Persona Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.id}
                id={uc.id}
                className="group relative glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between overflow-hidden scroll-mt-28"
              >
                {/* Dynamic Brand Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${uc.accentColor} opacity-40 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-card-border shadow-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${uc.badgeStyle}`}>
                      {uc.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">{uc.title}</h2>
                  <p className="text-sm text-muted leading-relaxed mb-6 font-normal">{uc.description}</p>

                  {/* Workflow Steps */}
                  <div className="mb-6 pt-4 border-t border-card-border/60">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Workflow Steps</h3>
                    <ol className="space-y-2.5">
                      {uc.workflow.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-muted leading-relaxed">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple/10 text-accent-purple text-[10px] font-bold shrink-0 border border-accent-purple/20 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Benefits */}
                  <div className="pt-4 border-t border-card-border/60">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Key Advantages</h3>
                    <ul className="space-y-2">
                      {uc.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-foreground/80 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="relative glass-card p-10 text-center border-accent-purple/20 bg-accent-purple/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-blue/10 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">Ready to transform your meeting workflow?</h2>
            <p className="text-sm text-muted mb-8 leading-relaxed">Start free today with 3 complimentary meeting credits. No credit card required.</p>
            <Link
              href="/#upload-section"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform"
            >
              <span>Try MeetMind AI Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
