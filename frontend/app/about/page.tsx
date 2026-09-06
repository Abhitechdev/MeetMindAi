import { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About MeetMind AI | Founder Story, Architecture & Mission",
  description: "Learn about MeetMind AI, our founder Abhishek, our mission to build objective memory for modern teams, and our privacy-first engineering standards.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About MeetMind AI | Founder Story, Architecture & Mission",
    description: "Learn about MeetMind AI, our founder Abhishek, and our privacy-first engineering standards.",
    url: "https://www.meetmindai.co.in/about",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About MeetMind AI | Founder Story, Architecture & Mission",
    description: "Learn about MeetMind AI, our founder Abhishek, and our privacy-first engineering standards.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About MeetMind AI",
  description: "MeetMind AI is a privacy-first meeting intelligence tool founded by developer Abhishek to automate transcription, action item extraction, and decision tracking.",
  url: "https://www.meetmindai.co.in/about",
  mainEntity: {
    "@type": "Organization",
    name: "MeetMind AI",
    founder: {
      "@type": "Person",
      name: "Abhishek",
      jobTitle: "Founder & Lead Developer",
      url: "https://www.meetmindai.co.in/authors/abhishek",
    },
    url: "https://www.meetmindai.co.in",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}
