import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Mic, ShieldCheck, FileText, HelpCircle } from "lucide-react";
import GradientBackground from "../components/gradient-background";

export const metadata: Metadata = {
  title: "Help Center & Technical Specifications | MeetMind AI",
  description: "Comprehensive Help Center for MeetMind AI. Explore supported audio/video formats, 100MB file limits, processing flows, privacy practices, and troubleshooting guides.",
  alternates: {
    canonical: "https://www.meetmindai.co.in/help-center",
  },
};

export default function HelpCenterPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex text-sm text-muted mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-muted">/</span>
                <span className="text-foreground font-medium" aria-current="page">Help Center</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Help Center & Technical Guides
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Find answers to audio upload limits, supported file formats, AI processing modes, privacy practices, and troubleshooting steps.
          </p>
        </div>

        {/* Technical Category Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card p-6 flex flex-col">
            <Mic className="h-8 w-8 text-accent-purple mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Supported File Formats</h2>
            <p className="text-xs text-muted leading-relaxed">
              Upload recordings in <strong>MP3, WAV, M4A, MP4, WEBM, MOV, and AVI</strong>. Maximum file size per upload is <strong>100MB</strong> on all plans.
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <FileText className="h-8 w-8 text-accent-blue mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Transcription Modes</h2>
            <p className="text-xs text-muted leading-relaxed">
              Choose between <strong>Fast Mode</strong> (rapid speech-to-text + Gemini insights) and <strong>Speaker Detection Mode</strong> (diarization for multi-person calls).
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Data Privacy & Security</h2>
            <p className="text-xs text-muted leading-relaxed">
              Audio files are processed securely using TLS encryption in transit and Supabase Row-Level Security. Private transcripts are never used to train public models.
            </p>
          </div>
        </div>

        {/* Detailed Technical Specs & Troubleshooting Section */}
        <div className="space-y-8 mb-16">
          <div className="glass-card p-8 md:p-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Technical Questions</h2>
            
            <div className="space-y-6 text-sm text-muted leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground text-base mb-1">What happens if my file exceeds 100MB?</h3>
                <p>Files larger than 100MB will trigger a validation alert in the upload zone. We recommend compressing large video files to audio-only MP3/M4A format using free converters before uploading.</p>
              </div>

              <div className="pt-4 border-t border-card-border">
                <h3 className="font-semibold text-foreground text-base mb-1">How fast is processing?</h3>
                <p>Processing time depends on audio duration and selected mode. Typically, a 30-minute recording is transcribed and summarized in 30 to 60 seconds.</p>
              </div>

              <div className="pt-4 border-t border-card-border">
                <h3 className="font-semibold text-foreground text-base mb-1">What languages are supported?</h3>
                <p>MeetMind AI supports over 20 languages including English, Spanish, French, German, Portuguese, Italian, Dutch, Japanese, Korean, Chinese, Hindi, Tamil, Telugu, and more with automatic language detection.</p>
              </div>

              <div className="pt-4 border-t border-card-border">
                <h3 className="font-semibold text-foreground text-base mb-1">Troubleshooting: What if an upload fails?</h3>
                <p>If an upload stalls, ensure your internet connection is stable and verify that your browser supports HTML5 Web Audio APIs (Chrome, Safari, Firefox, Edge). Clear browser cache or retry in an incognito window if issues persist.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-8 sm:p-12 text-center border-purple-500/20 bg-purple-500/5">
          <LifeBuoy className="mx-auto h-10 w-10 text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Have additional technical questions?
          </h2>
          <p className="text-sm text-muted mb-6 max-w-xl mx-auto">
            Contact founder Abhishek directly for assistance with custom workflows or technical support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] transition-transform"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-xl bg-surface border border-card-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              View Full FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
