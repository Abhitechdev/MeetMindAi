const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'frontend/content/blog');
const outputFile = path.join(__dirname, 'all_articles.txt');

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
let allContent = '';

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  allContent += `\n\n=========================================\nFILE: ${file}\n=========================================\n\n` + content;
});

fs.writeFileSync(outputFile, allContent);
console.log(`Wrote ${files.length} articles to ${outputFile}`);
