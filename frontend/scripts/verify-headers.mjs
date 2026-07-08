import fs from 'fs';
import path from 'path';

// ponytail: lazy senior dev verification script. 
// Just check the text of next.config.ts for the required headers.
// It fails the build if any are missing. No massive AST parsing needed.

const configPath = path.join(process.cwd(), 'next.config.ts');
if (!fs.existsSync(configPath)) {
  console.error('Security check failed: next.config.ts not found.');
  process.exit(1);
}

const content = fs.readFileSync(configPath, 'utf8');

const requiredHeaders = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Embedder-Policy',
  'Cross-Origin-Resource-Policy',
  'Cache-Control'
];

let failed = false;

for (const header of requiredHeaders) {
  if (!content.includes(header)) {
    console.error(`\n✗ Missing required header:\n\n${header}\n`);
    failed = true;
  }
}

if (failed) {
  console.error('Build aborted.\n');
  process.exit(1);
}

console.log('✓ All required security headers found.\n');
process.exit(0);
