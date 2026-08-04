import React from "react";

const STEPS = [
  {
    step: "01",
    title: "Upload Recording",
    desc: "Drag & drop audio or video files (MP3, WAV, M4A, MP4, WEBM, MOV, AVI up to 100MB). No meeting bot joins your call.",
    icon: "📁",
  },
  {
    step: "02",
    title: "Whisper & Gemini Processing",
    desc: "Open-weights Whisper transcribes spoken words with high accuracy. Gemini AI extracts summaries, action items, and decisions.",
    icon: "⚙️",
  },
  {
    step: "03",
    title: "Review & Export",
    desc: "Copy executive summaries, export notes to Markdown/TXT, and query meeting context with the interactive AI Assistant.",
    icon: "✨",
  },
];

export default function WorkflowSteps() {
  return (
    <section className="my-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">How MeetMind AI Works</h2>
        <p className="mt-2 text-sm text-muted">Three simple steps to transform raw meeting recordings into actionable notes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {STEPS.map((s) => (
          <div key={s.step} className="glass-card p-6 relative group hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl" role="img" aria-label={s.title}>{s.icon}</span>
              <span className="text-xs font-bold text-purple-400/80 bg-purple-500/10 px-2.5 py-1 rounded-full">{s.step}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
