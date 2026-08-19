const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../frontend/content/blog');
const appDir = path.join(__dirname, '../frontend/app');

const mdxFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
const validSlugs = new Set(mdxFiles.map(f => f.replace('.mdx', '')));

// Add valid static app routes
const validRoutes = new Set([
  '/', '/about', '/accessibility', '/api-docs', '/authors/abhishek', '/blog', '/changelog',
  '/contact', '/decisions', '/editorial-policy', '/faq', '/features', '/help-center',
  '/history', '/how-it-works', '/integrations', '/legal/acceptable-use', '/legal/ai-transparency',
  '/legal/cookies-policy', '/legal/privacy', '/legal/terms', '/login', '/pricing', '/security', '/use-cases'
]);

let brokenLinks = [];
let metadataStatus = [];

mdxFiles.forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  
  // Extract metadata
  const title = (content.match(/title:\s*"([^"]+)"/) || [])[1];
  const description = (content.match(/description:\s*"([^"]+)"/) || [])[1];
  const slug = (content.match(/slug:\s*"([^"]+)"/) || [])[1];

  if (!title || !description || !slug) {
    metadataStatus.push({ file, issue: 'Missing critical metadata field' });
  }

  // Find all internal links: [text](/route)
  const links = content.match(/\[.*?\]\(((\/blog\/[a-z0-9-]+)|(\/[a-z0-9-]+))\)/gi) || [];
  links.forEach(linkMatch => {
    const hrefMatch = linkMatch.match(/\((.*?)\)/);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (href.startsWith('/blog/')) {
        const targetSlug = href.replace('/blog/', '');
        if (!validSlugs.has(targetSlug)) {
          brokenLinks.push({ file, link: href });
        }
      } else if (href.startsWith('/') && !href.startsWith('//')) {
        if (!validRoutes.has(href)) {
          brokenLinks.push({ file, link: href });
        }
      }
    }
  });
});

console.log("=== SEO Metadata Audit ===");
console.log(`Metadata Issues Found: ${metadataStatus.length}`);
if (metadataStatus.length > 0) console.log(metadataStatus);

console.log("\n=== Internal Link Audit ===");
console.log(`Broken Internal Links Found: ${brokenLinks.length}`);
if (brokenLinks.length > 0) console.log(brokenLinks);
