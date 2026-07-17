import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getArticleBySlug, getArticleSlugs, getRelatedArticles, getAdjacentArticles } from "../../../lib/mdx";
import AdUnit from "../../components/ad-unit";
import GradientBackground from "../../components/gradient-background";

// Generate static parameters for all blog posts at build time
export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.metadata.seoTitle || `${article.metadata.title} | MeetMind AI`,
    description: article.metadata.seoDescription || article.metadata.description,
    keywords: article.metadata.tags,
    authors: [{ name: article.metadata.author }],
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: "article",
      publishedTime: article.metadata.publishedAt,
      modifiedTime: article.metadata.updatedAt,
      tags: article.metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.title,
      description: article.metadata.description,
    },
    alternates: {
      canonical: `https://meetmindai.co.in/blog/${article.metadata.slug}`,
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.metadata.draft) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, article.metadata.tags);
  const { prev, next } = getAdjacentArticles(slug);

  // Extract headings for Table of Contents
  const headings = Array.from(article.content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map(match => {
    const level = match[1].length;
    // Strip manual anchor links like <a id="foo"></a> that might be in the text
    const rawText = match[2].replace(/<a[^>]*><\/a>/g, '').trim();
    // Basic slugification to match rehype-slug
    const id = rawText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    return { level, text: rawText, id };
  });

  // Custom components for MDX
  const components = {
    h1: (props: any) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold text-foreground mt-12 mb-6" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-semibold text-foreground mt-8 mb-4" {...props} />,
    p: (props: any) => <p className="text-lg text-muted mb-6 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 space-y-3 text-muted mb-8" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 space-y-3 text-muted mb-8" {...props} />,
    li: (props: any) => <li className="text-muted" {...props} />,
    a: (props: any) => <a className="text-accent-blue hover:underline" {...props} />,
    strong: (props: any) => <strong className="text-foreground font-semibold" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-accent-purple pl-4 italic text-muted my-6" {...props} />,
  };

  let faqSchema = null;
  const faqSectionMatch = article.content.match(/## Frequently Asked Questions([\s\S]*?)(?=## |$)/);
  if (faqSectionMatch) {
    const faqMatches = Array.from(faqSectionMatch[1].matchAll(/###\s+(.+?)\n+([^#]+)/g));
    if (faqMatches.length > 0) {
      faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqMatches.map(match => ({
          "@type": "Question",
          "name": match[1].trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": match[2].trim().replace(/\n/g, " ")
          }
        }))
      };
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://meetmindai.co.in/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://meetmindai.co.in/blog" },
      { "@type": "ListItem", "position": 3, "name": article.metadata.title, "item": `https://meetmindai.co.in/blog/${article.metadata.slug}` }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.metadata.title,
    "description": article.metadata.description,
    "author": {
      "@type": "Person",
      "name": article.metadata.author
    },
    "datePublished": article.metadata.publishedAt,
    "dateModified": article.metadata.updatedAt || article.metadata.publishedAt,
  };

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <main className="relative min-h-screen pb-24">
      <GradientBackground />
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-muted mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-foreground font-medium" aria-current="page">
              {article.metadata.category}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
            <time dateTime={article.metadata.publishedAt}>
              {new Date(article.metadata.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
            <span>•</span>
            <span>{article.metadata.readingTime}</span>
            <span>•</span>
            <span className="text-accent-blue font-medium">{article.metadata.category}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            {article.metadata.title}
          </h1>
          
          <p className="text-xl text-muted leading-relaxed">
            {article.metadata.description}
          </p>
          
          <AdUnit className="mt-12" slotId="TOP_ARTICLE_SLOT" />
        </header>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="mb-12 p-6 glass-card rounded-2xl bg-surface/30">
            <h2 className="text-xl font-bold text-foreground mb-4">Table of Contents</h2>
            <nav>
              <ul className="space-y-2">
                {headings.map((heading, index) => (
                  <li key={index} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                    <a 
                      href={`#${heading.id}`} 
                      className="text-muted hover:text-accent-blue transition-colors text-sm font-medium"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Content Body rendered from MDX */}
        <div className="article-content">
          <MDXRemote 
            source={article.content} 
            components={components} 
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }]
                ],
              }
            }}
          />
        </div>

        <AdUnit className="my-16" slotId="BOTTOM_ARTICLE_SLOT" />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-16 pt-8 border-t border-card-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedArticles.slice(0, 2).map((related) => (
                <Link 
                  key={related.slug} 
                  href={`/blog/${related.slug}`}
                  className="glass-card glass-card-hover p-5 block group"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent-blue transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Previous / Next Navigation */}
        <nav className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-card-border mb-16">
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="flex-1 glass-card p-4 hover:bg-surface/60 transition-colors">
              <span className="text-xs text-muted uppercase tracking-wider block mb-1">Previous</span>
              <span className="font-medium text-accent-blue">{prev.title}</span>
            </Link>
          ) : <div className="flex-1" />}
          
          {next ? (
            <Link href={`/blog/${next.slug}`} className="flex-1 glass-card p-4 hover:bg-surface/60 transition-colors text-right">
              <span className="text-xs text-muted uppercase tracking-wider block mb-1">Next</span>
              <span className="font-medium text-accent-blue">{next.title}</span>
            </Link>
          ) : <div className="flex-1" />}
        </nav>

        {/* CTA */}
        <div className="glass-card p-8 text-center rounded-2xl bg-gradient-to-br from-surface/50 to-accent-blue/5 border-accent-blue/20">
          <h3 className="text-2xl font-bold text-foreground mb-3">Ready to optimize your meetings?</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Stop taking manual notes. Let MeetMind AI transcribe, summarize, and extract actionable insights from your next meeting automatically.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors shadow-sm"
          >
            Start Free Today
          </Link>
        </div>
        
      </article>
    </main>
  );
}
