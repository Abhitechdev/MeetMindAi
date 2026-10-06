# EVALUATION: RELATIONSHIP INTELLIGENCE (PHASE 5)

This file contains the 31 evaluation questions used to test the Phase 5 relationship-aware intelligence system, divided into semantic categories.

## Test Results: 31/31 Passed (100% Success)
_Tested via `test_relationship_intelligence_phase5.py`_

### A. Person Ownership
1. "Who owns the authentication action item?"
2. "Who owns the API timeout action item?"
3. "Who made the original payment decision?"
4. "Who was originally responsible for authentication, and who owns it now?"
5. "Who owns the unresolved authentication work?"

### B. Decision Relationships
6. "Which decisions affect the payment project?"
7. "Which action items are connected to the payment decision?"
8. "Which decision changed because of the webhook problem?"
9. "Show the relationship between the payment issue and the current decision."
10. "Which decisions changed because of this issue?"

### C. Project Relationships
11. "Which unresolved issues are blocking the payment project?"
12. "Which people are involved in Project X?"
13. "Which commitments belong to Project X?"
14. "What decisions are in Project X?"
15. "What action items are part of the payment project?"

### D. Issue Relationships
16. "Which action items are connected to the authentication issue?"
17. "Who owns the action items related to the API problem?"
18. "Which people are repeatedly involved in this issue?"
19. "What is the root cause issue?"
20. "Is the API timeout issue connected to Stripe?"

### E. Commitment Relationships
21. "Which commitments are connected to Project X?"
22. "Which commitments are connected to the unresolved payment issue?"
23. "Who committed to the webhook task?"
24. "What commitment is Ravi making?" (Negative test)
25. "Is there a commitment for Stripe?"

### F. Multi-Hop Reasoning
26. "Show me the chain from the API problem to the current decision."
27. "Who owns work related to the unresolved authentication issue?"
28. "How does Abhishek's work affect Ravi's decision?"
29. "What is the dependency graph of Stripe?"
30. "Trace the issue to the commitment."

### G. Out of Context / Rejection (Negative Tests)
31. "What is connected to Kubernetes?" (Gracefully declined)

## Metrics
- **Relationship Accuracy**: 100% on tested data.
- **Unsupported Relationship Rate**: Handled correctly (rejection) when querying unsupported edges.
- **Tenant Isolation Status**: Fully isolated via `meeting_relationships` RLS.
