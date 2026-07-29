const https = require('https');
const http = require('http');

const paths = [
    '/',
    '/about',
    '/features',
    '/contact',
    '/blog',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies-policy',
    '/blog/ai-in-business-communication',
    '/blog/local-ai-transcription-privacy',
    '/blog/meeting-action-items',
    '/blog/turn-meeting-transcripts-into-action-items-using-ai'
];

async function fetchUrl(url, method = 'GET') {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;
        lib.request(url, { method }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        }).on('error', err => resolve({ status: 500, error: err.message })).end();
    });
}

async function runTests() {
    let failed = false;
    console.log("STARTING TESTS\n");

    for (const path of paths) {
        const url = `https://www.meetmindai.co.in${path}`;
        const res = await fetchUrl(url);

        if (res.status !== 200) {
            console.log(`FAIL: ${url} returned ${res.status}`);
            failed = true;
            break;
        }

        const canonicalMatch = res.data.match(/<link rel="canonical" href="([^"]+)"/g);
        if (!canonicalMatch) {
            console.log(`FAIL: ${url} missing canonical tag`);
            failed = true;
            break;
        }
        if (canonicalMatch.length > 1) {
            console.log(`FAIL: ${url} has duplicate canonical tags`);
            failed = true;
            break;
        }
        const canonical = canonicalMatch[0];
        let expectedCanonical = `https://www.meetmindai.co.in${path}`;
        if (path === '/') {
            expectedCanonical = 'https://www.meetmindai.co.in';
        }
        if (!canonical.includes(expectedCanonical)) {
            console.log(`FAIL: ${url} canonical is wrong: ${canonical} (expected ${expectedCanonical})`);
            failed = true;
            break;
        }

        if (res.data.includes('meetmind.ai')) {
            console.log(`FAIL: ${url} contains meetmind.ai references`);
            failed = true;
            break;
        }
    }

    if (failed) return;
    
    // Redirect Tests
    const redirectTestUrl = 'http://meetmindai.co.in/about';
    const r1 = await fetchUrl(redirectTestUrl, 'HEAD');
    if (r1.status !== 308 || (r1.headers.location !== 'https://meetmindai.co.in/about' && r1.headers.location !== 'https://www.meetmindai.co.in/about')) {
        console.log(`FAIL: non-WWW redirect failed for ${redirectTestUrl}, got ${r1.status} -> ${r1.headers.location}`);
        failed = true;
    }

    if (failed) return;

    // Sitemap Test
    const sitemapRes = await fetchUrl('https://www.meetmindai.co.in/sitemap.xml');
    if (sitemapRes.status !== 200) {
        console.log(`FAIL: sitemap returned ${sitemapRes.status}`);
        failed = true;
    } else if (sitemapRes.data.includes('meetmindai.co.in') && !sitemapRes.data.includes('www.meetmindai.co.in')) {
        console.log(`FAIL: sitemap contains non-WWW URLs`);
        failed = true;
    }

    // Robots Test
    const robotsRes = await fetchUrl('https://www.meetmindai.co.in/robots.txt');
    if (robotsRes.status !== 200) {
        console.log(`FAIL: robots returned ${robotsRes.status}`);
        failed = true;
    } else if (!robotsRes.data.includes('https://www.meetmindai.co.in/sitemap.xml')) {
        console.log(`FAIL: robots missing WWW sitemap`);
        failed = true;
    }

    if (!failed) {
        console.log("ALL TESTS PASSED");
    }
}

runTests();
