import { getAllArticles } from "@/lib/mdx";

export async function GET() {
  const articles = getAllArticles();
  const baseUrl = "https://www.meetmindai.co.in";

  const rssItems = articles
    .map(
      (art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${baseUrl}/blog/${art.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${art.slug}</guid>
      <description><![CDATA[${art.description}]]></description>
      <pubDate>${new Date(art.publishedAt).toUTCString()}</pubDate>
      <category>${art.category}</category>
    </item>`
    )
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MeetMind AI Blog | Meeting Intelligence & AI Productivity</title>
    <link>${baseUrl}/blog</link>
    <description>Actionable insights, technical explainers, and practical guides on AI speech transcription, meeting notes, and productivity.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
