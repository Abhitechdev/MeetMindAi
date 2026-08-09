const http = require('http');
const https = require('https');

const domains = [
  'http://meetmindai.co.in/about',
  'https://meetmindai.co.in/about',
  'http://www.meetmindai.co.in/about',
  'https://www.meetmindai.co.in/about',
  'https://www.meetmindai.co.in/about',
  'https://www.meetmindai.co.in/about',
  'http://www.meetmind.ai/about',
  'https://www.meetmind.ai/about'
];

async function checkUrl(urlStr, chain = [], count = 0) {
  chain.push(urlStr);
  if (count >= 5) {
    chain.push('[Loop/Max Redirects]');
    return chain;
  }
  
  return new Promise((resolve) => {
    const isHttps = urlStr.startsWith('https');
    const reqLib = isHttps ? https : http;
    
    const req = reqLib.get(urlStr, { timeout: 5000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        chain.push(`[${res.statusCode}]`);
        let loc = res.headers.location;
        if (loc.startsWith('/')) {
            const urlObj = new URL(urlStr);
            loc = urlObj.origin + loc;
        }
        resolve(checkUrl(loc, chain, count + 1));
      } else {
        chain.push(`[${res.statusCode}]`);
        resolve(chain);
      }
    });
    
    req.on('error', (err) => {
      chain.push(`[Error: ${err.message}]`);
      resolve(chain);
    });
    
    req.on('timeout', () => {
      req.destroy();
      chain.push('[Timeout]');
      resolve(chain);
    });
  });
}

async function run() {
  for (const domain of domains) {
    const chain = await checkUrl(domain);
    console.log(chain.join(' -> '));
  }
}

run();
