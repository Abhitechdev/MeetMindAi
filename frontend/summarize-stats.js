const fs = require('fs');
const data = JSON.parse(fs.readFileSync('bundle-stats.json', 'utf8'));

const moduleSizes = {};

// source-map-explorer JSON format:
// { "results": [ { "bundleName": "...", "totalBytes": 123, "files": { "node_modules/react/index.js": { "size": 123 }, ... } } ] }
// Let's aggregate by library name or file path

data.results.forEach(result => {
  if (result.files) {
    Object.entries(result.files).forEach(([filePath, fileInfo]) => {
      // Group node_modules by package name
      let key = filePath;
      if (filePath.includes('node_modules')) {
        const parts = filePath.split('node_modules/')[1].split('/');
        key = parts[0].startsWith('@') ? parts[0] + '/' + parts[1] : parts[0];
      }
      
      moduleSizes[key] = (moduleSizes[key] || 0) + fileInfo.size;
    });
  }
});

const sorted = Object.entries(moduleSizes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(([name, size]) => `${name}: ${(size / 1024).toFixed(2)} KB`);

console.log('Top 15 largest modules in initial bundle:');
console.log(sorted.join('\n'));
