const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'frontend/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
let total = 0;
files.forEach(f => {
    const text = fs.readFileSync(path.join(dir, f), 'utf-8');
    const lines = text.split('\n');
    lines.forEach((l, i) => {
        const lower = l.toLowerCase();
        if (lower.includes('meetmind') && (
            lower.includes('gemini') || 
            lower.includes('gpt') || 
            lower.includes('jira') || 
            lower.includes('slack') || 
            lower.includes('notion') || 
            lower.includes('zero retention') || 
            lower.includes('zero-retention') || 
            lower.includes('model') || 
            lower.includes('pushes natively') || 
            lower.includes('pushes to') || 
            lower.includes('use') || 
            lower.includes('integrat')
        )) {
            console.log(`${f}:${i+1}: ${l.trim()}`);
            total++;
        }
    });
});
console.log(`Found ${total} lines.`);
