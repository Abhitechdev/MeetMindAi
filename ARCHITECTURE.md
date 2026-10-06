# MeetMind AI Architecture

## Data Flow

Meeting Audio
↓
Transcription
↓
Structured Meeting Intelligence
↓
People / Decisions / Actions / Commitments / Issues / Projects
↓
Persistent Memory
↓
Semantic Retrieval
↓
Intent Retrieval
↓
Temporal Change Detection
↓
Relationship Expansion
↓
Cross-Meeting Reasoning
↓
Evidence-Grounded Answer

## Core Components

### Frontend (Next.js App Router)
- Provides the UI for uploading meetings, viewing memory, and asking questions.
- Communicates directly with Supabase for authenticated state and some reads.
- Calls the FastAPI backend for processing and LLM interactions.

### Backend (FastAPI)
- Handles the core business logic.
- Integrates with the Gemini LLM for entity extraction, semantic reasoning, and intent detection.
- Provides endpoints for memory retrieval and processing.

### Database (Supabase / PostgreSQL)
- Stores all structured meeting intelligence (Decisions, Commitments, Action Items, Entities).
- Uses `pgvector` for semantic search embeddings.
- Manages user authentication and Row Level Security (RLS) to enforce tenant isolation.

## Key Architectural Decisions

### Authentication & Tenant Isolation
- Authentication is handled via Supabase Auth.
- Row Level Security (RLS) is strictly enforced at the database level. Queries inherently filter by the authenticated user's ID, ensuring robust tenant isolation without risking application-level bugs exposing data.

### Bounded Retrieval
- The system employs a "bounded retrieval" strategy. Instead of feeding the entire database to the LLM, the backend first performs semantic and intent-based filtering in the database.
- The LLM only receives a focused subset of relevant records, preventing hallucinations and reducing token costs.

### LLM Fallback
- Designed to gracefully handle LLM API outages or rate limits.
- If the primary LLM (Gemini) fails, the system provides appropriate error messages to the frontend rather than crashing silently.

### Structured Extraction
- Instead of just producing a text summary, the transcription is rigorously parsed into discrete, typed entities (Decisions, Commitments, Action Items) with statuses (e.g., OPEN, CURRENT, SUPERSEDED).
- This allows for SQL-like querying of organizational memory in addition to semantic search.
