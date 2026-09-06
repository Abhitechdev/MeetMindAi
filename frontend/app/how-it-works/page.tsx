import { Metadata } from "next";
import HowItWorksContent from "./how-it-works-content";

export const metadata: Metadata = {
  title: "How It Works | Audio Transcription to AI Action Items | MeetMind AI",
  description: "Learn how MeetMind AI transforms recorded meetings into accurate transcripts, executive summaries, decisions, and action items in four simple steps.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | MeetMind AI",
    description: "Four simple steps to transform your meeting recordings into actionable insights.",
    url: "https://www.meetmindai.co.in/how-it-works",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | MeetMind AI",
    description: "Four simple steps to transform your meeting recordings into actionable insights.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Transcribe and Summarize Meetings with MeetMind AI",
  description: "A 4-step workflow to convert raw meeting audio into transcripts, executive summaries, and action items.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Recording",
      text: "Record your meeting locally or via your video conference platform and upload the audio or video file (up to 100MB) directly to MeetMind AI.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "AI Transcription",
      text: "Our transcription pipeline uses Whisper and Deepgram models to convert spoken words into an accurate, timestamped transcript.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Meeting Summary & Action Items",
      text: "Language models digest the full transcript to extract executive summaries, key decisions, and a categorized action item checklist.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Query, Review & Export",
      text: "Ask questions grounded in the meeting context with the AI assistant, and export structured notes to Markdown or TXT.",
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HowItWorksContent />
    </>
  );
}
