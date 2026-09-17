import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Integrations & Export Workflows | MeetMind AI",
  description: "Learn how to use MeetMind AI notes with Slack, Notion, Jira, and team tools using structured Markdown and TXT exports.",
  openGraph: {
    title: "Integrations & Export Workflows | MeetMind AI",
    description: "Export and copy structured meeting notes into Slack, Notion, Jira, and your team tools.",
    url: "https://www.meetmindai.co.in/integrations",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.meetmindai.co.in/integrations",
  },
};

const integrations = [
  {
    name: "Zoom Recordings",
    description: "Upload Zoom local and cloud audio/video recordings (.mp4, .m4a) directly for instant processing.",
    status: "File Import",
    icon: "https://cdn.worldvectorlogo.com/logos/zoom-app.svg"
  },
  {
    name: "Google Meet",
    description: "Process Google Meet recording files (.mp4, .webm) downloaded from your Google Drive.",
    status: "File Import",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Google_Meet_icon_%282020%29.svg"
  },
  {
    name: "Microsoft Teams",
    description: "Upload recordings and voice memos from Microsoft Teams calls (.mp4, .wav, .m4a).",
    status: "File Import",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg"
  },
  {
    name: "Slack",
    description: "Copy cleanly formatted executive summaries and next steps to share directly in team channels.",
    status: "Copy & Share",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"
  },
  {
    name: "Notion",
    description: "Export structured Markdown notes and meeting minutes straight into your Notion team documentation.",
    status: "Markdown Export",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
  },
  {
    name: "Jira & Task Trackers",
    description: "Copy extracted action item checklists and context to populate backlog tickets and sprint tasks.",
    status: "Checklist Export",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg"
  }
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-white/5 bg-surface/30">
        <div className="mx-auto max-w-5xl px-6 py-4 sm:px-8 lg:px-8">
          <nav className="flex text-sm text-muted" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">›</span>
                  <span className="text-foreground font-medium" aria-current="page">Integrations</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Works Alongside Your Existing Tools
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Upload recordings from any video conferencing platform and export structured notes, summaries, and action items directly into your workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {integrations.map((integration) => (
            <div key={integration.name} className="rounded-2xl border border-card-border bg-surface p-6 flex flex-col hover:border-foreground/20 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={integration.icon} alt={`${integration.name} logo`} className="w-full h-full object-contain" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${integration.status === 'File Import' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' : 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'}`}>
                  {integration.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{integration.name}</h3>
              <p className="text-sm text-muted mb-6 flex-1">{integration.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface/50 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to streamline your post-meeting follow-ups?
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Upload your first meeting recording and export structured summaries and action items in seconds.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-4 text-base font-semibold text-white shadow-sm hover:scale-[1.03] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
          >
            Try MeetMind AI for free
          </Link>
        </div>
      </div>
    </div>
  );
}
