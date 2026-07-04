import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions governing your use of MeetMind AI.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-muted">
          Effective Date: 04 July 2026 &middot; Last Updated: 04 July 2026
        </p>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of
            MeetMind AI. By accessing or using the service, you agree to be
            bound by these Terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            1. Eligibility
          </h2>
          <p>
            You must be at least 16 years old to use MeetMind AI. By creating
            an account, you represent that you meet this requirement and that
            the information you provide is accurate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            2. User Accounts
          </h2>
          <p>
            You are responsible for maintaining the security of your account
            credentials. You must not share your account with others. You are
            responsible for all activity that occurs under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            3. Acceptable Use
          </h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload illegal, harmful, or malicious content.</li>
            <li>
              Use the service to generate content that is hateful,
              threatening, or harassing.
            </li>
            <li>Attempt to reverse engineer the application.</li>
            <li>Circumvent usage limits or abuse API endpoints.</li>
            <li>
              Upload copyrighted material without appropriate permission.
            </li>
            <li>Use the service for any unlawful purpose.</li>
          </ul>
          <p className="mt-3">
            For full details, see our{" "}
            <a
              href="/legal/acceptable-use"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Acceptable Use Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            4. AI-Generated Output Disclaimer
          </h2>
          <p>
            MeetMind AI uses artificial intelligence to generate transcripts,
            summaries, action items, and chat responses. AI-generated outputs
            may be inaccurate, incomplete, or unsuitable for professional,
            legal, medical, or financial decisions. You are responsible for
            verifying all outputs before relying on them. We do not guarantee
            the accuracy of any AI-generated content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            5. Subscriptions and Payments
          </h2>
          <p className="mb-3">
            MeetMind AI offers a free tier with limited usage and paid
            subscription plans with higher limits. Payments are processed
            through Razorpay.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Subscription fees are charged as described at the time of
              purchase.
            </li>
            <li>
              Refund requests are handled on a case-by-case basis. Contact us
              within 7 days of payment for refund inquiries.
            </li>
            <li>
              We reserve the right to change pricing with reasonable notice.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            6. Intellectual Property
          </h2>
          <p className="mb-3">
            You retain ownership of the audio files you upload and the meeting
            content derived from them. We do not claim ownership of your
            content.
          </p>
          <p>
            The MeetMind AI application, including its design, code, branding,
            and AI models, remains the intellectual property of MeetMind AI.
            You may not copy, modify, distribute, or reverse engineer any part
            of the application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            7. Service Availability
          </h2>
          <p>
            We strive to keep MeetMind AI available at all times, but we do
            not guarantee uninterrupted access. The service may be temporarily
            unavailable due to maintenance, updates, or circumstances beyond
            our control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, MeetMind AI and its
            developer shall not be liable for any indirect, incidental,
            special, or consequential damages arising from your use of the
            service. The service is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, express or
            implied.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            9. Account Suspension and Termination
          </h2>
          <p>
            We may suspend or terminate your account if you violate these
            Terms or our Acceptable Use Policy. We will make reasonable
            efforts to notify you before taking action, except in cases of
            severe violations. Upon termination, your right to use the service
            ceases immediately, and your data may be deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            10. Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of India. Any disputes
            arising from these Terms shall be subject to the exclusive
            jurisdiction of the courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            11. Updates to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. Changes will be
            posted on this page with an updated &quot;Last Updated&quot; date.
            Continued use of the service after changes constitutes acceptance
            of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            12. Contact
          </h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:meetmindai.help@gmail.com"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              meetmindai.help@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
