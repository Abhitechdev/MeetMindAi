# PHASE 5: RELATIONSHIP INTELLIGENCE

## 1. Problem
MeetMind lacked explicit relationship mapping between entities, decisions, issues, and actions. Queries like "Who is responsible for the recurring API problem?" or "Which decision changed because of this issue?" required multi-hop inferencing that unstructured memory often fails to support reliably across multiple meetings.

## 2. Architecture
Instead of migrating to a heavy Graph DB (like Neo4j) or building a custom agent-swarm architecture (like MiroFish), we preserved the existing Postgres+LLM pipeline by introducing a lightweight, bounded relationship edge table `meeting_relationships` tied tightly to existing RLS policies.

## 3. Relationship Model
The `meeting_relationships` schema maps semantic edges without rigid ID constraints:
- `source_name`, `source_type`
- `relationship_type` (e.g. `owns`, `blocks`, `resolves`, `affects`, `depends_on`)
- `target_name`, `target_type`
- `source_reference` (Traceability evidence)

## 4. Retrieval Expansion & LLM Prompting
1. Modified the Gemini meeting-processing JSON schema to extract a `relationships` array natively during transcript ingestion.
2. In the cross-meeting query (`/meeting-memory/query`), `meeting_relationships` are now fetched alongside decisions, actions, commitments, and entities.
3. Expanded the context compiler to serialize relationships (e.g., `- Stripe (decision) -> affects -> Payment Project (project)`).
4. System prompt now enforces `Multi-Hop Relationships` rule, instructing the LLM to trace explicit graph connections provided in the context to answer causal queries.

## 5. Security & Isolation
- The `meeting_relationships` table relies on `meeting_id` as a foreign key.
- A strict Postgres RLS policy ensures a user can only query or insert relationships tied to meetings they own (`user_id = auth.uid()`).

## 6. Evaluation
- Wrote and verified 31 tests across multiple relationship classes (Person ownership, Decision, Project, Issue, Commitment, Multi-hop, Rejections).
- Ran sequentially without hitting rate-limit restrictions. 31/31 passed successfully.

## 7. Limitations
- Relationship generation depends entirely on the LLM's parsing capability during ingestion; highly ambiguous discussions might omit edges.
- Expansion is currently strictly bounded to the top 5 semantically matching meetings to prevent N+1 query explosion and context window limits. For large enterprise queries spanning 100+ meetings, a secondary indexing pass may be needed in the future.
