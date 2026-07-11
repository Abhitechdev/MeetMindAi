import Link from "next/link";
import { Metadata } from "next";
import { getAllArticles } from "../../lib/mdx";
import GradientBackground from "../components/gradient-background";

export const metadata: Metadata = {
  title: "MeetMind AI Blog | AI Productivity & Meeting Intelligence",
  description: "Read the latest insights on AI meeting assistants, productivity tips, transcription technology, and how to optimize your business communication.",
  openGraph: {
    title: "MeetMind AI Blog | AI Productivity & Meeting Intelligence",
    description: "Read the latest insights on AI meeting assistants, productivity tips, and how to optimize your business communication.",
    type: "website",
  },
};

export default async function BlogIndex() {
  const articles = getAllArticles();

  return (
    <main className="relative min-h-screen pb-24">
      <GradientBackground />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            MeetMind AI <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover actionable advice, deep technical dives, and industry trends on how Artificial Intelligence is transforming meetings and productivity.
          </p>
        </header>

        {/* Structured JSON-LD for the Blog List */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "MeetMind AI Blog",
              "url": "https://meet-mind-ai-three.vercel.app/blog",
              "description": metadata.description,
              "blogPost": articles.map(article => ({
                "@type": "BlogPosting",
                "headline": article.title,
                "url": `https://meet-mind-ai-three.vercel.app/blog/${article.slug}`,
                "datePublished": article.publishedAt
              }))
            })
          }}
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article 
              key={article.slug} 
              className="glass-card glass-card-hover flex flex-col justify-between p-6 rounded-2xl overflow-hidden relative group"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-muted mb-4">
                  <span className="px-2 py-1 rounded-full bg-accent-purple/10 text-accent-purple font-medium">
                    {article.category}
                  </span>
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                
                <h2 className="text-xl font-semibold text-foreground mb-3 leading-snug group-hover:text-accent-blue transition-colors">
                  <Link href={`/blog/${article.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {article.title}
                  </Link>
                </h2>
                
                <p className="text-sm text-muted line-clamp-3">
                  {article.description}
                </p>
              </div>
              
              <div className="mt-6 flex items-center text-sm font-medium text-accent-blue">
                Read Article
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
