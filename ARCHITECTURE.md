# MeetMind AI — System Architecture

**Version:** 1.0 — Phase 8 Final  
**Status:** Architecture Frozen

---

## High-Level Data Flow

```
Meeting Audio / Video
         │
         ▼
  ┌─────────────────┐
  │   Transcription  │  AssemblyAI / Whisper
  │  (speaker labels)│
  └────────┬────────┘
           │  raw transcript + speaker segments
           ▼
  ┌─────────────────────────────────────────┐
  │   Structured Meeting Intelligence        │
  │   NVIDIA NIM LLM (primary)              │
  │   Groq (fallback)                       │
  │                                         │
  │   Extracts:                             │
  │   - executive_summary                   │
  │   - decisions (text, status, confidence)│
  │   - action_items (text, owner)          │
  │   - commitments (person, due_date)      │
  │   - participants                        │
  │   - entities (people, projects, topics) │
  │   - relationships (A→B type)            │
  └────────┬────────────────────────────────┘
           │  structured JSON
           ▼
  ┌─────────────────────────────────────────┐
  │   Supabase / PostgreSQL                 │
  │   (Persistent Memory)                   │
  │                                         │
  │   Tables:                               │
  │   meetings          (summary, tags)     │
  │   decisions         (status, confidence)│
  │   action_items      (owner, reference)  │
  │   commitments       (person, due, status│
  │   meeting_entities  (type, name)        │
  │   meeting_relationships (A→B, type)     │
  └────────┬────────────────────────────────┘
           │
    ┌──────┴──────────────────────────────────┐
    │         Query Pipeline                  │
    │                                         │
    │  1. Intent Classification               │
    │     LLM maps query →                    │
    │     DECISION / ACTION_ITEM /            │
    │     COMMITMENT / UNRESOLVED /           │
    │     CHANGE / PERSON / TOPIC             │
    │                                         │
    │  2. Intent-Aware Retrieval              │
    │     SELECT from appropriate table(s)    │
    │     based on classified intent          │
    │                                         │
    │  3. Semantic Retrieval                  │
    │     Full-text + topic tag search        │
    │     across meetings                     │
    │                                         │
    │  4. Relationship Expansion              │
    │     Fetch related entities across       │
    │     meeting_relationships               │
    │                                         │
    │  5. Temporal Analysis                   │
    │     Order by meeting date               │
    │     Detect status changes               │
    │                                         │
    │  6. Bounded Context Construction        │
    │     Assemble retrieved records          │
    │     into LLM prompt context             │
    │                                         │
    │  7. Cross-Meeting Reasoning             │
    │     NVIDIA NIM LLM synthesizes          │
    │     answer strictly from context        │
    │                                         │
    │  8. Evidence-Grounded Response          │
    │     Answer + source citations           │
    └─────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend — Next.js 16 (App Router)

```
frontend/
  app/
    layout.tsx              — root layout, auth check
    page.tsx                — landing page
    meeting/[id]/page.tsx   — meeting detail with AI output
    history/                — meeting history list
    decisions/              — decision dashboard
    actions/                — action item dashboard
    components/
      audio-upload.tsx      — file upload with drag+drop (accessible)
      chat-bot.tsx          — per-meeting Q&A
      global-chat-bot.tsx   — cross-meeting query interface
      meeting-orchestrator.tsx — processing pipeline UI
      summary-viewer.tsx    — structured output display
      nav.tsx               — authenticated navigation
  middleware.ts             — auth redirect middleware
```

### Backend — FastAPI

```
backend/
  app/
    main.py                 — all routes + dependency injection
    services/
      gemini_service.py     — LLM pipeline (extraction, reasoning, fallback)
```

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| GET | /meetings | List all user meetings (RLS enforced) |
| POST | /upload | Upload audio file for processing |
| POST | /process | Process transcript → structured extraction |
| POST | /chat | Per-meeting Q&A |
| POST | /meeting-memory/query | Cross-meeting reasoning query |
| GET | /meeting-memory/{id} | Retrieve stored meeting memory |

### Database — Supabase (PostgreSQL)

```sql
-- Core tables
meetings              (id, user_id, title, transcript, executive_summary, tags, created_at)
decisions             (id, meeting_id, decision_text, status, confidence, participants, source_reference)
action_items          (id, meeting_id, action_text, owner, source_reference)
commitments           (id, meeting_id, person, commitment_text, due_date, status, confidence)
meeting_entities      (id, meeting_id, entity_type, entity_name, normalized_name, metadata)
meeting_relationships (id, meeting_id, source_name, relationship_type, target_name, confidence)
```

**All tables have RLS enabled.** Policies enforce `user_id = auth.uid()` via the `meetings` parent table.

---

## Authentication & Security

```
Client Request
     │
     ▼
FastAPI endpoint
     │
     ├─ get_user_supabase() ──→ validates JWT from Authorization header
     │                          creates Supabase client with user context
     │                          raises 401 if token invalid/missing
     │
     ▼
Supabase client (with user JWT)
     │
     ▼
PostgreSQL with RLS active
     │
     └─ All queries filtered to auth.uid() automatically
```

**Security controls verified in Phase 7:**
- JWT validation on every endpoint
- RLS tenant isolation (verified by integration tests)
- Rate limiting: 3 requests/10s per IP (in-memory)
- Input validation: Pydantic schemas, max payload sizes
- Upload whitelist: `.mp3 .wav .m4a .mp4 .webm .mov .avi`, max 100MB
- Prompt injection resistance: LLM prompted to use only retrieved context
- Secrets: service-role key never in frontend bundle

---

## LLM Fallback Architecture

```python
# ponytail: iterate candidates, first success wins
CANDIDATES = [
    ("nvidia", "meta/llama-3.1-70b-instruct"),
    ("groq",   "llama-3.1-70b-versatile"),
]

def _create_completion(client, models, messages):
    last_err = None
    for model in models:
        try:
            return client.chat.completions.create(model=model, messages=messages)
        except Exception as e:
            last_err = e
    raise last_err
```

If both providers fail, the error propagates as HTTP 500 (not a silent failure).

---

## Retrieval Architecture

### Intent Map

| Query Pattern | Intent | Tables Queried |
|---|---|---|
| "What did we decide" | DECISION | decisions |
| "What commitments" | COMMITMENT | commitments |
| "What action items" | ACTION_ITEM | action_items |
| "What remains unresolved" | UNRESOLVED | action_items + commitments (OPEN) |
| "What changed" | CHANGE | decisions (chronological diff) |
| "Who is responsible" | PERSON | commitments + entities (person type) |
| "What about [topic]" | TOPIC | meetings (semantic) + decisions + entities |

### Retrieval Pipeline

1. Parse intent via LLM (fast, small prompt)
2. Pull intent-specific records (up to 20 per table)
3. Pull recent meetings as context (up to 5)
4. Cross-reference entities and relationships
5. Assemble bounded context (token-limited)
6. LLM reasons over context, cites sources

---

## Deployment Topology

```
User Browser
     │  HTTPS
     ▼
Vercel (Next.js frontend)
     │  HTTPS API calls
     ▼
Railway/Render (FastAPI backend)
     │  Supabase SDK
     ▼
Supabase (PostgreSQL + Auth + RLS)
     │
     ├─ NVIDIA NIM (LLM)
     └─ AssemblyAI (transcription)
```

---

## Known Architecture Ceilings

| Component | Current Ceiling | Upgrade Path |
|---|---|---|
| Rate limiting | In-memory, single process | Redis + slowapi |
| Retrieval | Keyword + semantic text search | pgvector embeddings |
| LLM context | Single bounded window | Multi-step retrieval + summarization |
| Transcription | AssemblyAI per file | Real-time streaming |
| Entity resolution | String normalization | Fuzzy match + canonical entity store |
