# MiroFish & MeetMind AI Architecture Analysis

## 1. MeetMind Current Architecture
- **Frontend**: Next.js, React, Tailwind CSS.
- **Backend**: Python / FastAPI, Uvicorn, strictly limited single-concurrency for Whisper to prevent OOM.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS).
- **Authentication**: Supabase Auth (integrated with RLS).
- **Processing Pipeline**: FastAPI single endpoint handles audio upload -> temp file -> Whisper transcription -> Gemini summary generation -> Supabase insertion.
- **Infrastructure**: Simple, low-cost deployment suitable for free-tier constraints (e.g., Railway), relying on monolithic logic without complex microservices.

## 2. MiroFish Architecture
- **Domain**: Swarm intelligence engine and prediction sandbox.
- **Core Mechanism**: Multi-agent technology where thousands of intelligent agents with independent personalities, long-term memory, and behavioral logic interact.
- **Workflow**: Ingests real-world seed information to construct a parallel digital world for rehearsing decisions and predicting outcomes through simulation.
- **Complexities**: Heavy focus on multi-agent orchestration, dynamic state management, simulation environments, and likely intensive graph/relational reasoning for agent interactions.

## 3. Architecture Comparison
| Feature | MeetMind AI | MiroFish |
|---------|-------------|----------|
| **Goal** | Deterministic processing (Audio -> Text -> Summary) | Predictive simulation (Seed Data -> Agent Interaction -> Outcome) |
| **Agents** | Single linear pipeline (Whisper -> Gemini) | Swarm/Multi-agent (Thousands of independent personas) |
| **Memory** | Isolated per-meeting (currently) | Long-term, continuous, cross-agent memory |
| **Complexity** | Lean, monolithic, low memory footprint | Heavy, highly concurrent, complex orchestration |

## 4. Useful MiroFish Concepts
- **Agent Specialization**: Breaking down monolithic LLM synthesis into focused, specialized roles (e.g., one agent for decisions, one for action items).
- **Long-Term Memory**: Retaining context across discrete events (meetings) to inform future interactions.
- **Graph-Based Reasoning**: Connecting distinct entities (people, topics, decisions) to understand broader relational context.

## 5. Potential MeetMind Improvements
Applying MiroFish concepts cautiously can yield significant value:
- **Decision & Action Item Graphing**: Structuring the output not just as text, but as relational entities linked across multiple meetings.
- **Cross-Meeting Intelligence**: Querying past meetings to answer longitudinal questions.
- **Focused Analytical Agents**: Replacing a single massive prompt with a pipeline of specialized prompts (e.g., "Decision Extractor" -> "Risk Analyst").

## 6. Knowledge Graph Opportunities
Currently, MeetMind stores text in relational tables (`meetings`, `action_items`, `decisions`). By adopting a graph conceptual model (People -> Meetings -> Topics -> Decisions -> Action items):
- **Benefits**: Enhances meeting search, decision tracking, and discovery of recurring topics.
- **Implementation**: Avoid dedicated graph databases like Neo4j. Instead, use Supabase (PostgreSQL) with strict foreign keys and potentially recursive CTEs or standard joins to represent these connections cheaply.

## 7. Long-Term Memory Opportunities
- **Concept**: "What did we decide about X last month?"
- **Implementation**: Instead of isolating meetings, implement a RAG (Retrieval-Augmented Generation) layer using `pgvector` in Supabase. The LLM synthesis step can query previous meetings for the same user/tenant to inject historical context.

## 8. Multi-Agent Opportunities
- **Concept**: Transcript Analyst -> Decision Extractor -> Action Item Analyst.
- **Implementation**: Implement a lightweight, sequential LLM chain in FastAPI. Avoid heavy multi-agent frameworks (like OASIS or specialized orchestrators) to keep the backend simple and fast.

## 9. Cross-Meeting Intelligence Opportunities
With a relational graph and long-term memory, MeetMind can answer:
- "Which action items are still unresolved from previous meetings?"
- "What decisions were made about Project X over the last quarter?"
This requires aggregating data across the `user_id` scope and feeding it into a conversational interface.

## 10. Privacy/Security Analysis
- **Tenant Isolation**: MeetMind processes sensitive audio. Any cross-meeting memory or graph relationships must strictly enforce `user_id` isolation.
- **Supabase RLS**: All graph queries and vector searches must run under the authenticated user's RLS context.
- **Risk**: Multi-agent orchestration increases the risk of prompt injection or accidental data leakage if context from one meeting bleeds into another user's prompt. Strict RLS enforcement in FastAPI (`get_user_supabase`) mitigates this.

## 11. Cost Analysis
- **Graph Storage**: Supabase Postgres handles relational mapping perfectly; no extra cost for Neo4j.
- **Multi-Agent Prompts**: Splitting tasks into multiple LLM calls will increase API costs (e.g., Gemini API usage) and latency. It should be reserved for "Pro" tier users or optimized using smaller, cheaper models for extraction tasks.

## 12. Deployment Impact
- Retain the current Next.js + FastAPI + Supabase stack. 
- Avoid Kafka, Redis, or dedicated Graph DBs. 
- The impact on deployment is minimal if graph and memory logic are handled within Postgres and standard Python logic.

## 13. Skills Already Available
In `.agents/skills/`:
- `brag`
- `design-taste-frontend`
- `meetmind-content-auditor`
- `supabase`
- `supabase-postgres-best-practices`

## 14. Skills Newly Installed
None. Existing skills (especially `supabase-postgres-best-practices`) are sufficient to implement the relational graph and memory features without introducing unnecessary dependencies.

## 15. Skills Rejected
- Framework-heavy multi-agent skills (e.g., CrewAI, AutoGen) were rejected because they would overcomplicate the monolithic FastAPI backend and risk OOM in constrained environments.

## 16. KEEP / CONSIDER LATER / REJECT Table

| Concept | Status | Rationale |
|---------|--------|-----------|
| **Decision Graph (Relational)** | **KEEP** | High value for tracking ownership and outcomes. Can be done natively in Supabase without new DBs. |
| **Long-Term Memory (pgvector)** | **KEEP** | Enables cross-meeting intelligence. Supabase supports this natively; requires minor API updates. |
| **Agent Specialization (Pipeline)** | **KEEP** | Focused LLM calls improve accuracy for extraction tasks, though slightly increases latency. |
| **Full Swarm Orchestration** | **REJECT** | MeetMind doesn't need thousands of interacting agents. It needs deterministic extraction. |
| **Dedicated Graph DB (Neo4j)** | **REJECT** | Adds deployment complexity and cost. Postgres can handle the required relational depth. |
| **Persona Modeling** | **CONSIDER LATER** | Modeling meeting participants could be useful but raises privacy and data-retention concerns. |

## 17. Recommended Next Implementation Phase
**Phase 1: Relational Decision Graph & pgvector Memory**
1. Upgrade Supabase schema to support explicit linking between `Topics`, `Decisions`, and `Action Items` (Standard Postgres relations).
2. Enable the `pgvector` extension in Supabase to embed meeting summaries and decisions for long-term memory retrieval.
3. Update the FastAPI `/chat` endpoint to perform a vector search across the user's past meetings before passing context to Gemini, enabling cross-meeting intelligence safely under RLS.
