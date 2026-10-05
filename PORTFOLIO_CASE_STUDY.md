# MeetMind AI — Portfolio Case Study

---

## Project

**MeetMind AI** — Evidence-grounded organizational memory for meetings

**Type:** Full-stack AI application (individual project)  
**Stack:** Next.js, FastAPI, Supabase, NVIDIA NIM  
**Timeline:** Multi-phase development across Phases 1–8

---

## Problem

Most meeting AI tools stop at transcription and per-meeting summaries. They answer:
> "What happened in this meeting?"

They cannot answer:
> "What did we decide about authentication?"  
> "Who committed to the payment integration and is it still open?"  
> "What changed since last meeting?"  
> "Which decisions were reversed?"  
> "Who is responsible for the unresolved API issue?"

These are the questions that matter in real organizations. They require memory that persists across meetings, structured extraction, temporal reasoning, and evidence grounding — none of which transcription alone provides.

---

## Solution

MeetMind builds an organizational memory layer that:

1. **Extracts structure** — decisions, commitments, action items, people, projects, relationships
2. **Persists memory** — everything stored in PostgreSQL, queryable at any time
3. **Retrieves intelligently** — intent-aware retrieval maps query type to the right data
4. **Detects change** — tracks decision status over time (CURRENT / SUPERSEDED)
5. **Models relationships** — people linked to projects, decisions, commitments
6. **Reasons across meetings** — LLM synthesizes answers from bounded evidence
7. **Grounds every answer** — responses cite specific meeting records

---

## Key Engineering Work

### Structured Extraction Pipeline
Built a prompt-engineering pipeline that extracts structured JSON from raw transcripts using NVIDIA NIM. Handles speaker attribution, decision confidence scoring, commitment due date extraction, and entity classification in a single LLM call.

### Persistent Memory Architecture
Designed a normalized PostgreSQL schema with RLS tenant isolation. Six tables capture different knowledge types (decisions, commitments, action items, entities, relationships). All tables cascade-delete from the parent `meetings` table and are protected by Supabase auth.uid() policies.

### Intent-Aware Retrieval
Rather than sending all queries to a single vector search, built a lightweight intent classifier that maps query patterns to specific tables. "What commitments are open?" → directly queries the `commitments` table with `status = OPEN`. Faster, cheaper, and more accurate than pure semantic retrieval for structured data.

### Temporal Change Detection
Decisions carry a `status` field (CURRENT / SUPERSEDED / PROPOSED / REVERSED). The retrieval pipeline sorts decisions chronologically and identifies status changes across meetings. This enables "what changed?" queries that actually return meaningful diffs.

### Relationship-Aware Retrieval
Entity extraction populates `meeting_entities` and `meeting_relationships`. The query pipeline expands retrievals: "What projects is Alice on?" fetches Alice from entities, then finds meetings and commitments linking Alice to projects.

### LLM Fallback Architecture
Provider configuration iterates through NVIDIA NIM → Groq on exception. Both providers use the same OpenAI-compatible API. The fallback is transparent to the application layer and verified by automated tests.

### Production Security
Row Level Security enforces tenant isolation at the database level — not just the application layer. JWT validation on every endpoint. Prompt injection resistance tested against 6 payload types. Secrets audited to confirm service-role key is absent from all frontend code.

---

## Architecture

```
Meeting Audio
     │
     ▼
Transcription (AssemblyAI / Whisper)
     │
     ▼
NVIDIA NIM LLM — Structured Extraction
     │
     ├── decisions (status, confidence, participants)
     ├── action_items (owner, reference)
     ├── commitments (person, due_date, status)
     ├── meeting_entities (people, projects, topics)
     └── meeting_relationships (A → B)
     │
     ▼
Supabase PostgreSQL (RLS: user sees only own data)
     │
     ▼
Query Pipeline
  1. Intent classification → right table(s)
  2. Semantic retrieval → relevant meetings
  3. Relationship expansion → linked entities
  4. Temporal analysis → change detection
  5. Bounded context assembly
     │
     ▼
NVIDIA NIM LLM — Cross-Meeting Reasoning
     │
     ▼
Evidence-Grounded Answer (with meeting citations)
```

---

## Evaluation

**Automated evaluation: 18/18 tests pass** (structural correctness + rejection accuracy)

| Category | Result |
|---|---|
| Basic meeting memory retrieval | PASS |
| Intent-aware retrieval | PASS |
| Decision tracking | PASS |
| Commitment ownership | PASS |
| Unresolved item detection | PASS |
| Relationship mapping | PASS |
| Cross-meeting synthesis | PASS |
| Unknown question rejection | 5/5 correctly rejected |
| Prompt injection resistance | PASS |

**Phase 7 security regression: 17/17 pass**

**Real-data validation (Phase 3):** One real meeting processed end-to-end. Decisions, commitments, entities, and relationships persisted to live Supabase. Cross-meeting queries returned correctly cited answers.

**Performance (mocked DB, real middleware):**
- GET /meetings: P50 9.6ms, P95 25.2ms
- Cross-meeting query (with LLM): P95 ~2.7s

**Honest limitation:** Real dataset is too small (1 real meeting in dev environment) to report production-scale semantic accuracy metrics. Structural evaluation is solid; accuracy at scale requires real user traffic to measure.

---

## Challenges

### Challenge 1: LLM Provider Instability
NVIDIA NIM returned 503s for several configured models. Diagnosed by querying the `/v1/models` endpoint directly, identified available models, reconfigured to working model IDs, and built a verified fallback chain. This required diagnosing the difference between "model name sounds right" and "model is actually available on this API key."

### Challenge 2: Intent-Retrieval Gap
Initial implementation retrieved meetings by keyword search. Queries like "What remains unresolved?" returned zero results because no meeting summary contained the word "unresolved." Solved by building an intent classifier that maps query semantics to database operations directly, bypassing the keyword mismatch problem entirely.

### Challenge 3: RLS in Tests
Test harness initially used a non-existent user_id, triggering foreign key violations. Solved by inspecting the real Supabase `auth.users` table, using a legitimate existing test account, and refactoring tests to use proper FastAPI dependency injection overrides rather than bypassing auth.

### Challenge 4: Fallback Bug Under Load
The original `gemini_service._create_completion` silently swallowed exceptions and returned `None` instead of falling back. Discovered during Phase 3 when the primary model was unavailable. Fixed the exception propagation logic and added automated tests verifying the fallback chain.

---

## Limitations

- **Real dataset is small:** 1 real meeting in dev environment. Production-scale accuracy unknown.
- **Rate limiter is in-memory:** Not effective across multiple backend processes.
- **No distributed tracing:** Cross-request correlation requires manual log inspection.
- **Entity resolution is naive:** Person "Alice" and "Alice Smith" are separate entities without fuzzy matching.
- **Context window bounded:** Very long meeting histories may not fully fit in LLM context.

---

## Result

MeetMind can reliably:

- Process meeting audio → structured knowledge (decisions, commitments, action items, entities)
- Store that knowledge persistently across sessions
- Answer "What did we decide?" with the actual decision record and confidence score
- Answer "What commitments are still open?" with person-owned commitment records
- Detect which decisions changed status across meetings
- Synthesize cross-meeting answers grounded in cited evidence
- Reject questions about topics that were never discussed

MeetMind cannot (currently):
- Guarantee hallucination-free answers at scale (no production traffic measurement)
- Handle multi-user collaborative meetings where the same entities appear under different names
- Process real-time audio streams
