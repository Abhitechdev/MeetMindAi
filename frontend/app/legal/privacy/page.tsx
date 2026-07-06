import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how MeetMind AI collects, stores, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted">
          Effective Date: 04 July 2026 &middot; Last Updated: 04 July 2026
        </p>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <p>
            MeetMind AI (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            what information we collect, how we use it, and your rights
            regarding that information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            1. Information We Collect
          </h2>
          <p className="mb-3">
            We collect the following categories of information when you use
            MeetMind AI:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account information:</strong> name, email address, and
              authentication data provided during sign-up via Supabase Auth.
            </li>
            <li>
              <strong>Audio uploads:</strong> meeting recordings you upload for
              transcription and analysis.
            </li>
            <li>
              <strong>Meeting data:</strong> transcripts, summaries, action
              items, decisions, and chat messages generated from your
              recordings.
            </li>
            <li>
              <strong>User prompts:</strong> questions and messages you send to
              the AI chat feature.
            </li>
            <li>
              <strong>Usage data:</strong> processing counts, plan tier, and
              feature usage.
            </li>
            <li>
              <strong>Analytics data:</strong> page views, session data, and
              device information collected by Google Analytics (when enabled).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Transcribe and analyze your meeting recordings.</li>
            <li>Generate summaries, action items, and insights using AI.</li>
            <li>Provide the AI chat feature for follow-up questions.</li>
            <li>Manage your account and enforce usage limits.</li>
            <li>Process payments for subscription upgrades.</li>
            <li>Improve and maintain the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            3. Third-Party Services
          </h2>
          <p className="mb-3">
            We use the following third-party services to operate MeetMind AI:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase:</strong> authentication, database, and data
              storage.
            </li>
            <li>
              <strong>NVIDIA NIM API:</strong> transcript text (not audio) is
              sent to NVIDIA&apos;s API for AI-powered summarization and chat.
              See our{" "}
              <a
                href="/legal/ai-transparency"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                AI Transparency
              </a>{" "}
              page for details.
            </li>
            <li>
              <strong>Razorpay:</strong> payment processing for subscription
              plans. We do not store your payment card details.
            </li>
            <li>
              <strong>Google Analytics:</strong> anonymized usage analytics to
              understand how the service is used.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            4. AI Data Handling
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Audio transcription is performed using Faster Whisper, a
              self-hosted model. Your audio files are processed on our servers
              and are not sent to any third party.
            </li>
            <li>
              Transcript text is sent to NVIDIA NIM API (Llama 3.3 70B) for
              summarization and chat responses.
            </li>
            <li>
              Your data is not used to train or fine-tune any AI model.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            5. Data Storage and Retention
          </h2>
          <p className="mb-3">
            Your meeting data (transcripts, summaries, action items) is stored
            in our Supabase database and is associated with your account. Audio
            files are processed and may be retained temporarily for
            transcription. You can delete your meeting history at any time from
            within the application.
          </p>
          <p>
            If you delete your account, all associated data will be permanently
            removed within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            6. Security
          </h2>
          <p>
            We use industry-standard security measures including encrypted
            connections (HTTPS), secure authentication via Supabase, and
            row-level security (RLS) policies to ensure that users can only
            access their own data. No system is perfectly secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            7. Your Rights
          </h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data and account.</li>
            <li>Export your meeting data.</li>
            <li>Withdraw consent for data processing.</li>
          </ul>
          <p className="mt-3">
            If you are located in the EU (GDPR), India (DPDP Act), or
            California (CCPA), you may have additional rights under applicable
            law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p>
            MeetMind AI is not intended for use by individuals under the age of
            16. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            9. Policy Updates
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will
            be posted on this page with an updated &quot;Last Updated&quot;
            date. Continued use of the service after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            10. Contact
          </h2>
          <p>
            For privacy-related questions or requests, contact us at{" "}
            <a
              href="mailto:meetmindai.help@zohomail.in"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              meetmindai.help@zohomail.in
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
