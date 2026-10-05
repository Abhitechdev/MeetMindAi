# Phase 3 Evaluation: Decision + Commitment Intelligence

## Overview
This document tracks the acceptance criteria for Phase 3: organizational intelligence via cross-meeting tracking of decisions and commitments.

## Execution Status
- **Total Scenarios**: 22
- **ACTUALLY EXECUTED**: 6
- **STRUCTURALLY VERIFIED**: 16
- **NOT EXECUTED**: 0

*Note: As per strict directives, only scenarios physically run through the test harness are marked ACTUALLY EXECUTED.*

---

## 1. Decision Status and Lifecycle
| ID | Question | Expected Capability | Status |
|---|---|---|---|
| D1 | What is our current decision on the frontend framework? | Show CURRENT DECISION (Svelte) and HISTORY (React). | ACTUALLY EXECUTED |
| D2 | What changed between meetings about the UI? | Identify that decision evolved from React to Svelte. | ACTUALLY EXECUTED |
| D3 | Which decisions are current versus historical? | Output both current and historical decisions clearly. | ACTUALLY EXECUTED |
| D4 | Did we ever consider Vue? | Recognize historical mention in Feb Pivot but note it wasn't the final decision. | STRUCTURALLY VERIFIED |
| D5 | What is our confidence level in the database choice? | Surface confidence score if requested. | STRUCTURALLY VERIFIED |
| D6 | Who participated in the decision to pivot the UI strategy? | Pull participants list from decision metadata. | STRUCTURALLY VERIFIED |

## 2. Commitments & Open Items
| ID | Question | Expected Capability | Status |
|---|---|---|---|
| C1 | What commitments were made by Dave? | List OPEN COMMITMENTS for Dave. | ACTUALLY EXECUTED |
| C2 | Which commitments remain unresolved? | List commitments with OPEN or OVERDUE status. | ACTUALLY EXECUTED |
| C3 | Are there any commitments due next week? | Filter commitments by due_date. | STRUCTURALLY VERIFIED |
| C4 | Did Alice complete her commitment? | Retrieve COMPLETED commitments for Alice. | STRUCTURALLY VERIFIED |
| C5 | What is the difference between Dave's commitment and Charlie's action item? | Differentiate `commitments` table vs `action_items` table. | STRUCTURALLY VERIFIED |

## 3. Action Items
| ID | Question | Expected Capability | Status |
|---|---|---|---|
| A1 | Which action items are still pending? | Retrieve actions with `status: pending`. | ACTUALLY EXECUTED |
| A2 | Who is responsible for the CI/CD pipeline? | Show owner from action items metadata. | STRUCTURALLY VERIFIED |
| A3 | Are there any actions unassigned? | Identify actions without an owner. | STRUCTURALLY VERIFIED |

## 4. Evidence and Integrity
| ID | Question | Expected Capability | Status |
|---|---|---|---|
| E1 | Prove that Alice agreed to use React. | Show EVIDENCE section with transcript timestamp/source. | STRUCTURALLY VERIFIED |
| E2 | What was the reasoning for changing to Svelte? | Combine decision history with context from executive summary. | STRUCTURALLY VERIFIED |
| E3 | What is our decision on the Kubernetes migration? | Explicit rejection response ("I couldn't find that information"). | STRUCTURALLY VERIFIED |
| E4 | Show me all decisions made in January. | Filter context by date. | STRUCTURALLY VERIFIED |
| E5 | Who said they would deliver marketing assets? | Pull person metadata from commitment. | STRUCTURALLY VERIFIED |

## 5. UI Structure Enforcement
| ID | Question | Expected Capability | Status |
|---|---|---|---|
| U1 | Provide a full project status update. | Display CURRENT DECISION, HISTORY, OPEN COMMITMENTS, and PENDING ACTIONS headings. | STRUCTURALLY VERIFIED |
| U2 | Just give me the pending actions. | Output only PENDING ACTIONS and EVIDENCE. | STRUCTURALLY VERIFIED |
| U3 | What is our current payment provider? | Output CURRENT DECISION and EVIDENCE. | STRUCTURALLY VERIFIED |
