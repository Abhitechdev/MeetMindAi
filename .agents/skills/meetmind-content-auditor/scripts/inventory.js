const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../../../../frontend/content/blog');

if (!fs.existsSync(contentDir)) {
  console.error("Blog directory not found:", contentDir);
  process.exit(1);
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
const inventory = [];

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const wordCount = content.split(/\s+/).length;
  
  let title = '';
  let slug = '';
  let publishedAt = '';
  
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  if (titleMatch) title = titleMatch[1];
  
  const slugMatch = content.match(/slug:\s*"([^"]+)"/);
  if (slugMatch) slug = slugMatch[1];
  
  const publishedAtMatch = content.match(/publishedAt:\s*"([^"]+)"/);
  if (publishedAtMatch) publishedAt = publishedAtMatch[1];
  
  inventory.push({
    file,
    title,
    slug,
    publishedAt,
    wordCount
  });
});

console.log("=== MeetMind Blog Inventory ===\n");

inventory.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

inventory.forEach(item => {
  console.log(`File: ${item.file}`);
  console.log(`Title: ${item.title || 'MISSING'}`);
  console.log(`Slug: ${item.slug || 'MISSING'}`);
  console.log(`Date: ${item.publishedAt || 'MISSING'}`);
  console.log(`Word Count: ${item.wordCount}`);
  console.log('-----------------------------------');
});

// Check for duplicates
const titles = inventory.map(i => i.title).filter(Boolean);
const slugs = inventory.map(i => i.slug).filter(Boolean);

const duplicateTitles = titles.filter((item, index) => titles.indexOf(item) !== index);
const duplicateSlugs = slugs.filter((item, index) => slugs.indexOf(item) !== index);

console.log("\n=== Quality Checks ===");
console.log(`Duplicate Titles: ${duplicateTitles.length > 0 ? duplicateTitles.join(', ') : 'None'}`);
console.log(`Duplicate Slugs: ${duplicateSlugs.length > 0 ? duplicateSlugs.join(', ') : 'None'}`);
