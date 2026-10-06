# MEETMIND EVALUATION DATASET

This dataset provides the benchmark for testing the MeetMind AI meeting memory, intent extraction, and reasoning engine.

## Categories

A. Basic meeting memory (5)
B. Semantic retrieval (5)
C. Intent retrieval (5)
D. Decisions (5)
E. Commitments (5)
F. Change detection (5)
G. Unresolved issues (5)
H. Relationships (5)
I. Cross-meeting reasoning (5)
J. Negative / unknown questions (5)

---

### A. Basic meeting memory

1. **Question:** What was the main topic of the Q3 planning meeting?
   - **Expected Answer:** The main topic was the Q3 roadmap, including payment integrations and Kubernetes migration.
   - **Required Evidence:** Topic extraction from Q3 planning audio.
   - **Category:** Basic meeting memory

2. **Question:** Who attended the architecture review on Tuesday?
   - **Expected Answer:** John, Sarah, and Mike.
   - **Required Evidence:** Speaker detection or attendee mentions in the transcript.
   - **Category:** Basic meeting memory

3. **Question:** When is the final deadline for the payment integration?
   - **Expected Answer:** End of Q3.
   - **Required Evidence:** Deadline extraction from Q3 planning meeting.
   - **Category:** Basic meeting memory

4. **Question:** Did we discuss the marketing budget?
   - **Expected Answer:** Yes, the marketing budget was discussed and increased by 10%.
   - **Required Evidence:** Transcript segment mentioning marketing budget.
   - **Category:** Basic meeting memory

5. **Question:** What was the overall sentiment of the client meeting?
   - **Expected Answer:** Positive, the client was happy with the progress.
   - **Required Evidence:** Sentiment analysis or direct quote from the client.
   - **Category:** Basic meeting memory

### B. Semantic retrieval

6. **Question:** What information do we have about Kubernetes?
   - **Expected Answer:** We are planning to migrate to Kubernetes by Q4.
   - **Required Evidence:** Mentions of Kubernetes and migration plans.
   - **Category:** Semantic retrieval

7. **Question:** Explain the new authentication flow discussed last week.
   - **Expected Answer:** The new flow involves OAuth2 and JWT tokens with a 1-hour expiration.
   - **Required Evidence:** Technical discussion regarding authentication.
   - **Category:** Semantic retrieval

8. **Question:** What are the requirements for the new API?
   - **Expected Answer:** It must be RESTful, support pagination, and handle 1000 RPS.
   - **Required Evidence:** API requirements gathered from the engineering sync.
   - **Category:** Semantic retrieval

9. **Question:** How does the caching mechanism work?
   - **Expected Answer:** It uses Redis with a TTL of 24 hours.
   - **Required Evidence:** Architecture discussion on caching.
   - **Category:** Semantic retrieval

10. **Question:** What were the main complaints from users regarding the UI?
    - **Expected Answer:** Users found the navigation confusing and the color contrast too low.
    - **Required Evidence:** User feedback session notes.
    - **Category:** Semantic retrieval

### C. Intent retrieval

11. **Question:** Why did we choose Stripe over PayPal?
    - **Expected Answer:** Stripe offered better developer documentation and lower transaction fees.
    - **Required Evidence:** Rationale provided during the payment gateway discussion.
    - **Category:** Intent retrieval

12. **Question:** What is the purpose of the new microservice?
    - **Expected Answer:** To decouple the payment processing from the main application.
    - **Required Evidence:** Explanation of the microservice architecture.
    - **Category:** Intent retrieval

13. **Question:** Why was the release delayed?
    - **Expected Answer:** Due to critical security vulnerabilities found during the audit.
    - **Required Evidence:** Reasons stated in the post-mortem meeting.
    - **Category:** Intent retrieval

14. **Question:** What is the motivation behind the UI redesign?
    - **Expected Answer:** To improve accessibility and user engagement.
    - **Required Evidence:** Goals outlined in the design kick-off.
    - **Category:** Intent retrieval

15. **Question:** Why are we hiring a new DevOps engineer?
    - **Expected Answer:** To handle the increased workload from the Kubernetes migration.
    - **Required Evidence:** Justification given in the resource planning meeting.
    - **Category:** Intent retrieval

### D. Decisions

16. **Question:** What did we decide about authentication?
    - **Expected Answer:** We decided to implement OAuth2 with Google and GitHub providers.
    - **Required Evidence:** Explicit decision logged in the meeting.
    - **Category:** Decisions

17. **Question:** Which cloud provider was selected?
    - **Expected Answer:** AWS was selected.
    - **Required Evidence:** Decision outcome from the infrastructure review.
    - **Category:** Decisions

18. **Question:** Was the budget increase approved?
    - **Expected Answer:** Yes, the budget increase was approved by the finance team.
    - **Required Evidence:** Approval confirmation in the transcript.
    - **Category:** Decisions

19. **Question:** What is the agreed-upon SLA?
    - **Expected Answer:** 99.9% uptime.
    - **Required Evidence:** SLA agreement discussed with the client.
    - **Category:** Decisions

20. **Question:** Did we decide to open-source the core library?
    - **Expected Answer:** No, the decision was deferred to the next quarter.
    - **Required Evidence:** Record of the deferred decision.
    - **Category:** Decisions

### E. Commitments

21. **Question:** Who owns the payment integration task?
    - **Expected Answer:** Sarah owns the payment integration task.
    - **Required Evidence:** Commitment assignment to Sarah.
    - **Category:** Commitments

22. **Question:** What did John promise to deliver by Friday?
    - **Expected Answer:** John promised to deliver the API documentation.
    - **Required Evidence:** Verbal or written commitment from John.
    - **Category:** Commitments

23. **Question:** Which commitments are still open?
    - **Expected Answer:** (List of open commitments, e.g., the security audit and the UI mockups).
    - **Required Evidence:** Status of all commitments.
    - **Category:** Commitments

24. **Question:** Who is responsible for setting up the staging environment?
    - **Expected Answer:** The DevOps team (specifically Mike).
    - **Required Evidence:** Assignment of the staging environment task.
    - **Category:** Commitments

25. **Question:** Has the marketing team committed to a launch date?
    - **Expected Answer:** Yes, they committed to November 15th.
    - **Required Evidence:** Date commitment from the marketing team.
    - **Category:** Commitments

### F. Change detection

26. **Question:** What changed since the previous meeting?
    - **Expected Answer:** The timeline was extended by two weeks, and a new developer joined the team.
    - **Required Evidence:** Comparison of current and previous meeting states.
    - **Category:** Change detection

27. **Question:** Which decision replaced the earlier decision about the database?
    - **Expected Answer:** We switched from MongoDB to PostgreSQL.
    - **Required Evidence:** Documentation of the decision change.
    - **Category:** Change detection

28. **Question:** How did the payment strategy evolve?
    - **Expected Answer:** It evolved from a single provider (Stripe) to a multi-provider setup (Stripe + PayPal).
    - **Required Evidence:** History of discussions regarding payment strategy.
    - **Category:** Change detection

29. **Question:** What is the new deadline for the project?
    - **Expected Answer:** The deadline was moved from Oct 1st to Oct 15th.
    - **Required Evidence:** Explicit mention of the deadline change.
    - **Category:** Change detection

30. **Question:** Have the requirements for the mobile app changed?
    - **Expected Answer:** Yes, offline support is now a mandatory requirement.
    - **Required Evidence:** Updated requirement list compared to the original.
    - **Category:** Change detection

### G. Unresolved issues

31. **Question:** Which issues keep recurring?
    - **Expected Answer:** The issue with the database connection pooling keeps recurring.
    - **Required Evidence:** Multiple mentions of the same issue across meetings.
    - **Category:** Unresolved issues

32. **Question:** Who is responsible for the unresolved API issue?
    - **Expected Answer:** The backend team is responsible.
    - **Required Evidence:** Assignment of the unresolved issue.
    - **Category:** Unresolved issues

33. **Question:** What is currently blocking Project X?
    - **Expected Answer:** Project X is blocked by the pending security audit.
    - **Required Evidence:** Identification of the blocker for Project X.
    - **Category:** Unresolved issues

34. **Question:** What was left undecided in the last architecture review?
    - **Expected Answer:** The choice of message broker (Kafka vs RabbitMQ) was left undecided.
    - **Required Evidence:** Explicit statement of a deferred decision.
    - **Category:** Unresolved issues

35. **Question:** Are there any outstanding concerns from the client?
    - **Expected Answer:** Yes, the client is still concerned about the data migration strategy.
    - **Required Evidence:** Client feedback highlighting unresolved concerns.
    - **Category:** Unresolved issues

### H. Relationships

36. **Question:** Who works closely with Sarah on the backend?
    - **Expected Answer:** Mike and David work closely with Sarah.
    - **Required Evidence:** Identification of team members collaborating with Sarah.
    - **Category:** Relationships

37. **Question:** Which team is dependent on the API delivery?
    - **Expected Answer:** The frontend team is dependent on the API.
    - **Required Evidence:** Dependency mapping between teams.
    - **Category:** Relationships

38. **Question:** How does the new feature impact the billing system?
    - **Expected Answer:** It requires a new pricing tier to be added to the billing system.
    - **Required Evidence:** Explanation of the relationship between the feature and billing.
    - **Category:** Relationships

39. **Question:** Who is the main point of contact for the external vendor?
    - **Expected Answer:** Jane is the main point of contact.
    - **Required Evidence:** Identification of Jane's role regarding the vendor.
    - **Category:** Relationships

40. **Question:** What is the relationship between the mobile app and the web dashboard?
    - **Expected Answer:** They share the same backend API but have independent release cycles.
    - **Required Evidence:** Architectural description of the two systems.
    - **Category:** Relationships

### I. Cross-meeting reasoning

41. **Question:** Summarize the evolution of the caching strategy across all Q3 meetings.
    - **Expected Answer:** We started with no caching, then added local in-memory caching, and finally decided on a distributed Redis cache.
    - **Required Evidence:** Synthesis of caching discussions from multiple meetings.
    - **Category:** Cross-meeting reasoning

42. **Question:** Trace the decisions that led to the delay of the mobile app launch.
    - **Expected Answer:** The initial decision to use React Native was changed to native development, followed by a decision to add offline support, both contributing to the delay.
    - **Required Evidence:** Linking sequential decisions to the final outcome.
    - **Category:** Cross-meeting reasoning

43. **Question:** How many times was the marketing budget discussed before it was approved?
    - **Expected Answer:** It was discussed in three separate meetings before approval.
    - **Required Evidence:** Tracking a specific topic across multiple meetings.
    - **Category:** Cross-meeting reasoning

44. **Question:** Compare the initial project scope with the final delivered scope.
    - **Expected Answer:** The final scope included the core features but dropped the integration with legacy systems, which was in the initial scope.
    - **Required Evidence:** Comparison of scope definitions from early and late meetings.
    - **Category:** Cross-meeting reasoning

45. **Question:** Which team member has consistently raised concerns about performance?
    - **Expected Answer:** David has raised performance concerns in almost every architecture meeting.
    - **Required Evidence:** Identifying a pattern of behavior or contribution from a specific individual across meetings.
    - **Category:** Cross-meeting reasoning

### J. Negative / unknown questions

46. **Question:** What is the secret password for the production database?
    - **Expected Answer:** I do not have access to that information.
    - **Required Evidence:** Rejection of the question due to lack of information or security policy.
    - **Category:** Negative / unknown questions

47. **Question:** When will the company go public?
    - **Expected Answer:** There is no mention of the company going public in the meeting records.
    - **Required Evidence:** Correctly identifying that the information is absent.
    - **Category:** Negative / unknown questions

48. **Question:** What did the CEO say about the competitor's new product?
    - **Expected Answer:** The competitor's new product was not discussed.
    - **Required Evidence:** Confirming the absence of a specific topic.
    - **Category:** Negative / unknown questions

49. **Question:** Who is the new head of HR?
    - **Expected Answer:** I do not have information about a new head of HR.
    - **Required Evidence:** Correctly identifying that the information is absent.
    - **Category:** Negative / unknown questions

50. **Question:** What is the exact code implementation for the login function?
    - **Expected Answer:** I can provide the architectural decisions and requirements, but I do not have access to the exact code implementation.
    - **Required Evidence:** Differentiating between meeting discussions and code artifacts.
    - **Category:** Negative / unknown questions

51. **Question:** Can you delete the meeting record from last Tuesday?
    - **Expected Answer:** I cannot perform administrative actions like deleting records.
    - **Required Evidence:** Rejection of an action request outside the system's capabilities.
    - **Category:** Negative / unknown questions
