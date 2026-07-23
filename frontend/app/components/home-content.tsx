export default function HomeContent() {
  // ponytail: static, boring semantic HTML for SEO. No interactive state needed here.
  return (
    <div className="mt-20 max-w-4xl mx-auto space-y-16 text-muted">
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">What MeetMind AI Does</h2>
        <p className="leading-relaxed">
          MeetMind AI is a state-of-the-art meeting transcription and summarization platform. It automatically processes your audio and video recordings, converts them into highly accurate text using Whisper AI, and leverages advanced language models (Gemini) to extract executive summaries, key decisions, and actionable items. Instead of taking manual notes, teams can focus on the conversation while our AI handles the documentation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Why Teams Use MeetMind AI</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Time Savings:</strong> Automate hours of manual note-taking and formatting.</li>
          <li><strong>Perfect Recall:</strong> Never forget a decision or lose track of a crucial detail from past discussions.</li>
          <li><strong>Alignment:</strong> Ensure every participant (and those who couldn't attend) has the exact same context.</li>
          <li><strong>Searchability:</strong> Turn hours of spoken audio into a fully searchable text database.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Supported Platforms & Formats</h2>
        <p className="leading-relaxed">
          You can upload recordings from any major platform, including Zoom, Microsoft Teams, Google Meet, and Webex. We support standard audio and video formats such as MP3, MP4, WAV, and M4A. Simply record your meeting locally or to the cloud, download the file, and drag it into MeetMind AI.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Security & Privacy First</h2>
        <p className="leading-relaxed">
          We understand that meetings contain sensitive business intelligence. MeetMind AI employs strict data protection protocols. Audio files are processed securely and deleted immediately after transcription. We do not use your private transcripts to train our AI models, and all stored data is secured using Row-Level Security (RLS) policies to guarantee that only authorized users can access it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">How accurate is the transcription?</h3>
            <p className="text-sm mt-1">We use advanced AI models trained on vast amounts of multilingual data, achieving near-human accuracy even in noisy environments or with heavy accents.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Is my data used for AI training?</h3>
            <p className="text-sm mt-1">No. Your transcripts and audio files are strictly your property. We never use user data to fine-tune our models.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Can I export my notes?</h3>
            <p className="text-sm mt-1">Yes, you can export your summaries, action items, and transcripts as Markdown or TXT files instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
