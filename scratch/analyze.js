const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

const results = files.map(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const wordCount = content.split(/\s+/).length;
  const imageMatches = content.match(/!\[.*?\]\(.*?\)|<img/gi) || [];
  const codeBlockMatches = content.match(/```[a-z]*/gi) || [];
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : file;
  
  const buzzwords = ['game-changer', 'delve', 'landscape', 'unleash', 'harness', 'revolutionize', 'supercharge', 'beacon', 'testament', 'tapestry', 'in conclusion', 'ever-evolving', 'paradigm shift', 'unlock'];
  const foundBuzz = buzzwords.filter(w => new RegExp('\\b' + w + '\\b', 'i').test(content));

  return {
    file,
    title,
    wordCount,
    imageCount: imageMatches.length,
    codeBlocks: Math.floor(codeBlockMatches.length / 2),
    buzzwords: foundBuzz
  };
});

console.log(JSON.stringify(results, null, 2));
