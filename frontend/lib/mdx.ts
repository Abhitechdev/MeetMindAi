import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface ArticleMetadata {
  title: string;
  description: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readingTime: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Article {
  metadata: ArticleMetadata;
  content: string;
}

export function getArticleSlugs() {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  return fs.readdirSync(contentDirectory).filter((file) => file.endsWith('.mdx'));
}

export function getArticleBySlug(slug: string): Article | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Default reading time calculation
  const stats = readingTime(content);

  return {
    metadata: {
      title: data.title || '',
      description: data.description || '',
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      slug: realSlug,
      author: data.author || 'MeetMind Editorial Team',
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt,
      tags: data.tags || [],
      category: data.category || 'Uncategorized',
      coverImage: data.coverImage,
      readingTime: stats.text, // Always dynamically generated
      featured: data.featured || false,
      draft: data.draft || false,
    },
    content,
  };
}

export function getAllArticles(): ArticleMetadata[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null && !article.metadata.draft)
    .map((article) => article.metadata)
    .sort((a, b) => (new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1));
  return articles;
}

export function getRelatedArticles(currentSlug: string, currentCategory: string, tags: string[], limit: number = 4): ArticleMetadata[] {
  const allArticles = getAllArticles();
  
  const related = allArticles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      let score = 0;
      // 1. Priority: Same category
      if (article.category === currentCategory) {
        score += 10;
      }
      // 2. Priority: Shared tags
      const matchCount = article.tags.filter((tag) => tags.includes(tag)).length;
      score += matchCount;
      return { article, score };
    })
    // 3. Priority: Latest posts (handled by the fallback date sort if scores tie)
    .sort((a, b) => b.score - a.score || (new Date(a.article.publishedAt) > new Date(b.article.publishedAt) ? -1 : 1))
    .map((item) => item.article)
    .slice(0, limit);
    
  return related;
}

export function getAdjacentArticles(currentSlug: string) {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.slug === currentSlug);
  
  if (index === -1) {
    return { prev: null, next: null };
  }
  
  const prev = index < articles.length - 1 ? articles[index + 1] : null; // Older article
  const next = index > 0 ? articles[index - 1] : null; // Newer article
  
  return { prev, next };
}
