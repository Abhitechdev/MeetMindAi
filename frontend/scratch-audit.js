const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
const results = files.map(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const frontmatterEnd = content.indexOf('---', 10) + 3;
  const body = content.slice(frontmatterEnd).trim();
  return {
    file: f,
    length: body.length,
    wordCount: body.split(/\s+/).length,
    excerpt: body.slice(0, 150).replace(/\n/g, ' ')
  };
});
console.log(JSON.stringify(results, null, 2));
