# MeetMind AI

## What it is
MeetMind AI is an evidence-grounded organizational memory system that connects meetings, decisions, commitments, people, issues, and changes across time. It goes beyond simple transcription to extract structural meeting intelligence and enable cross-meeting semantic and intent-aware reasoning.

## Problem
Most meeting assistants stop at transcription and simple summaries. They fail to understand how a decision in one meeting affects a project discussed in another, or how relationships and commitments evolve over time. This leads to fragmented organizational knowledge.

## Key capabilities
- Persistent meeting memory extraction (Decisions, Commitments, Action Items)
- Semantic and intent-aware retrieval
- Temporal change detection
- Relationship intelligence
- Cross-meeting reasoning
- Evidence-grounded answers (every answer links to a specific meeting source)

## Architecture
MeetMind utilizes a modern serverless stack:
- **Frontend**: Next.js App Router (React)
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL with pgvector for embeddings)
- **AI Core**: Gemini 1.5 Flash via native API
- **Deployment**: Vercel (Frontend) / Render/Fly.io (Backend)

## Tech stack
- React / Next.js
- Tailwind CSS
- Python / FastAPI
- Supabase (Postgres, pgvector, Edge Functions, Auth)
- Gemini API

## AI pipeline
1. **Meeting Audio** processed and transcribed
2. **Transcription** fed into LLM for structuring
3. **Structured Meeting Intelligence** extracts entities (People, Decisions, Actions, Commitments)
4. **Persistent Memory** stored in vector database

## Persistent memory
All extracted items are persisted in Supabase with vector embeddings. This allows the system to recall decisions and commitments long after the meeting has concluded.

## Decision intelligence
Extracts and tracks the lifecycle of decisions, including identifying when an older decision is superseded by a newer one.

## Change intelligence
Detects temporal shifts across meetings, identifying changing requirements, extended deadlines, or evolving strategies.

## Relationship intelligence
Maps dependencies between people, projects, and commitments, allowing the system to answer questions like "Who works closely with Sarah?"

## Cross-meeting reasoning
Synthesizes information across multiple meetings to provide comprehensive answers to complex questions, such as tracking a feature's evolution over a quarter.

## Evidence grounding
Every AI claim is backed by a specific, traceable source reference to the original meeting transcript.

## Security
- Row Level Security (RLS) via Supabase isolates tenant data
- Robust prompt injection defenses
- Strictly bounded retrieval to prevent hallucinations
- Secure authentication

## Evaluation
MeetMind is continuously evaluated using a structured 50+ question benchmark covering memory retrieval, change detection, and reasoning, focusing on answer correctness and evidence validity.

## Performance
- Fast transcription processing
- Low-latency vector retrieval
- Evaluated against large-scale organizational data

## Limitations
- Full semantic evaluation requires live LLM calls and real meeting datasets.
- Currently relies on external LLM availability (Gemini).
- Best suited for structured, professional meetings rather than casual conversations.

## Local setup
1. Clone the repository
2. Set up the Python backend (`venv`, `pip install -r requirements.txt`)
3. Set up the Next.js frontend (`npm install`)
4. Configure environment variables for Supabase and Gemini
5. Run the dev servers

## Environment variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Backend only)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## Deployment
The frontend is optimized for Vercel deployment. The backend can be deployed to any Docker-compatible hosting platform. Ensure all environment variables are securely configured.

## Screenshots
*(Add screenshots here)*

## Demo video
*(Add demo video link here)*

## Future improvements
- Live, real-time meeting ingestion
- Deeper integration with project management tools (Jira, Linear)
- Local LLM support for air-gapped environments
