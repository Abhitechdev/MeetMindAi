const fs = require('fs');
const html = fs.readFileSync('.next/analyze/client.html', 'utf8');
const match = html.match(/window\.chartData = (\[.*?\]);/s);
if (!match) {
  console.log("No chartData found");
  process.exit(1);
}
const chartData = JSON.parse(match[1]);

let allModules = [];

function parseModules(node, chunkName) {
  if (node.groups) {
    node.groups.forEach(g => parseModules(g, chunkName));
  } else if (node.parsedSize) {
    allModules.push({
      label: node.label,
      path: node.path,
      size: node.parsedSize,
      chunk: chunkName
    });
  }
}

chartData.forEach(chunk => {
  // we want initial chunks or the main ones
  // For Next.js, main-app, _app, framework, webpack, layout, page are initial.
  parseModules(chunk, chunk.label);
});

// Group by top-level node_modules or source files
const groups = {};
allModules.forEach(mod => {
  let name = mod.path;
  if (name.includes('node_modules')) {
    const parts = name.split('node_modules/')[1].split('/');
    name = parts[0].startsWith('@') ? parts[0] + '/' + parts[1] : parts[0];
  } else if (name.startsWith('./app/')) {
    name = name.split('/').slice(0, 4).join('/');
  } else {
    name = name.split('/')[0];
  }
  
  if (!groups[name]) groups[name] = 0;
  groups[name] += mod.size;
});

const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]);
console.log("Top 15 largest dependencies/modules across the client build:");
sorted.slice(0, 15).forEach(([name, size]) => {
  console.log(`${name}: ${(size / 1024).toFixed(2)} KB`);
});

// Check specifically MeetingOrchestrator
const orchestrator = allModules.filter(m => m.path.includes('meeting-orchestrator'));
const orchestratorSize = orchestrator.reduce((acc, m) => acc + m.size, 0);
console.log(`\nMeetingOrchestrator total size: ${(orchestratorSize / 1024).toFixed(2)} KB`);
