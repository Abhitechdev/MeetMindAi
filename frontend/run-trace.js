const { spawn, execSync } = require('child_process');
const http = require('http');

console.log("Starting Next.js production server...");
const serverProcess = spawn('npm', ['run', 'start'], {
  cwd: 'd:/MeetingMindAI/frontend',
  shell: true,
});

serverProcess.stdout.on('data', (data) => console.log(`[Next.js] ${data}`));
serverProcess.stderr.on('data', (data) => console.error(`[Next.js ERROR] ${data}`));

function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
  });
}

async function main() {
  let isReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    isReady = await checkServer('http://localhost:3000');
    if (isReady) break;
  }

  if (!isReady) process.exit(1);

  try {
    execSync('npx --yes lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --only-categories=performance --chrome-flags="--headless" --save-assets', {
      cwd: 'd:/MeetingMindAI/frontend',
      stdio: 'inherit'
    });
  } catch (err) {}

  serverProcess.kill();
  process.exit(0);
}

main();
