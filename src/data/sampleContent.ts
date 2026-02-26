/**
 * Sample document for the public Extraction Engine demo.
 * Designed to showcase extraction quality across all AACE categories.
 */
export const SAMPLE_CONTENT = `# Enterprise Client Onboarding Methodology

## Overview
This methodology defines our four-phase approach to onboarding enterprise clients with contract values exceeding €500K ARR. It ensures consistent, high-quality engagements that establish trust, set expectations, and position the relationship for long-term success.

---

## Phase A: Discovery & Stakeholder Mapping

### A.1 — Stakeholder Identification Playbook
The discovery phase begins with identifying all decision-makers, influencers, and end-users within the client organisation. The goal is to build a comprehensive stakeholder map that informs all downstream communication.

**Key activities:**
1. Request the client's organisational chart within 48 hours of contract signature.
2. Schedule a 30-minute introductory call with the executive sponsor to understand strategic priorities.
3. Identify the Day-to-Day Contact (DDC) who will serve as the operational liaison throughout onboarding.
4. Map all stakeholders to a RACI matrix covering: Project Governance, Technical Integration, Change Management, and Executive Reporting.
5. Document each stakeholder's communication preference (email, Slack, Teams, phone) and timezone.

**Directive:** The executive sponsor must be engaged at minimum once every two weeks during the onboarding period. Failure to maintain executive engagement correlates with a 3x increase in churn risk within the first year.

**Directive:** Never share internal pricing models, margin data, or competitive intelligence with client stakeholders, regardless of seniority.

### A.2 — Needs Assessment & Gap Analysis
Before scoping the onboarding plan, conduct a structured needs assessment to understand the client's current state.

1. Distribute the Standard Needs Assessment Questionnaire (NAQ) to the DDC within 3 business days of contract execution.
2. Review the NAQ responses and prepare a Gap Analysis Brief highlighting mismatches between client expectations and platform capabilities.
3. Conduct a 60-minute deep-dive workshop with the client's technical team to validate integration requirements.
4. Document all API dependencies, data migration needs, and SSO configuration requirements.

**Knowledge:** Our average enterprise onboarding takes 47 business days from contract signature to go-live. Top-quartile performance is 32 days. Onboardings exceeding 65 days have a 40% higher churn rate at 12 months.

---

## Phase B: Scoping & Planning

### B.1 — Onboarding Plan Construction
Based on discovery outputs, construct a detailed onboarding plan that both parties agree to.

1. Create the Onboarding Project Plan in our project management tool within 5 business days of completing discovery.
2. Define 3-5 milestone checkpoints with clear success criteria and owner assignments.
3. Identify all training cohorts and map them to our Standard Training Catalogue modules.
4. Set the target Go-Live date with a minimum 5-day buffer for contingency.
5. Send the Onboarding Plan for client sign-off. Obtain written confirmation within 10 business days.

**Directive:** All onboarding plans must include a dedicated "Risk Register" section listing at least 3 identified risks with mitigation strategies. Plans without risk registers must not be sent to clients.

**Knowledge:** Training Catalogue modules available: Platform Fundamentals (4h), Advanced Configuration (6h), Admin & Governance (3h), API & Integrations (8h), Reporting & Analytics (4h), Change Management Workshop (2h).

### B.2 — Resource Allocation & Team Assembly
1. Assign a dedicated Onboarding Lead (OL) who owns the engagement end-to-end.
2. Allocate a Solutions Engineer for all technical integration work — minimum 60% dedicated capacity.
3. If the contract includes custom development, engage the Product Engineering team at least 15 business days before the planned sprint start.
4. Ensure the assigned Customer Success Manager (CSM) shadows the OL from day one to ensure continuity post-handoff.

**Principle:** We believe that onboarding quality is the single strongest predictor of long-term client retention. Every hour invested in onboarding returns 10x in reduced support burden and increased expansion revenue.

---

## Phase C: Execution & Go-Live

### C.1 — Technical Implementation Playbook
Execute the technical onboarding according to the scoped plan.

1. Provision the client's production environment within 2 business days of plan sign-off.
2. Configure SSO/SAML integration and validate with the client's IT team — target: complete within 5 business days.
3. Execute data migration according to the agreed Data Migration Runbook — always run a dry migration first.
4. Conduct integration testing: API endpoints, webhook configurations, and data flow validation.
5. Perform User Acceptance Testing (UAT) with the client's designated testers. Document all findings in the UAT Register.
6. Obtain formal Go-Live sign-off from both the DDC and executive sponsor.

**Directive:** Production data migration must never proceed without a validated rollback plan. The rollback plan must be reviewed and approved by the Solutions Engineering Lead before migration begins.

**Directive:** Client credentials and API keys must be stored exclusively in the secure vault. Sharing credentials via email, Slack, or any unencrypted channel is strictly prohibited.

### C.2 — Training & Enablement
1. Deliver Platform Fundamentals training to all end-user cohorts at least 5 business days before go-live.
2. Deliver Admin & Governance training to the client's designated administrators.
3. Provide the client with access to our self-service knowledge base and video tutorial library.
4. Conduct a "Day in the Life" simulation session where users complete realistic workflows using the platform.

**Knowledge:** Post-training satisfaction target: >4.2/5.0 average across all cohorts. Clients with training scores below 3.8 require a follow-up reinforcement session within 10 business days.

---

## Phase D: Handoff & Continuous Success

### D.1 — Transition to Customer Success
1. Schedule a formal handoff meeting between the Onboarding Lead, CSM, and the client's DDC within 5 business days of go-live.
2. Prepare the Client Health Scorecard capturing: adoption metrics, training completion rates, outstanding issues, and risk indicators.
3. Transfer all documentation, meeting notes, and the risk register to the CSM's workspace.
4. Set the first Quarterly Business Review (QBR) date — must occur within 60 days of go-live.

**Directive:** The Onboarding Lead must remain available for escalations for 15 business days after handoff. During this period, the OL joins the CSM on any client call where unresolved onboarding issues are discussed.

### D.2 — Post-Onboarding Review
1. Conduct an internal retrospective within 10 business days of go-live, including all onboarding team members.
2. Document lessons learned in the Onboarding Retrospective Template.
3. Update the Standard Operating Procedures if any process improvements are identified.
4. Submit the final Onboarding Scorecard to the VP of Customer Success.

**Knowledge:** Our NPS benchmark for enterprise onboardings is +62. Onboardings scoring below +45 trigger an automatic executive review. Current quarterly average: +58.

**Principle:** Every onboarding is a learning opportunity. We treat retrospectives not as bureaucratic exercises but as the primary mechanism for compounding institutional knowledge. What we learn from one client directly improves the experience for the next.

**Research:** Analysis of 127 enterprise onboardings (2023-2024) shows that clients who complete all four phases within the target timeline have 2.3x higher expansion revenue at 18 months compared to those with extended onboardings. The strongest single predictor of on-time completion is executive sponsor engagement frequency.
`;
