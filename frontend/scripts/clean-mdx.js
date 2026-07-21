const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.mdx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove TOC
      content = content.replace(/## Table of Contents[\s\S]*?(?=\n## |\n$|$)/, '');
      
      // Remove CTA
      content = content.replace(/## MeetMind AI CTA[\s\S]*?(?=\n## |\n$|$)/, '');
      
      // Clean up multiple newlines
      content = content.replace(/\n{3,}/g, '\n\n');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Cleaned ${file}`);
    }
  }
}

processDir(path.join(__dirname, '../content'));
console.log('Done!');
