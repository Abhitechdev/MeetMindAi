import fs from 'fs';
import path from 'path';

const blogDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

const linkMap = {
  'AI transcription': '/blog/how-ai-transcription-works',
  'meeting summaries': '/blog/how-ai-meeting-summaries-work',
  'meeting notes': '/blog/how-to-write-better-meeting-minutes',
  'AI meeting assistant': '/blog/what-is-an-ai-meeting-assistant',
  'Gemini': '/blog/gemini-vs-chatgpt-for-meeting-notes',
  'ChatGPT': '/blog/gemini-vs-chatgpt-for-meeting-notes',
  'save time': '/blog/how-ai-saves-time-during-meetings',
  'ROI': '/blog/roi-of-ai-meeting-assistants',
  'future of meetings': '/blog/future-of-ai-meetings',
  'workflow automation': '/blog/ai-workflow-automation'
};

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let linksAdded = 0;

  for (const [keyword, url] of Object.entries(linkMap)) {
    if (linksAdded >= 3) break;
    
    // Don't link to itself
    if (url === `/blog/${file.replace('.mdx', '')}`) continue;

    // Check if keyword exists and is not already linked
    // We look for keyword not surrounded by [] or in a () URL
    const regex = new RegExp(`(?<!\\[)(?<!\\- )\\b${keyword}\\b(?!\\])`, 'i');
    
    if (regex.test(content)) {
      content = content.replace(regex, `[${keyword}](${url})`);
      linksAdded++;
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file} with ${linksAdded} links.`);
}
