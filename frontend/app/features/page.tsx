import { Metadata } from "next";
import BentoFeatures from "../components/bento-features";
import GradientBackground from "../components/gradient-background";

export const metadata: Metadata = {
  title: "Features - MeetMind AI",
  description: "Explore the powerful features of MeetMind AI including speech-to-text, AI summaries, and more.",
};

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-12 flex flex-col">
      <GradientBackground />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Powerful Features
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Everything you need to extract maximum value from your meetings, powered by advanced AI.
          </p>
        </div>
        
        <BentoFeatures />

        <div className="mt-24 space-y-20 text-muted max-w-4xl mx-auto">
          
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Detailed Feature Breakdown</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Automated Meeting Summaries</h3>
                <p className="leading-relaxed">
                  Our advanced AI (powered by Gemini) instantly digests the entirety of your meeting transcript and distills it into a concise, easily readable executive summary. You get the essence of the conversation in seconds, ensuring that stakeholders who missed the meeting can catch up instantly without watching a 60-minute recording.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">High-Fidelity AI Transcription</h3>
                <p className="leading-relaxed">
                  Utilizing Faster Whisper, our system processes audio locally on our secure servers to generate highly accurate transcripts across 99+ languages. It handles technical jargon, cross-talk, and thick accents effortlessly. Every word is timestamped so you can verify exactly what was said and when.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Action Item Extraction</h3>
                <p className="leading-relaxed">
                  Never let a task slip through the cracks again. MeetMind AI automatically detects promises, next steps, and assignments made during the meeting and compiles them into a structured checklist. It extracts the context around the task, providing absolute clarity on responsibilities.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Enterprise & Business Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">Sales & Discovery Calls</h3>
                <p className="text-sm">Instead of furiously typing notes during a prospect call, sales reps can focus 100% on the client. MeetMind AI captures the pain points, budget discussions, and next steps automatically.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">Product & Engineering Syncs</h3>
                <p className="text-sm">Capture technical decisions, architecture choices, and sprint planning action items without slowing down the conversation. Easily export these decisions directly to Jira or GitHub issues.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">User Research Interviews</h3>
                <p className="text-sm">Generate verbatim transcripts of user interviews. Use our AI Chat Assistant to query across the interview ("What did they say about the onboarding flow?") to extract insights instantly.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">Executive Board Meetings</h3>
                <p className="text-sm">Maintain flawless, objective records of board meetings. Generate formal meeting minutes and secure them with enterprise-grade Row-Level Security.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">MeetMind AI vs. Manual Workflows</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="py-4 px-4 font-semibold text-foreground">Feature</th>
                    <th className="py-4 px-4 font-semibold text-foreground">MeetMind AI</th>
                    <th className="py-4 px-4 font-semibold text-foreground">Manual Note-Taking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  <tr>
                    <td className="py-4 px-4">Accuracy</td>
                    <td className="py-4 px-4 text-green-400">Verbatim capture, zero bias</td>
                    <td className="py-4 px-4 text-red-400">Prone to human error & fatigue</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Time Spent</td>
                    <td className="py-4 px-4 text-green-400">2-3 minutes per meeting</td>
                    <td className="py-4 px-4 text-red-400">30-45 minutes of formatting</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Searchability</td>
                    <td className="py-4 px-4 text-green-400">Instant semantic search</td>
                    <td className="py-4 px-4 text-red-400">Scattered docs & notebooks</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Action Items</td>
                    <td className="py-4 px-4 text-green-400">Automatically extracted</td>
                    <td className="py-4 px-4 text-red-400">Often forgotten or misassigned</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Do you support Zoom, Teams, and Google Meet?</h3>
                <p className="mt-2">Yes. You can upload the audio or video recording file from any of these platforms. We support MP4, M4A, MP3, and WAV files.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Is there a limit to meeting length?</h3>
                <p className="mt-2">Free tier users can upload meetings up to 45 minutes in length. Premium users can upload meetings up to 4 hours long.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">How does the AI Chat Assistant work?</h3>
                <p className="mt-2">Once your meeting is processed, you can chat with it just like ChatGPT. You can ask "What was the final decision on the marketing budget?" and the AI will scan the transcript and answer you instantly based solely on the meeting context.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
