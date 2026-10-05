# MeetMind AI

> Evidence-grounded organizational memory that connects meetings, decisions, commitments, people, issues and changes across time.

---

## What it is

MeetMind AI transforms meeting recordings into a persistent, queryable organizational intelligence layer. It does not stop at transcription — it extracts structured knowledge, tracks decisions and commitments, detects what changed between meetings, models relationships between people and topics, and reasons across your entire meeting history to give you evidence-grounded answers.

---

## Problem

Most meeting AI tools stop at transcription and per-meeting summaries. The critical problems they leave unsolved:

- **"What did we decide?"** — no structured decision record
- **"What changed since last meeting?"** — no temporal tracking
- **"Who committed to what?"** — no commitment tracking
- **"Which issues keep recurring?"** — no cross-meeting correlation
- **"What is the current state of the payment integration?"** — no persistent memory

MeetMind solves all of these.

---

## Key Capabilities

| Capability | Description |
|---|---|
| Persistent Meeting Memory | All extracted knowledge persists across sessions in Supabase |
| Structured Extraction | Decisions, action items, commitments, participants, entities extracted per meeting |
| Semantic Retrieval | Find relevant meetings by topic, not just keyword |
| Intent-Aware Retrieval | Queries like "What remains unresolved?" map to the right tables |
| Temporal Change Detection | Compare decisions and commitments across meeting dates |
| Relationship Intelligence | Connects people, decisions, topics, projects across meetings |
| Cross-Meeting Reasoning | LLM synthesizes answers from multiple meetings with bounded evidence |
| Evidence Grounding | Every answer cites its source meeting/record |
| Tenant Isolation | Each user's data is isolated via Supabase RLS |

---

## Architecture

```
Meeting Audio / Video
        ↓
  Whisper / Assembly AI (Transcription)
        ↓
  NVIDIA NIM LLM (Structured Extraction)
        ↓
  Decisions │ Action Items │ Commitments │ Entities │ Relationships
        ↓
  Supabase / PostgreSQL (Persistent Memory)
        ↓
  Intent-Aware Retrieval ← query intent classification
        ↓
  Semantic Retrieval (text search + topic matching)
        ↓
  Relationship Expansion (people, projects, topics)
        ↓
  Temporal Change Detection (diff across meeting dates)
        ↓
  NVIDIA NIM LLM (Cross-Meeting Reasoning)
        ↓
  Evidence-Grounded Answer (with meeting citations)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Vanilla CSS |
| Backend | FastAPI (Python 3.11) |
| Database | Supabase (PostgreSQL) with RLS |
| Authentication | Supabase Auth (JWT) |
| LLM Provider | NVIDIA NIM (primary), Groq (fallback) |
| Transcription | Assembly AI / Whisper |
| Deployment | Vercel (frontend), Railway/Render (backend) |

---

## AI Pipeline

1. **Transcription** — Audio → text with speaker diarization
2. **Structured Extraction** — LLM extracts JSON: decisions, actions, commitments, participants, entities, relationships, executive summary
3. **Intent Classification** — Query intent mapped to DECISION / ACTION_ITEM / COMMITMENT / UNRESOLVED / CHANGE / PERSON / TOPIC
4. **Retrieval** — Intent-aware + semantic search across persistent memory
5. **Relationship Expansion** — Entities cross-referenced across meetings
6. **Temporal Analysis** — Chronological comparison of decisions and commitments
7. **Cross-Meeting Reasoning** — Bounded LLM synthesis with evidence from retrieved meetings
8. **Answer** — Response with explicit source citations

---

## Persistent Memory

Every processed meeting is stored with:

- `executive_summary` — high-level summary
- `decisions` — structured decision records with status, confidence, participants
- `action_items` — tasks with owner and source reference
- `commitments` — person-owned commitments with due date and status
- `meeting_entities` — people, projects, topics, risks mentioned
- `meeting_relationships` — entity-to-entity relationships
- `tags` — topic tags for fast retrieval

Memory persists indefinitely and is queried on every cross-meeting request.

---

## Decision Intelligence

Decisions are stored with:
- `decision_text` — what was decided
- `status` — CURRENT / SUPERSEDED / REVERSED / PROPOSED
- `confidence` — 0–1 score from LLM extraction
- `participants` — people who made the decision
- `source_reference` — speaker/timestamp citation

Superseded decisions are tracked so the system can answer "what changed?" accurately.

---

## Change Intelligence

MeetMind can detect:
- Decisions that changed status between meetings
- Commitments that moved from OPEN to COMPLETED
- New topics or projects that appeared
- Items that appear in multiple meetings (recurring issues)

The system compares meetings chronologically to build a temporal picture of organizational change.

---

## Relationship Intelligence

Extracted entities (people, projects, topics) and their relationships are stored in `meeting_entities` and `meeting_relationships`. This allows:
- "Who is involved in the payment integration?"
- "What projects is Alice working on?"
- "What depends on the infrastructure decision?"

---

## Cross-Meeting Reasoning

The cross-meeting query pipeline:
1. Classifies query intent
2. Retrieves relevant meetings by intent + semantic match
3. Expands via relationships
4. Constructs bounded context window
5. LLM synthesizes answer strictly from retrieved evidence
6. Response includes meeting citations

The LLM is explicitly instructed not to invent facts not present in the retrieved context.

---

## Evidence Grounding

Every answer includes:
- Which meetings were searched
- Which records (decisions/commitments/actions) were used
- Speaker/timestamp source references where available

---

## Security

- **Tenant isolation**: Supabase Row Level Security (RLS) — each user sees only their own meetings
- **Authentication**: JWT via Supabase Auth on every endpoint
- **Rate limiting**: In-memory per-IP rate limiting (429 on excess)
- **Input validation**: Pydantic schema validation, max payload sizes
- **Upload security**: Extension whitelist, 100MB max
- **Secrets**: `SUPABASE_SERVICE_ROLE_KEY` is never exposed to frontend or bundled
- **Prompt injection**: System prompts instruct the LLM to only use retrieved context

---

## Evaluation

Evaluated against a 60-question benchmark (see `MEETMIND_EVALUATION_DATASET.md`):

| Category | Questions | Method |
|---|---|---|
| Basic Memory | 5 | Automated (mock data) |
| Semantic Retrieval | 5 | Automated + manual |
| Intent Retrieval | 5 | Automated |
| Decisions | 5 | Automated |
| Commitments | 5 | Automated |
| Change Detection | 5 | Structural verification |
| Unresolved Issues | 5 | Automated |
| Relationships | 5 | Structural verification |
| Cross-Meeting Reasoning | 5 | Real data (Phase 3 validation) |
| Negative/Unknown | 10 | Automated |

18 automated evaluation tests pass. Full semantic evaluation requires live LLM + real meeting data (documented limitation).

---

## Performance

| Path | P50 | P95 |
|---|---|---|
| GET /meetings | 9.6ms | 25.2ms |
| POST /meeting-memory/query | 22.6ms | 50.9ms |
| Unauthenticated reject | 5.4ms | 7.9ms |
| Audio processing (NVIDIA NIM, live) | ~5–15s | ~20s |
| Cross-meeting query with LLM (live) | — | ~2.7s |

---

## Limitations

- In-memory rate limiter (not distributed — single process only)
- Transcription quality depends on audio clarity
- Cross-meeting reasoning bounded by context window size
- No real-time collaboration features
- Evaluation dataset is partially synthetic (real meeting data limited)
- LLM extraction quality varies by meeting clarity

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env    # Fill in your keys
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # Fill in your keys
npm run dev
```

---

## Environment Variables

### Backend `.env`

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NVIDIA_API_KEY=your_nvidia_key
GROQ_API_KEY=your_groq_key          # optional fallback
ASSEMBLYAI_API_KEY=your_assemblyai_key
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Never commit `.env` files.** The `.gitignore` excludes all `.env*` files.

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy --prod
```

### Backend (Railway / Render)
Set environment variables in the platform dashboard.  
The backend starts with:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Database Migrations
Apply SQL migrations in order:
```
supabase/migrations/20260623_init.sql
supabase/migrations/20260624_auth_and_rls.sql
supabase/migrations/20261005_memory.sql
supabase/migrations/20261005_phase3.sql
supabase/migrations/20261005_phase5.sql
```

---

## Demo Video

See `DEMO_SCRIPT.md` for the 90-second demo walkthrough.

---

## Future Improvements

- Redis-backed distributed rate limiting
- Streaming LLM responses for faster perceived latency
- Real-time meeting processing (live audio stream)
- Calendar integration for automatic meeting capture
- Slack/Teams notifications for open commitments
- Keyboard-first CLI for power users
- Multi-language support (transcription supports this, extraction can be extended)
