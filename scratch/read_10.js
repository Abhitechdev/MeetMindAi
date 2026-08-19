const fs = require('fs');
const path = require('path');

const targetFiles = [
  'ai-for-students.mdx',
  'ai-agents-vs-assistants.mdx',
  'how-ai-transcription-works.mdx',
  'ai-productivity-tips.mdx',
  'ai-tools-for-professionals.mdx',
  'meeting-summary-templates.mdx',
  'common-meeting-mistakes.mdx',
  'ai-in-business-communication.mdx',
  'remote-team-meeting-best-practices.mdx',
  'future-of-ai-meetings.mdx'
];

const blogDir = path.join(__dirname, '../frontend/content/blog');

targetFiles.forEach(file => {
  const filePath = path.join(blogDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : file;
    const headings = content.match(/^#{2,3}\s+.+/gm) || [];
    console.log(`\n=== ${file} (${title}) ===`);
    console.log(`Headings:\n${headings.join('\n')}`);
  }
});
