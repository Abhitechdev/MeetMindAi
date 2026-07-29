---
name: meetmind-content-auditor
description: Audit MeetMind AI blog content for thin content, originality, generic or templated writing, duplication, SEO quality, factual reliability, product-claim accuracy, structured data, and AdSense content-quality risks.
---

# MeetMind Content Auditor Skill

This skill is designed to audit MeetMind AI blog articles before publishing or perform site-wide content audits. The primary goal is to ensure high quality, strong search intent satisfaction, originality, and adherence to AdSense content-quality guidelines.

## 1. Activation Intent
Applicable when the user says:
- "check this article"
- "audit this blog"
- "check before publishing"
- "check thin content"
- "check content quality"
- "AdSense content audit"
- "SEO audit this article"
- "check originality"
- "check AI-like writing"
- "check duplicate content"
- "audit all blog posts"
- "find weak articles"
- "check this article for AdSense"
- "run content quality audit"

**CRITICAL RULE:** Do NOT build or act as an unreliable binary AI detector. Never claim with certainty that content was written by AI based only on linguistic patterns. Instead, evaluate whether the content appears generic, repetitive, templated, low-value, search-engine-first, mass-produced, or lacking original insight.

## 2. Thin Content Audit
Evaluate whether each article actually satisfies its intended reader/search intent.
**Check for:**
- Shallow sections or filler paragraphs
- Unnecessary introductions or conclusions
- Repeated information
- Headings without substantial content
- Definitions without practical value
- Generic advice or incomplete explanations
- Content that exists primarily to increase word count

*Do NOT classify an article as good simply because it is long. Do NOT use a fixed minimum word count as the main quality criterion.*

## 3. Original Value
Evaluate what unique value the article provides. Ask: "Why would a reader choose this article instead of another article covering the same search intent?"
**Look for:**
- Original explanations, practical examples, workflows, templates, or checklists
- Technical explanations, concrete scenarios, useful comparisons, or implementation details
- First-party MeetMind AI knowledge and actionable recommendations

*Flag articles that mainly restate common information.*

## 4. Generic / AI-Like Writing Patterns
Detect quality problems such as:
- "In today's fast-paced world..." style introductions
- Generic opening paragraphs, repetitive conclusions, or excessive transitions
- Predictable section structures, vague statements, or unnecessary summaries
- Excessive adjectives, artificial enthusiasm, repetitive sentence patterns
- Repeated phrases across articles or excessive rhetorical framing
- Sections that appear generated from the same template

*When possible, quote the exact problematic passage and explain WHY it weakens the article. Do not simply label text "AI-generated."*

## 5. Cross-Article Duplication
When repository access is available, inspect all MeetMind AI blog MDX files.
**Compare:** Titles, search intent, headings, introductions, definitions, examples, conclusions, FAQ questions, CTA sections, paragraphs.
**Detect:** Exact duplication, near duplication, topical overlap, repeated examples, keyword cannibalization, or multiple articles targeting essentially the same query.
*Differentiate legitimate topic overlap from harmful duplication.*

## 6. Factual Quality
**Identify:**
- Unsupported statistics or accuracy claims
- Absolute claims, questionable technical claims, outdated information
- Unverifiable statements or claims requiring authoritative sources

*Never invent citations or statistics. If a claim needs evidence, mark: SOURCE REQUIRED.*

## 7. MeetMind AI Product Claims
Where possible, compare article claims against the actual repository implementation (e.g., transcription, summaries, action items, meeting integrations, Zoom, Google Meet, Microsoft Teams, AI models, pricing, premium features, privacy, security).
**Flag as:** IMPLEMENTED, PARTIALLY IMPLEMENTED, FUTURE FEATURE, UNVERIFIED, or INACCURATE CLAIM.
*Do not allow future functionality to be presented as currently available.*

## 8. SEO Audit
**Review:** Title, seoTitle, description, seoDescription, slug, primary search intent, H1, H2/H3 structure, keyword usage, internal links, external references, image alt text, metadata, canonical handling, topical overlap, and keyword cannibalization.
*Do not recommend keyword stuffing or changing content solely to increase keyword frequency.*

## 9. AdSense Quality Review
Evaluate potential content-quality risks relevant to an AdSense review.
**Look for:** Thin content, low-originality content, scaled/template content, excessive product promotion, unfinished pages, misleading claims, weak navigation context, search-first content, articles providing little publisher-added value.
**Never state:** "Google will approve this."
**Instead use:** LOW RISK, MEDIUM RISK, HIGH RISK. *Make clear that Google makes the final decision.*

## 10. Structured Data
- Check whether the site's blog template already generates Article, FAQPage, Breadcrumb, or Organization structured data.
- Detect manually embedded JSON-LD in the MDX that could duplicate template-generated schema.
- Verify structured data matches visible article content.

## 11. Article Audit Output Format
For a single article return exactly:

CONTENT QUALITY: X/10
ORIGINAL VALUE: X/10
SEARCH INTENT: X/10
SEO: X/10
FACTUAL TRUST: X/10

THIN CONTENT: PASS / WARNING / FAIL
DUPLICATION RISK: LOW / MEDIUM / HIGH
ADSENSE RISK: LOW / MEDIUM / HIGH
PRODUCT CLAIMS: PASS / WARNING / FAIL
STRUCTURED DATA: PASS / WARNING / FAIL

CRITICAL ISSUES
[List]

HIGH PRIORITY
[List]

MEDIUM PRIORITY
[List]

OPTIONAL IMPROVEMENTS
[List]

FINAL VERDICT:
PUBLISH (or IMPROVE BEFORE PUBLISHING, or DO NOT PUBLISH)
[Explain the verdict.]

## 12. Site-Wide Audit Mode Output Format
When asked to audit the entire blog, find every published MDX article, audit all of them, and return a markdown table:
| Article | Quality | Original Value | SEO | Thin Content | Duplication | AdSense Risk | Action |

Sort the highest-risk content first. Then report:
TOTAL ARTICLES:
STRONG ARTICLES:
NEEDS IMPROVEMENT:
HIGH RISK:
THIN CONTENT:
OVERLAPPING ARTICLES:
UNSUPPORTED CLAIMS:
PRODUCT CLAIM ISSUES:

*Identify the weakest articles that should be improved first.*

## 13. Pre-Publish Mode
When asked "check before publishing":
Perform the complete single-article audit. If there are no serious problems and:
- Content Quality >= 8/10
- Original Value >= 8/10
- AdSense Risk = LOW
return: PUBLISH

*Do not manufacture changes simply because an audit was requested. Good content should pass unchanged.*

## 14. Editing Safety
**DEFAULT MODE IS READ-ONLY AUDIT.**
Do not modify an article unless explicitly requested ("fix it", "improve it", "rewrite it", "apply fixes").
When editing:
- Preserve the author's meaning, factual information, and useful technical detail
- Avoid unnecessary rewrites, do not inflate word count
- Do not fabricate facts, citations, or product capabilities.

## 15. Audit Script
You can use the helper script located at `scripts/inventory.js` to quickly inventory MDX files, check word counts, duplicate titles, missing metadata, and detect similar FAQ questions.
