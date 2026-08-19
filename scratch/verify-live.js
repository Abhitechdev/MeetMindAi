const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

const articles = [
  'ai-agents-vs-assistants',
  'ai-in-business-communication',
  'ai-productivity-tips',
  'ai-tools-for-professionals',
  'common-meeting-mistakes',
  'future-of-ai-meetings',
  'how-ai-saves-time-during-meetings',
  'how-ai-transcription-works',
  'meeting-summary-templates',
  'remote-team-meeting-best-practices'
];

async function runVerification() {
  console.log('=== LIVE PRODUCTION VERIFICATION ===\n');
  
  // 6. Homepage HTTP 200 check
  const homeRes = await fetchUrl('https://www.meetmindai.co.in');
  console.log('1. Homepage (https://www.meetmindai.co.in): HTTP', homeRes.status);
  
  // 9. sitemap.xml and robots.txt
  const sitemapRes = await fetchUrl('https://www.meetmindai.co.in/sitemap.xml');
  const robotsRes = await fetchUrl('https://www.meetmindai.co.in/robots.txt');
  console.log('2. sitemap.xml: HTTP', sitemapRes.status);
  console.log('3. robots.txt: HTTP', robotsRes.status);
  
  // 7, 8, 10, 11, 12. Audit 10 articles
  console.log('\n--- 10 Modified Articles Verification ---');
  let failures = 0;
  
  for (const slug of articles) {
    const url = `https://www.meetmindai.co.in/blog/${slug}`;
    const res = await fetchUrl(url);
    const body = res.body || '';
    
    // Check status
    const statusOk = res.status === 200;
    
    // Check canonical
    const canonicalMatch = body.match(/<link rel="canonical" href="([^"]+)"/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : 'NONE';
    const canonicalOk = canonical === url || canonical === `https://www.meetmindai.co.in/blog/${slug}`;
    
    // Check noindex
    const hasNoindex = /meta name="robots" content="[^"]*noindex[^"]*"/i.test(body);
    
    // Check legacy domain references
    const legacyDomains = [...body.matchAll(/(meetmind\.ai|meetmindai\.tech)/gi)].map(m => m[0]);
    
    console.log(`Article: /blog/${slug}`);
    console.log(`  - HTTP Status: ${res.status} ${statusOk ? 'OK' : 'FAIL'}`);
    console.log(`  - Canonical: ${canonical} ${canonicalOk ? 'OK' : 'FAIL'}`);
    console.log(`  - Noindex Directive: ${hasNoindex ? 'FAIL (noindex present)' : 'None (Indexable) OK'}`);
    console.log(`  - Legacy Domain References: ${legacyDomains.length === 0 ? 'None OK' : legacyDomains.join(', ') + ' FAIL'}`);
    
    if (!statusOk || !canonicalOk || hasNoindex || legacyDomains.length > 0) {
      failures++;
    }
  }
  
  console.log(`\n=== VERIFICATION RESULT: ${failures === 0 ? 'ALL CHECKS PASSED PERFECTLY!' : failures + ' ERRORS FOUND'} ===`);
}

runVerification();
