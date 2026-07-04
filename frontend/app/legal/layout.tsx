import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | MeetMind AI",
    default: "Legal | MeetMind AI",
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {children}
    </article>
  );
}
