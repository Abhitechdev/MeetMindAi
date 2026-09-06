import { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Contact MeetMind AI | Support, Billing & Privacy Help",
  description: "Get in touch with MeetMind AI support for general inquiries, billing help, data privacy requests, feedback, or bug reports.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact MeetMind AI | Support, Billing & Privacy Help",
    description: "Get in touch with MeetMind AI support for general inquiries, billing, and privacy requests.",
    url: "https://www.meetmindai.co.in/contact",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact MeetMind AI | Support, Billing & Privacy Help",
    description: "Get in touch with MeetMind AI support for general inquiries, billing, and privacy requests.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact MeetMind AI",
  description: "Contact page for MeetMind AI customer support, billing assistance, and privacy inquiries.",
  url: "https://www.meetmindai.co.in/contact",
  mainEntity: {
    "@type": "Organization",
    name: "MeetMind AI",
    url: "https://www.meetmindai.co.in",
    contactPoint: {
      "@type": "ContactPoint",
      email: "meetmindai.help@zohomail.in",
      contactType: "customer support",
      availableLanguage: ["English"],
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  );
}
