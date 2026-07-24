import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getArticleBySlug, getArticleSlugs, getRelatedArticles, getAdjacentArticles } from "../../../lib/mdx";
import AdUnit from "../../components/ad-unit";
import GradientBackground from "../../components/gradient-background";

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) return { title: "Article Not Found" };

  const baseUrl = "https://meetmind.ai";
  const imageUrl = article.metadata.coverImage ? `${baseUrl}${article.metadata.coverImage}` : undefined;

  return {
    title: article.metadata.seoTitle || `${article.metadata.title} | MeetMind AI`,
    description: article.metadata.seoDescription || article.metadata.description,
    keywords: article.metadata.tags,
    authors: [{ name: article.metadata.author }],
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: "article",
      url: `${baseUrl}/blog/${article.metadata.slug}`,
      publishedTime: article.metadata.publishedAt,
      modifiedTime: article.metadata.updatedAt,
      tags: article.metadata.tags,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.metadata.title,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.title,
      description: article.metadata.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${article.metadata.slug}`,
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.metadata.draft) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, article.metadata.category, article.metadata.tags, 4);
  const { prev, next } = getAdjacentArticles(slug);

  const headings = Array.from(article.content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map(match => {
    const level = match[1].length;
    const rawText = match[2].replace(/<a[^>]*><\/a>/g, '').trim();
    const id = rawText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    return { level, text: rawText, id };
  });

  const components = {
    h1: (props: any) => <h1 className="text-3xl font-bold text-foreground mt-12 mb-6" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold text-foreground mt-12 mb-6" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-semibold text-foreground mt-8 mb-4" {...props} />,
    p: (props: any) => <p className="text-lg text-muted mb-6 leading-relaxed max-w-[85ch]" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 space-y-3 text-muted mb-8 max-w-[85ch]" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 space-y-3 text-muted mb-8 max-w-[85ch]" {...props} />,
    li: (props: any) => <li className="text-muted" {...props} />,
    a: (props: any) => <a className="text-accent-blue hover:underline" {...props} />,
    strong: (props: any) => <strong className="text-foreground font-semibold" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-accent-purple pl-4 italic text-muted my-6 max-w-[85ch]" {...props} />,
    table: (props: any) => (
      <div className="overflow-x-auto my-10 max-w-[85ch] rounded-xl border border-card-border shadow-sm">
        <table className="w-full border-collapse text-left" {...props} />
      </div>
    ),
    thead: (props: any) => <thead className="bg-surface/60 border-b border-card-border" {...props} />,
    th: (props: any) => <th className="p-4 font-semibold text-foreground" {...props} />,
    td: (props: any) => <td className="p-4 text-muted border-t border-card-border/50" {...props} />,
    tr: (props: any) => <tr className="even:bg-surface/20 hover:bg-surface/40 transition-colors" {...props} />,
    KeyTakeaways: ({ children }: any) => (
      <div className="bg-surface/40 border border-card-border rounded-2xl p-6 sm:p-8 my-10 max-w-[85ch] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground m-0">Key Takeaways</h2>
        </div>
        <div className="text-muted text-lg pl-2 space-y-2">
          {children}
        </div>
      </div>
    ),
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

  const baseUrl = "https://meetmind.ai";
  const articleUrl = `${baseUrl}/blog/${article.metadata.slug}`;
  const imageUrl = article.metadata.coverImage ? `${baseUrl}${article.metadata.coverImage}` : undefined;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${baseUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
      { "@type": "ListItem", "position": 3, "name": article.metadata.category, "item": `${baseUrl}/blog/category/${article.metadata.category.toLowerCase().replace(/\s+/g, '-')}` },
      { "@type": "ListItem", "position": 4, "name": article.metadata.title, "item": articleUrl }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.metadata.title,
    "description": article.metadata.description,
    "image": imageUrl ? [imageUrl] : undefined,
    "author": {
      "@type": "Person",
      "name": article.metadata.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "MeetMind AI",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "datePublished": article.metadata.publishedAt,
    "dateModified": article.metadata.updatedAt || article.metadata.publishedAt,
    "keywords": article.metadata.tags,
    "wordCount": article.content.split(/\s+/).length.toString(),
  };

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  const publishedDate = new Date(article.metadata.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const updatedDate = article.metadata.updatedAt ? new Date(article.metadata.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  return (
    <main className="relative min-h-screen pb-12">
      <GradientBackground />
      
      {/* Skip to Content */}
      <a href="#article-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent-blue text-white p-2 rounded z-50">
        Skip to main content
      </a>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section (Re-ordered) */}
        <header className="max-w-[85ch] mx-auto mb-12">
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-muted mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li><Link href="/" className="hover:text-foreground transition-colors focus:ring-2 focus:ring-accent-blue outline-none rounded">Home</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors focus:ring-2 focus:ring-accent-blue outline-none rounded">Blog</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><span className="text-foreground font-medium" aria-current="page">{article.metadata.category}</span></li>
            </ol>
          </nav>

          {/* Title and Description */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            {article.metadata.title}
          </h1>
          <p className="text-xl text-muted leading-relaxed mb-6">
            {article.metadata.description}
          </p>

          {/* Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-8">
            <span className="font-medium text-foreground">{article.metadata.author}</span>
            <span>•</span>
            {updatedDate && updatedDate !== publishedDate ? (
              <span>Published {publishedDate} • Updated {updatedDate}</span>
            ) : (
              <span>{publishedDate}</span>
            )}
            <span>•</span>
            <span>{article.metadata.readingTime}</span>
          </div>
          
          <AdUnit className="mb-12" slotId="TOP_ARTICLE_SLOT" />

          {/* Hero Image */}
          {article.metadata.coverImage && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg mb-12">
              <Image 
                src={article.metadata.coverImage} 
                alt={article.metadata.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
              />
            </div>
          )}
        </header>

        {/* Content & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Left Column (Content & CTA) */}
          <div className="lg:w-3/4 max-w-[85ch] mx-auto lg:mx-0 w-full" id="article-content">
            
            {/* Mobile TOC (Accordion) */}
            {headings.length > 0 && (
              <details className="lg:hidden mb-12 p-6 glass-card rounded-2xl bg-surface/30 group">
                <summary className="text-xl font-bold text-foreground cursor-pointer focus:ring-2 focus:ring-accent-blue outline-none rounded">
                  Table of Contents
                </summary>
                <nav className="mt-4" aria-label="Table of Contents">
                  <ul className="space-y-3">
                    {headings.map((heading, index) => (
                      <li key={index} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                        <a 
                          href={`#${heading.id}`} 
                          className="text-muted hover:text-accent-blue transition-colors text-sm font-medium focus:ring-2 focus:ring-accent-blue outline-none rounded inline-block"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            )}

            {/* Rendered MDX */}
            <div className="article-body">
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

            {/* Feature CTA Component */}
            <div className="mt-16 bg-surface/40 border border-card-border p-8 sm:p-10 rounded-3xl text-center shadow-sm">
              <div className="mx-auto w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to eliminate manual meeting notes?</h3>
              <p className="text-lg text-muted mb-8 max-w-xl mx-auto">Secure your meeting data while generating accurate AI summaries in minutes.</p>
              
              <ul className="text-muted mb-8 space-y-3 text-left inline-block mx-auto">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  AI Meeting Notes & Summaries
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Automated Action Item Tracking
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Search Across Every Meeting
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-accent-blue text-white px-8 py-3 font-semibold hover:bg-accent-blue/90 transition-colors shadow-sm focus:ring-4 focus:ring-accent-blue/20 outline-none"
                >
                  Start Free
                </Link>
                <Link 
                  href="/features" 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-card-border bg-transparent text-foreground px-8 py-3 font-semibold hover:bg-surface/60 transition-colors focus:ring-4 focus:ring-surface outline-none"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <AdUnit className="mt-16" slotId="BOTTOM_ARTICLE_SLOT" />
          </div>

          {/* Right Column (Sticky TOC) */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-32 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-thin">
              {headings.length > 0 && (
                <div className="p-6 glass-card rounded-2xl bg-surface/30">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Table of Contents</h2>
                  <nav aria-label="Desktop Table of Contents">
                    <ul className="space-y-3">
                      {headings.map((heading, index) => (
                        <li key={index} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                          <a 
                            href={`#${heading.id}`} 
                            className="text-muted hover:text-accent-blue transition-colors text-sm font-medium focus:ring-2 focus:ring-accent-blue outline-none rounded inline-block"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-card-border max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedArticles.map((related) => (
                <Link 
                  key={related.slug} 
                  href={`/blog/${related.slug}`}
                  className="glass-card glass-card-hover flex flex-col group rounded-2xl overflow-hidden focus:ring-2 focus:ring-accent-blue outline-none h-full"
                >
                  {related.coverImage && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image 
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent-blue transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted mb-4 line-clamp-2 flex-grow">
                      {related.description}
                    </p>
                    <div className="text-xs text-muted font-medium mt-auto">
                      {related.readingTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </article>
    </main>
  );
}
