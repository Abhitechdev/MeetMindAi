# MeetMind AI Implementation Audit

## A. Current Architecture
- **Frontend**: Next.js, React, Tailwind CSS.
- **Backend**: Python / FastAPI.
- **Database**: Supabase PostgreSQL.
- **Authentication**: Supabase Auth with RLS.
- **Infrastructure**: Simple setup intended for low-cost environments (e.g., Railway), relying on monolithic logic without complex microservices.

## B. Existing Meeting Data Model
The database currently tracks:
- `meetings`: ID, title, transcript, executive summary, tags, duration, sentiment, priority, word count, next steps, language.
- `action_items`: ID, meeting_id, action_text, status, created_at.
- `decisions`: ID, meeting_id, decision_text, status, created_at.

## C. Existing Transcript Pipeline
1. Audio file uploaded via FastAPI.
2. Saved to temporary file.
3. Transcribed using `whisper_service.transcribe` with single-concurrency lock.
4. Temporary file deleted.

## D. Existing AI Pipeline
- Uses Groq or NVIDIA API based on `.env` configuration.
- Single prompt extracts: title, executiveSummary, tags, sentiment, priority, decisions, actionItems, nextSteps.
- Chat endpoint `/chat` uses transcript and summary as direct context for Q&A, restricted to a single meeting.

## E. Existing Database Tables
- `meetings`
- `action_items`
- `decisions`
- `subscriptions`
- `transactions`

## F. Existing RLS / Tenant Isolation
- User scoped clients are created using the frontend's `Authorization` header (`get_user_supabase`).
- RLS policies ensure users can only query and mutate records where `user_id` matches their own.
- Tables like `meetings`, `action_items`, `decisions` all have RLS enabled (updated via migration `20260624_auth_and_rls.sql`).

## G. Existing Reusable Components
- `gemini_service.py`: LLM orchestration with `_create_completion` with retries/fallback.
- `main.py`: Handles Supabase connection and HTTP endpoints.
- `schemas.py`: Pydantic models for incoming and outgoing data.

## H. What can be extended safely
- Schema additions: We can safely add tables or columns (like `meeting_entities`, `source_reference`) via a new Supabase migration.
- AI pipeline: We can modify `PROMPT` in `gemini_service.py` to extract additional fields (People, Projects, Risks, etc.) along with source references.
- `/chat` or new endpoint `/api/research/meeting-memory/query`: We can implement cross-meeting retrieval using PostgreSQL full-text search or pgvector.

## I. What must NOT be changed
- The single FastAPI monolith.
- The use of Supabase for relational storage and auth.
- Current endpoints structure and request validation (unless explicitly adding new ones).
- RLS policies (only add them to new tables).

## J. Proposed Minimal Architecture for Persistent Meeting Memory
1. **Schema Updates**:
   - Create `meeting_entities` (for People, Projects, Risks, Topics).
   - Add `source_reference` (JSON containing speaker, timestamp) to `action_items`, `decisions`, and `meeting_entities`.
2. **Extraction Updates**:
   - Alter `PROMPT` to ask the LLM to output entities and exact transcript quotes/timestamps as `source_reference`.
3. **Retrieval Strategy**:
   - `pgvector` will be enabled.
   - We will embed the summaries and decisions of past meetings.
   - A new `/meeting-memory/query` endpoint will fetch the top relevant meeting summaries using vector similarity, inject them into a context prompt, and use the LLM to answer.

## K. Risks and Migration Concerns
- Increased LLM response size and latency during extraction due to complex entity parsing.
- Needing to parse LLM JSON robustly when citations/sources are added.
- Ensuring the vector column works smoothly in the local dev environment (pgvector is supported by Supabase).
- Avoiding prompt injection from untrusted transcripts.
