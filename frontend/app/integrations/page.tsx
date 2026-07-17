import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Integrations | MeetMind AI",
  description: "Connect MeetMind AI with your favorite tools. Seamlessly export meeting notes and action items to Slack, Notion, Jira, and more.",
  openGraph: {
    title: "Integrations | MeetMind AI",
    description: "Connect MeetMind AI with your favorite tools.",
    url: "https://meetmindai.co.in/integrations",
    siteName: "MeetMind AI",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://meetmindai.co.in/integrations",
  },
};

const integrations = [
  {
    name: "Slack",
    description: "Instantly share meeting summaries and action items in your team's Slack channels.",
    status: "Available",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"
  },
  {
    name: "Notion",
    description: "Sync your meeting transcripts and executive summaries directly into your Notion workspace.",
    status: "Available",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
  },
  {
    name: "Zoom",
    description: "Upload Zoom local and cloud recordings directly to MeetMind AI for instant processing.",
    status: "Available",
    icon: "https://cdn.worldvectorlogo.com/logos/zoom-app.svg"
  },
  {
    name: "Google Meet",
    description: "Process Google Meet recordings seamlessly through your Google Drive integration.",
    status: "Available",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Google_Meet_icon_%282020%29.svg"
  },
  {
    name: "Jira",
    description: "Turn action items from your engineering standups directly into Jira tickets.",
    status: "Coming Soon",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg"
  },
  {
    name: "HubSpot",
    description: "Log discovery call transcripts and key decisions automatically into HubSpot CRM.",
    status: "Coming Soon",
    icon: "https://cdn.worldvectorlogo.com/logos/hubspot.svg"
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
            Works Where You Work
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Connect MeetMind AI with your existing tools to automate your workflow completely. No more copying and pasting.
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
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${integration.status === 'Available' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-400'}`}>
                  {integration.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{integration.name}</h3>
              <p className="text-sm text-muted mb-6 flex-1">{integration.description}</p>
              
              <div className="flex items-center text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {integration.status === 'Available' ? 'View Guide' : 'Get Notified'} <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface/50 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to save time in your meetings?
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Start pushing your automated notes directly into your favorite tools.
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
