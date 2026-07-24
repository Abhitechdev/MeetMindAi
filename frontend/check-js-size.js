const fs = require('fs');
const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
const scriptRegex = /<script src="\/_next\/static\/chunks\/([^"]+)"/g;
let match;
const scripts = [];
while ((match = scriptRegex.exec(html)) !== null) {
  scripts.push(match[1]);
}
console.log(scripts);
let totalSize = 0;
scripts.forEach(s => {
  try {
    totalSize += fs.statSync('.next/static/chunks/' + s).size;
  } catch(e) {}
});
console.log('Total initial JS KB:', (totalSize / 1024).toFixed(2));
