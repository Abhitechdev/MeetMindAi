import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Understand the rules for using MeetMind AI, including prohibited activities and our enforcement process.",
};

export default function AcceptableUsePolicyPage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Acceptable Use Policy
        </h1>
        <p className="text-sm text-muted">
          Effective Date: 04 July 2026 &middot; Last Updated: 04 July 2026
        </p>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <p>
            This Acceptable Use Policy (&quot;Policy&quot;) defines the rules
            for using MeetMind AI. By using the service, you agree to comply
            with this Policy. Violations may result in account suspension or
            termination.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            1. Prohibited Content
          </h2>
          <p className="mb-3">
            You must not upload, generate, or distribute content that is:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Illegal under applicable law.</li>
            <li>
              Hateful, discriminatory, or promotes violence against any
              individual or group.
            </li>
            <li>
              Sexually explicit, especially any content involving minors.
            </li>
            <li>Threatening, harassing, or intended to intimidate.</li>
            <li>
              Designed to facilitate fraud, phishing, or financial crime.
            </li>
            <li>Malware, viruses, or other harmful software.</li>
            <li>
              Copyrighted material uploaded without appropriate permission.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            2. Prohibited Behavior
          </h2>
          <p className="mb-3">You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Attempt to manipulate, bypass, or &quot;jailbreak&quot; the
              AI&apos;s safety systems or content filters.
            </li>
            <li>
              Use prompt injection techniques to extract system instructions
              or alter AI behavior.
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any part of the
              application.
            </li>
            <li>
              Circumvent usage limits, rate limits, or subscription
              restrictions.
            </li>
            <li>
              Use automated tools to scrape data or abuse API endpoints.
            </li>
            <li>
              Impersonate another person or misrepresent your identity.
            </li>
            <li>
              Use the service for spam, bulk messaging, or unsolicited
              outreach.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            3. Rate Limits and Fair Use
          </h2>
          <p>
            MeetMind AI enforces rate limits and usage quotas to ensure fair
            access for all users. Attempting to circumvent these limits,
            whether through automated requests, multiple accounts, or other
            means, is a violation of this Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            4. Violation Detection
          </h2>
          <p>We may detect violations through:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Automated monitoring and filtering systems.</li>
            <li>User reports submitted to our support email.</li>
            <li>Manual review when automated systems flag activity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            5. Enforcement
          </h2>
          <p className="mb-3">
            When a violation is confirmed, we follow a graduated enforcement
            process:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Warning:</strong> for first-time or minor violations,
              we will notify you and request corrective action.
            </li>
            <li>
              <strong>Temporary suspension:</strong> for repeated or
              moderate violations, your account may be suspended for a
              defined period.
            </li>
            <li>
              <strong>Permanent ban:</strong> for severe violations, or
              continued violations after a suspension, your account will be
              permanently terminated and your data deleted.
            </li>
          </ol>
          <p className="mt-3">
            We reserve the right to skip steps in this process for severe
            violations that pose an immediate risk to other users or the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            6. Appeals
          </h2>
          <p>
            If you believe your account was wrongly suspended or terminated,
            you may appeal by emailing{" "}
            <a
              href="mailto:meetmindai.help@zohomail.in"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              meetmindai.help@zohomail.in
            </a>{" "}
            with your account email and a description of the situation. We will
            review appeals within 14 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            7. Law Enforcement
          </h2>
          <p>
            We cooperate with law enforcement authorities where legally
            required. We may report illegal activity and provide relevant
            information in response to valid legal requests.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            8. Contact
          </h2>
          <p>
            To report a violation or ask questions about this Policy, email{" "}
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
