const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirs = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../content')
];

let filesChanged = 0;

dirs.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.mdx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('meet-mind-ai-three.vercel.app')) {
        const newContent = content.replace(/meet-mind-ai-three\.vercel\.app/g, 'meetmindai.co.in');
        fs.writeFileSync(filePath, newContent, 'utf8');
        filesChanged++;
        console.log(`Updated ${filePath}`);
      }
    }
  });
});

console.log(`Total files changed: ${filesChanged}`);
