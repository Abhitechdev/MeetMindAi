# MeetMind AI — Resume Bullets

These bullets describe only implemented functionality with verified results.
No inflated claims, no production scale numbers that were not measured.

---

## Engineering Resume Bullets

**Built MeetMind AI**, an evidence-grounded organizational memory system using Next.js, FastAPI, Supabase (PostgreSQL with RLS), and NVIDIA NIM; implemented a structured extraction pipeline that converts meeting audio into queryable decisions, commitments, action items, and relationships, with intent-aware cross-meeting retrieval that maps query semantics directly to database operations rather than relying on pure vector search.

**Designed and hardened a multi-tenant AI backend** with Supabase Row Level Security enforcing user isolation at the database layer, JWT validation on every endpoint, in-memory rate limiting, Pydantic input validation, and a verified LLM fallback chain (NVIDIA NIM → Groq); 35 automated tests cover security, resilience, and evaluation correctness.

**Implemented a temporal change detection and relationship intelligence layer** that tracks decision status (CURRENT / SUPERSEDED) across meetings, persists entity-to-entity relationships, and synthesizes bounded evidence-grounded answers to cross-meeting questions such as "What commitments are still open?" and "What changed since last meeting?" — verified in real-data end-to-end validation with live Supabase and NVIDIA NIM.

---

## Usage Notes

- Use bullet 1 for AI/ML or full-stack roles
- Use bullet 2 for backend, security, or platform roles  
- Use bullet 3 for data engineering, NLP, or AI product roles
- These can be shortened by removing the tech stack detail for non-technical audiences
- Do not claim production user numbers — none were measured

---

## Project Description (One-Liner)

MeetMind AI is an evidence-grounded organizational memory system that connects meetings, decisions, commitments, people, issues and changes across time. It combines structured meeting intelligence, semantic and intent-aware retrieval, temporal change detection, relationship-aware retrieval, and bounded cross-meeting reasoning with traceable evidence.
