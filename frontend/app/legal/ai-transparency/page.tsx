import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Transparency",
  description:
    "Understand how MeetMind AI uses artificial intelligence, what models power it, and how your data flows through the system.",
};

export default function AITransparencyPage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          AI Transparency
        </h1>
        <p className="text-sm text-muted">
          Effective Date: 04 July 2026 &middot; Last Updated: 04 July 2026
        </p>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <p>
            MeetMind AI uses artificial intelligence to transcribe meeting
            recordings, generate summaries, extract action items, and answer
            follow-up questions. This page explains how AI is used, what models
            power the service, and how your data flows through the system.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            1. AI Models Used
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Faster Whisper</strong> (self-hosted): an open-source
              speech-to-text model used for audio transcription. This model
              runs on our own servers. Your audio is not sent to any external
              service for transcription.
            </li>
            <li>
              <strong>Llama 3.3 70B via NVIDIA NIM API:</strong> a large
              language model used for generating meeting summaries, extracting
              key decisions and action items, and powering the chat feature.
              Transcript text (not audio) is sent to NVIDIA&apos;s API for
              processing.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            2. Data Flow
          </h2>
          <p className="mb-4">
            Here is how your data moves through the system:
          </p>
          <div className="glass-card p-6 font-mono text-sm space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-purple shrink-0" />
              <span>You upload an audio file</span>
            </div>
            <div className="pl-4 border-l border-card-border ml-[3px] py-1">
              <span className="text-muted text-xs">processed locally</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-purple shrink-0" />
              <span>Faster Whisper transcribes audio to text on our servers</span>
            </div>
            <div className="pl-4 border-l border-card-border ml-[3px] py-1">
              <span className="text-muted text-xs">transcript text sent to NVIDIA NIM</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-purple shrink-0" />
              <span>Llama 3.3 generates summary, decisions, and action items</span>
            </div>
            <div className="pl-4 border-l border-card-border ml-[3px] py-1">
              <span className="text-muted text-xs">results stored in your account</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-purple shrink-0" />
              <span>Results displayed to you</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            3. AI Limitations
          </h2>
          <p className="mb-3">AI-generated outputs have inherent limitations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Transcripts may contain errors, especially with accents,
              background noise, overlapping speakers, or technical terminology.
            </li>
            <li>
              Summaries, action items, and decisions are AI-interpreted and may
              miss context, misattribute statements, or include inaccuracies
              (sometimes called &quot;hallucinations&quot;).
            </li>
            <li>
              Chat responses are based on the transcript and summary, and may
              not accurately reflect what was discussed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            4. Human Verification
          </h2>
          <p>
            We strongly recommend that you review and verify all AI-generated
            outputs before using them for any decision-making, reporting, or
            professional purpose. MeetMind AI does not include human review or
            moderation of outputs. All results are generated entirely by AI.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            5. Data and Model Training
          </h2>
          <p>
            Your audio, transcripts, summaries, and chat messages are not used
            to train or fine-tune any AI model. Your data is used solely to
            provide the service to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            6. Use Restrictions
          </h2>
          <p>
            MeetMind AI is designed for meeting analysis and productivity. It
            is not intended for, and should not be relied upon for, medical
            diagnosis, legal advice, financial decisions, or any other
            professional advice requiring certified expertise.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            7. Reporting Issues
          </h2>
          <p>
            If you encounter an incorrect, misleading, or harmful AI output,
            please report it to{" "}
            <a
              href="mailto:meetmindai.help@gmail.com"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              meetmindai.help@gmail.com
            </a>
            . Include the meeting ID and a description of the issue so we can
            investigate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            8. Responsible AI
          </h2>
          <p>
            We are committed to using AI responsibly. We select models and
            providers that align with responsible AI practices, and we
            continuously evaluate the quality and safety of AI outputs in our
            service.
          </p>
        </section>
      </div>
    </>
  );
}
