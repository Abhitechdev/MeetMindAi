const fs = require('fs');
const path = require('path');

const slugs = [
  "how-ai-transcription-works", "faster-whisper-explained", "gemini-vs-chatgpt-meeting-summaries",
  "how-to-write-better-meeting-minutes", "ai-productivity-tips", "remote-team-meeting-best-practices",
  "ai-for-students", "meeting-summary-templates", "how-ai-saves-time-during-meetings",
  "common-meeting-mistakes", "ai-in-business-communication", "how-meetmind-ai-works",
  "secure-ai-meeting-notes", "ai-workflow-automation", "ai-tools-for-professionals",
  "voice-ai-explained", "future-of-ai-meetings"
];

const contentDir = path.join(__dirname, '../app/content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

slugs.forEach(slug => {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const content = `---
title: "${title}"
description: "A comprehensive guide on ${title.toLowerCase()} and how it impacts your workflow."
slug: "${slug}"
author: "MeetMind Editorial Team"
publishedAt: "2026-07-01T00:00:00Z"
updatedAt: "2026-07-01T00:00:00Z"
tags: ["Productivity", "AI"]
category: "Tutorials"
coverImage: "/images/blog/default.jpg"
featured: false
draft: true
---

This article is currently being written by our expert editorial team. Check back soon for the complete guide on **${title}**.
`;
  
  fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), content);
});

console.log('Created 17 article scaffolds.');
