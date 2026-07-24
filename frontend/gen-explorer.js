const fs = require('fs');
const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
const scriptRegex = /<script src="\/_next\/static\/chunks\/([^"]+)"/g;
let match;
const scripts = [];
while ((match = scriptRegex.exec(html)) !== null) {
  scripts.push('.next/static/chunks/' + match[1]);
}
fs.writeFileSync('run-explorer.bat', 'npx source-map-explorer ' + scripts.join(' ') + ' --json > bundle-stats.json');
