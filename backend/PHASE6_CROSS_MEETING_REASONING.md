# PHASE 6: CROSS-MEETING REASONING & ORGANIZATIONAL INTELLIGENCE

## 1. Problem
MeetMind historically functioned as a retrieval and summarization engine. It could fetch individual pieces of data (e.g., "What was the decision?") but lacked the capability to synthesize organizational intelligence across meetings (e.g., "Why did it change?", "What is at risk?", "What is blocking this?").

## 2. Architecture
Instead of building heavy agentic swarms (like MiroFish) or exporting data to a separate Graph Database (like Neo4j), we leverage the LLM’s existing context window over our bounded, relationship-enriched structured memory model (Phases 1-5). 

The LLM is provided:
- Metadata & Executive Summary
- Decisions (current & historical)
- Action Items
- Commitments (with due dates & status)
- Entities (Projects/Issues)
- Explicit Relationships

The `cross_meeting_query` endpoint was updated with a strict, structured reasoning prompt.

## 3. Reasoning Pipeline
1. **USER QUESTION** -> Evaluated for Intents (e.g., DECISION, HISTORY, UNRESOLVED)
2. **RELEVANT MEMORY** -> Retrieved using keyword & intent overlap.
3. **EVIDENCE INJECTION** -> Decisions, Commitments, Changes, and explicit Relationships appended.
4. **REASONING** -> LLM synthesizes current state and historical evolution based *only* on context.
5. **CONCLUSION & EVIDENCE** -> LLM formats output clearly and cites sources.

## 4. Features & Capabilities
### Current-State Derivation
Current state is derived on-the-fly from the latest decisions, open actions, and unresolved issues. We do *not* maintain a redundant "state" database table.

### Decision Evolution
The system traces chronologically. If a decision changes between meetings, it identifies the causal discussion (e.g., "Initially X. Following discussions on Y, the decision changed to Z").

### Commitment Risk
Identifies overdue, repeatedly carried-forward, or explicitly blocked commitments. Cautious language is strictly enforced ("Potentially at risk because...").

### Dependency Reasoning
Utilizes the `meeting_relationships` edges to explain blocker chains (e.g. Issue blocks Project -> delays milestones).

### Conflict Handling
If evidence is conflicting and chronology cannot resolve it, the system will *not* hallucinate an answer. It explicitly states: "The meeting records contain conflicting information, and the current state cannot be determined with confidence."

## 5. Security & Isolation
- Reasoning occurs strictly within the RLS-isolated bounds of a user's meetings. 
- LLM contexts are built only from data the user has access to. No cross-tenant data spillage is possible.

## 6. Performance
Latency remains comparable to Phase 5. The primary cost is context compilation and the LLM inference time. We enforce `max_tokens: 1024` and limit retrieval to the top 5 most relevant meetings to ensure stable response times.

## 7. Limitations
- Reasoning relies on the fidelity of the LLM processing the query. 
- Strict grounding rules occasionally result in false-negative "I couldn't find that information" rejections if synonyms are heavily mismatched.
- History tracking is constrained to the top 5 scored meetings. If an evolution spans 10+ meetings, earlier stages might be dropped from the immediate context window.
