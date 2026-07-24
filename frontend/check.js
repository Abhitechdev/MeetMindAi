const fs = require('fs');
const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
const preloads = html.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g);
console.log('Preload tags:', preloads);
