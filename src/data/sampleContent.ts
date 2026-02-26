/**
 * Sample documents for the public Extraction Engine demo.
 * Three distinct documents covering different domains and use cases.
 */

export interface SampleDocument {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  icon: "building" | "rocket" | "user";
  wordCount: number;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "enterprise-onboarding",
    title: "Enterprise Client Onboarding",
    subtitle: "Four-phase methodology for onboarding enterprise clients with €500K+ ARR contracts",
    domain: "Customer Success",
    icon: "building",
    wordCount: 1100,
    content: `# Enterprise Client Onboarding Methodology

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

**Research:** Analysis of 127 enterprise onboardings (2023-2024) shows that clients who complete all four phases within the target timeline have 2.3x higher expansion revenue at 18 months compared to those with extended onboardings. The strongest single predictor of on-time completion is executive sponsor engagement frequency.`,
  },
  {
    id: "product-launch",
    title: "Product Launch Playbook",
    subtitle: "Cross-functional GTM coordination from beta to general availability",
    domain: "Product & GTM",
    icon: "rocket",
    wordCount: 950,
    content: `# Product Launch Playbook — Beta to General Availability

## Overview
This playbook governs how we take a product from internal beta through public launch and post-launch stabilisation. It coordinates Product, Engineering, Marketing, Sales, and Customer Success to ensure consistent, high-quality launches.

---

## Phase 1: Launch Readiness Assessment

### 1.1 — Feature Completeness Review Playbook
Before declaring launch readiness, the product must pass a structured review.

1. Product Manager conducts a Feature Completeness Audit against the original PRD, flagging any deferred items.
2. Engineering Lead certifies that all P0 bugs are resolved and P1 bugs have documented workarounds.
3. QA Lead signs off on the Regression Test Suite — minimum 95% pass rate required.
4. Performance benchmarks must meet or exceed SLA targets: p95 latency <200ms, uptime >99.9% over trailing 14 days.
5. Security review completed by InfoSec team. No critical or high-severity findings may remain open.

**Directive:** No product may launch to GA without a completed Security Review sign-off. Any waiver requires written approval from the CTO and CISO.

**Directive:** Beta feedback with more than 3 unique reports of the same issue must be resolved before GA, regardless of severity classification.

**Knowledge:** Historical data shows that products launching with >5 open P1 bugs have 2.1x higher support ticket volume in the first 30 days. The target is ≤2 open P1s at launch.

### 1.2 — Documentation & Enablement Readiness
1. Technical Writer publishes updated API documentation, release notes, and migration guides at least 10 days before launch.
2. Product Marketing prepares positioning brief, competitive battle cards, and FAQ document.
3. Sales Enablement delivers training sessions to all customer-facing teams at least 7 days before launch.
4. Support team reviews known issues list and prepares canned responses for anticipated questions.

**Principle:** We launch when customers can succeed, not when the code is ready. Documentation and enablement are as critical as the software itself.

---

## Phase 2: GTM Coordination

### 2.1 — Marketing Launch Sequence Playbook
Execute the coordinated marketing push across all channels.

1. T-14 days: Seed teaser content on social channels and begin email drip to waitlist.
2. T-7 days: Publish "Coming Soon" landing page with early-access signup form.
3. T-3 days: Brief analyst and press contacts under embargo.
4. T-0 (Launch Day): Publish blog post, send launch email to full database, activate paid campaigns, and post across all social channels.
5. T+1-7: Monitor social mentions, respond to coverage, amplify customer testimonials.

**Directive:** All external communications must be reviewed by Legal at least 5 business days before publication. No claims about performance, security, or compliance may be made without supporting documentation.

**Knowledge:** Our best-performing launches historically achieve 3x normal weekly signups in the launch week. The minimum viable launch metric is 1.5x weekly signups.

### 2.2 — Sales Activation
1. Update CRM with new product SKUs and pricing at least 5 days before launch.
2. Sales team receives deal-specific launch talking points from Product Marketing.
3. Top 20 pipeline opportunities receive personalised outreach referencing the new capability.
4. Partner channel receives co-branded materials and launch kit.

---

## Phase 3: Post-Launch Stabilisation

### 3.1 — War Room Protocol
For the first 72 hours post-launch, maintain a dedicated war room.

1. Engineering on-call rotation with 15-minute response SLA for critical issues.
2. Product Manager monitors usage analytics dashboard every 2 hours, flagging anomalies.
3. Support Lead provides hourly ticket volume and sentiment reports to the war room channel.
4. Any incident exceeding 30 minutes triggers the Incident Response Playbook with customer comms within 1 hour.

**Directive:** During the 72-hour war room period, no non-emergency deployments may be made to the production environment without war room lead approval.

### 3.2 — Launch Retrospective
1. Conduct a cross-functional retrospective within 10 business days of launch.
2. Review launch metrics against targets: adoption rate, support ticket volume, revenue impact, NPS delta.
3. Document process improvements for the next launch cycle.
4. Present launch scorecard to the executive team within 15 business days.

**Research:** Analysis of our last 12 product launches shows that launches with completed pre-launch checklists had 40% fewer support escalations and reached adoption targets 2 weeks faster than those with incomplete preparation.

**Principle:** Speed matters, but controlled speed. We optimise for time-to-value, not time-to-ship. A well-prepared launch always outperforms a rushed one.`,
  },
  {
    id: "investment-committee",
    title: "My Working Preferences",
    subtitle: "Personal operating model for an investment committee member managing due diligence",
    domain: "Personal / Finance",
    icon: "user",
    wordCount: 850,
    content: `# Working Preferences — Investment Committee Member

## About Me
I serve on the investment committee for a mid-market PE fund (€200M AUM). I lead due diligence on 8-12 deals per year and sit on 3 portfolio company boards. My role requires balancing deep analytical work with high-stakes decision-making under time pressure.

---

## Communication & Decision Style

### How I Work Best
**Preference:** I prefer written briefs over verbal updates. Send me a 1-page summary with the key decision points highlighted before any meeting. I'll come prepared with questions rather than processing information live.

**Preference:** For deal-related communications, always lead with the recommendation and supporting thesis, then the risks. I read bottom-up: conclusion first, evidence second.

**Preference:** My peak focus hours are 6:00-10:00 AM. Schedule deep-work sessions (financial modelling, memo writing) during this window. Meetings after 10 AM.

**Principle:** I believe that the quality of a deal decision is 80% determined by the quality of the questions asked during diligence, not the volume of data collected. Focus on the 5-7 questions that would kill the deal if answered unfavourably.

**Principle:** Every investment memo should be written as if the deal will fail. Document the bear case with the same rigour as the bull case. Asymmetric downside analysis is non-negotiable.

---

## Due Diligence Process

### My Due Diligence Playbook
This is how I structure every deal evaluation from initial screening to IC presentation.

1. Conduct a 30-minute initial screening call with the deal team to assess strategic fit against our fund thesis.
2. If proceeding, request the Confidential Information Memorandum (CIM) and last 3 years of audited financials.
3. Build a preliminary financial model within 5 business days of receiving the CIM. Focus on revenue quality, margin sustainability, and cash conversion.
4. Identify the top 5 "deal-killer" questions and assign each to a diligence workstream owner.
5. Conduct management meetings — minimum 2 sessions: one with the CEO/CFO, one with middle management without senior executives present.
6. Commission third-party reports: market sizing (always), quality of earnings (deals >€30M), IT due diligence (tech-enabled businesses).
7. Prepare the Investment Committee Memo: maximum 15 pages plus appendices. Must include the bear case scenario with probability-weighted returns.
8. Present to the IC with a clear recommendation: Proceed, Proceed with Conditions, or Pass.

**Directive:** Never rely solely on management's financial projections. Always build an independent base case from first principles. Management projections are inputs, not answers.

**Directive:** All IC memos must include a "What Would Make Us Wrong" section with at least 3 falsifiable hypotheses about the investment thesis.

**Knowledge:** Our fund's historical performance shows that deals where we identified and stress-tested the top 3 risks during diligence had 35% higher IRR than deals where risk identification was incomplete. The strongest predictor of deal success is the rigour of the bear case analysis.

---

## Portfolio Board Meetings

### Board Preparation Procedure
1. Request the board pack 5 business days before the meeting. Reject any pack received less than 3 days in advance.
2. Review financials against the 100-day plan commitments and flag any variances >10% from plan.
3. Prepare 3-5 strategic questions focused on value creation initiatives, not operational minutiae.
4. Send my questions to the CEO 24 hours before the meeting so they can prepare thoughtful responses.

**Preference:** During board meetings, I focus on forward-looking strategic topics. Operational reviews should be handled in separate management meetings. Board time is too valuable for status updates.

**Preference:** I take handwritten notes during board meetings and dictate a summary memo within 2 hours of the meeting ending. This captures nuance and body language that typed notes miss.

**Knowledge:** Best-practice board meeting cadence for our portfolio stage (growth/mid-market): monthly for the first 12 months post-investment, then quarterly once the management team has proven execution capability. Ad-hoc strategy sessions as needed.

**Principle:** As a board member, my job is to ask the questions that management hasn't asked themselves. If I'm only confirming what they already know, I'm not adding value. Constructive challenge is the highest form of support.`,
  },
];

/** Legacy export for backward compatibility */
export const SAMPLE_CONTENT = SAMPLE_DOCUMENTS[0].content;
