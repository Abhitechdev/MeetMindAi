const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../frontend/app');

function getPages(dir, base = '') {
  let pages = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') || entry.name.startsWith('_') || entry.name === 'api' || entry.name === 'components' || entry.name === 'actions' || entry.name === 'hooks' || entry.name === 'data') continue;
      pages = pages.concat(getPages(path.join(dir, entry.name), path.join(base, entry.name)));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
      const filePath = path.join(dir, entry.name);
      const content = fs.readFileSync(filePath, 'utf8');
      const textOnly = content.replace(/<[^>]+>/g, ' ').replace(/import.*?;/g, '').replace(/export default.*/g, '');
      const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
      pages.push({
        route: '/' + base.replace(/\\/g, '/'),
        file: filePath,
        sizeBytes: content.length,
        wordCount
      });
    }
  }
  return pages;
}

console.log(JSON.stringify(getPages(appDir), null, 2));
