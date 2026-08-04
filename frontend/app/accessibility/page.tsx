import Link from "next/link";
import GradientBackground from "@/app/components/gradient-background";

export const metadata = {
  title: "Accessibility Statement | MeetMind AI",
  description: "Learn about MeetMind AI's commitment to web accessibility toward WCAG 2.1 AA guidelines and current framework accessibility features.",
  alternates: {
    canonical: "/accessibility",
  },
};

export default function AccessibilityStatementPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Accessibility Statement</span>
        </nav>

        <div className="glass-card p-8 md:p-12 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
            Accessibility Statement
          </h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            MeetMind AI is committed to ensuring digital accessibility for people of all abilities. We continuously improve the user experience for everyone and apply relevant accessibility standards toward <strong>WCAG 2.1 Level AA</strong> compliance.
          </p>

          <div className="space-y-8 text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Accessibility Measures Implemented</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Keyboard Navigation:</strong> All interactive elements, including file drop-zones, navigation links, buttons, and theme toggles, support keyboard focus and standard tab interactions.</li>
                <li><strong>Visible Focus Indicators:</strong> High-contrast focus rings (`focus-visible:outline`) are enforced across interactive controls to aid keyboard users.</li>
                <li><strong>Semantic HTML:</strong> Pages use standard HTML5 structural elements (<code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;article&gt;</code>) and appropriate heading hierarchy (<code>&lt;h1&gt;</code> through <code>&lt;h3&gt;</code>).</li>
                <li><strong>Reduced Motion Support:</strong> CSS keyframe animations respect system prefers-reduced-motion preferences (`@media (prefers-reduced-motion: reduce)`).</li>
                <li><strong>Color Contrast & Dark Mode:</strong> Text styles and background card contrasts adhere to readable ratio recommendations across both light and dark themes.</li>
                <li><strong>Alternative Text:</strong> Functional icons and product images include descriptive alt text and `aria-hidden` attributes for decorative SVG assets.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Documented Framework Limitations & Known Gaps</h2>
              <p>
                While we strive for comprehensive accessibility, certain complex dynamic components (such as interactive audio waveforms and dynamic modal dialogs) are continuously undergoing refinement. We actively audit third-party dependencies to eliminate ARIA attribute mismatches.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Feedback & Assistance</h2>
              <p>
                If you encounter accessibility barriers on MeetMind AI or require assistance accessing content in an alternative format, please email founder Abhishek at <a href="mailto:meetmindai.help@zohomail.in" className="text-purple-400 hover:underline">meetmindai.help@zohomail.in</a>. We respond to feedback promptly and prioritize fixes in upcoming release updates.
              </p>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/help-center" className="glass-card px-6 py-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors">
            Help Center & Product Specs →
          </Link>
          <Link href="/contact" className="glass-card px-6 py-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors">
            Contact Support →
          </Link>
        </div>
      </div>
    </main>
  );
}
