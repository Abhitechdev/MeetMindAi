import { Metadata } from "next";
import BentoFeatures from "../components/bento-features";
import GradientBackground from "../components/gradient-background";

export const metadata: Metadata = {
  alternates: {
    canonical: '/features',
  },
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
                  Our advanced AI models analyze the entirety of your meeting transcript and distill it into a concise, easily readable executive summary. You get the essence of the conversation in seconds, ensuring that stakeholders who missed the meeting can catch up instantly without listening to a long recording.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">High-Fidelity AI Transcription</h3>
                <p className="text-muted leading-relaxed">
                  Utilizing Whisper-large-v3-turbo and speaker detection models, our system processes audio to generate accurate, timestamped transcripts across multiple languages. It handles technical terminology and diverse accents. Every word is timestamped so you can verify exactly what was said and when.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Action Item Extraction</h3>
                <p className="leading-relaxed">
                  Never let a task slip through the cracks again. MeetMind AI automatically detects promises, next steps, and assignments mentioned during the meeting and compiles them into a structured checklist with context on responsibilities.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Enterprise & Business Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">Sales & Discovery Calls</h3>
                <p className="text-sm">Instead of typing notes during a prospect call, focus on the client. MeetMind AI captures pain points, budget discussions, and next steps automatically.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">Product & Engineering Syncs</h3>
                <p className="text-sm">Capture technical decisions, architecture choices, and sprint planning action items without slowing down the conversation. Export structured Markdown notes and action items for your team boards.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">User Research Interviews</h3>
                <p className="text-sm">Generate timestamped transcripts of user interviews. Use our AI Chat Assistant to query across the interview (&quot;What did they say about the onboarding flow?&quot;) to extract insights directly.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-3">Executive Board Meetings</h3>
                <p className="text-sm">Maintain clear, objective records of board meetings. Generate structured meeting minutes and keep them secure with encrypted storage and Row-Level Security.</p>
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
                    <td className="py-4 px-4 text-green-400">Timestamped capture, objective records</td>
                    <td className="py-4 px-4 text-red-400">Prone to human error & fatigue</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Time Spent</td>
                    <td className="py-4 px-4 text-green-400">Under 1 minute processing time</td>
                    <td className="py-4 px-4 text-red-400">30-45 minutes of manual typing</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Searchability</td>
                    <td className="py-4 px-4 text-green-400">Instant AI query & full-text search</td>
                    <td className="py-4 px-4 text-red-400">Scattered docs & notebooks</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Action Items</td>
                    <td className="py-4 px-4 text-green-400">Automatically extracted checklist</td>
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
                <p className="mt-2">Yes. You can upload the audio or video recording file from any of these platforms. We support MP3, WAV, M4A, MP4, WEBM, MOV, and AVI files up to 100MB.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Is there a limit to meeting length and file size?</h3>
                <p className="mt-2">Files up to 100MB are supported per upload. Free tier accounts include 3 free meetings to try the service, and Pro accounts include 100 meetings with priority processing.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">How does the AI Chat Assistant work?</h3>
                <p className="mt-2">Once your meeting is processed, you can ask questions about the discussion. The assistant searches the transcript and summary context to answer questions like &quot;What was the decision on the project deadline?&quot; based solely on the recorded conversation.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
