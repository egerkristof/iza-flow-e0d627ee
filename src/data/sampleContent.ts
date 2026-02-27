/**
 * Sample documents for the public Extraction Engine demo.
 * 15 documents across 5 enterprise domains.
 * Written as realistic business documents — the way teams actually produce them.
 */

export type DomainIcon = "trending-up" | "settings" | "landmark" | "users" | "heart-handshake";

export interface SampleDocument {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  icon: DomainIcon;
  wordCount: number;
  content: string;
}

export const DOMAIN_LIST = [
  "Sales",
  "Operations",
  "Finance",
  "People & HR",
  "Customer Success",
] as const;

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  // ═══════════════════════════════════════════════════════════════
  // SALES (3 documents)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "sales-deal-qualification",
    title: "Enterprise Deal Qualification Process",
    subtitle: "Structured methodology for qualifying enterprise opportunities above €100K ACV",
    domain: "Sales",
    icon: "trending-up",
    wordCount: 850,
    content: `# Enterprise Deal Qualification Process

## Overview
This document defines our structured approach to qualifying enterprise sales opportunities with contract values exceeding €100K ACV. It ensures sales resources are allocated to deals with the highest probability of closing and long-term value.

---

## Stage 1: Initial Qualification

### Inbound Lead Assessment
Every inbound enterprise lead must pass through a structured assessment before entering the pipeline.

1. Within 4 business hours of lead receipt, the SDR conducts a 15-minute discovery call to validate company size, budget authority, and timeline.
2. Score the lead against our Ideal Customer Profile (ICP) using the weighted criteria: Industry Fit (25%), Company Size (20%), Technology Stack (20%), Budget Range (20%), Timeline (15%).
3. Leads scoring above 70/100 proceed to Account Executive assignment. Leads scoring 50-70 enter a nurture sequence. Below 50, archive with reason code.
4. Document all qualification findings in the CRM within 2 hours of the discovery call.

No enterprise lead may sit uncontacted for more than 6 business hours. Response time is the single strongest predictor of conversion at the top of funnel. SDRs must never discuss pricing or custom terms during initial qualification — all pricing conversations are redirected to the assigned Account Executive.

Our historical conversion data shows that leads contacted within 2 hours convert at 3.2x the rate of leads contacted after 24 hours. ICP-fit leads that pass qualification convert to closed-won at 34% compared to 8% for non-ICP leads.

---

## Stage 2: Discovery & Solution Fit

### Structured Discovery
Once qualified, the Account Executive conducts deep discovery to map the opportunity.

1. Schedule a 45-minute discovery session with the economic buyer and at least one end-user stakeholder.
2. Use the MEDDPICC framework to structure discovery: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Implications, Champion, Competition.
3. Document the client's current state, desired future state, and the quantifiable gap between them.
4. Identify at minimum 3 compelling events driving urgency (contract renewals, regulatory deadlines, strategic initiatives).
5. Map the decision-making unit: who signs, who influences, who can block, who champions internally.

We sell outcomes, not features. Every proposal must articulate the measurable business impact in the client's language, not ours. If we can't quantify the value, we haven't completed discovery.

Deals with an identified champion close at 2.4x the rate of deals without one. Deals with a documented compelling event close 40% faster on average.

---

## Stage 3: Proposal & Negotiation

### Proposal Review
All enterprise proposals must pass through a structured review before delivery to the client.

1. Draft the proposal using the Standard Enterprise Proposal Template, customising sections 2 (Value Proposition) and 4 (Pricing) to reflect discovery findings.
2. Submit for peer review by a second AE or Sales Manager at least 3 business days before the client presentation.
3. For deals exceeding €250K ACV, obtain VP Sales approval on pricing and terms before sending.
4. Include a mutual action plan with the proposal, listing all steps from both parties required to reach contract signature.

Discounts exceeding 15% from list price require written VP Sales approval. Discounts exceeding 25% require CRO approval. No exceptions. All proposals must include a "Why Now" section that references the client's specific compelling events and the cost of inaction.

A proposal is a decision document, not a product brochure. Every page should move the client closer to a yes or surface an objection we can address. Remove anything that doesn't serve one of these two purposes.`,
  },
  {
    id: "sales-pipeline-review",
    title: "Quarterly Pipeline Review",
    subtitle: "How sales leadership reviews, stress-tests, and forecasts the enterprise pipeline",
    domain: "Sales",
    icon: "trending-up",
    wordCount: 750,
    content: `# Quarterly Pipeline Review

## Overview
This document governs how sales leadership conducts quarterly pipeline reviews to produce accurate forecasts, identify at-risk deals, and allocate resources for maximum revenue impact.

---

## Preparation Phase

### Pre-Review Data Assembly
1. Sales Ops prepares the Pipeline Health Dashboard 5 business days before the review, including: total pipeline value by stage, average deal velocity by segment, conversion rates stage-to-stage, and pipeline coverage ratio.
2. Each Account Executive updates all opportunities in CRM with current close dates, deal values, next steps, and risk flags at least 3 business days before review.
3. Deals with no activity logged in the past 14 days are automatically flagged as "stale" and require an explanation during review.

Pipeline coverage must maintain a minimum 3x ratio to quota. If coverage drops below 3x for any rep or territory, an immediate pipeline generation sprint is triggered.

Historical analysis shows our stage-weighted pipeline accuracy is 72%. Deals in "Verbal Commit" stage close at 85%, "Proposal Sent" at 45%, "Discovery" at 22%, and "Qualification" at 12%.

---

## Review Execution

### Deal-by-Deal Review
1. Start with the top 10 deals by value across the team. For each deal, the owning AE presents: current stage, key stakeholders engaged, identified risks, competitive dynamics, and specific next step with date.
2. Apply the "3 Whys" stress test: Why will they buy? Why will they buy from us? Why will they buy now?
3. Deals that cannot answer all three questions are downgraded one stage or moved to "Nurture" if fundamentally unqualified.
4. Identify the top 3 deals most likely to slip and assign specific executive actions to accelerate them.
5. Review all deals past their projected close date. Deals overdue by more than 30 days without a documented re-engagement plan are moved to "Closed Lost — Stalled."

Forecast categories must be used consistently: Commit (>90% confidence), Best Case (60-90%), Pipeline (30-60%), Upside (<30%). Any deal in "Commit" without a signed mutual action plan must be downgraded.

An accurate forecast is more valuable than an optimistic one. We reward precision, not padding. A rep who consistently forecasts accurately earns more trust and autonomy than one who always overestimates.

---

## Post-Review Actions

### Follow-Through
1. Sales Ops distributes the review summary within 24 hours, including: revised forecast by category, action items with owners and deadlines, and pipeline gaps by territory.
2. Each AE receives a personalised deal action plan for their top 5 opportunities with specific coaching recommendations.
3. Deals requiring executive engagement are escalated to VP Sales or CRO with a brief and requested action.
4. Schedule mid-quarter check-in to validate progress on action items.

Teams that conduct structured pipeline reviews with documented follow-through outperform teams with informal reviews by 23% on quota attainment. The single highest-impact action is consistent stage-gate enforcement.`,
  },
  {
    id: "sales-account-planning",
    title: "Strategic Account Planning Framework",
    subtitle: "Annual planning methodology for managing and expanding top-tier accounts",
    domain: "Sales",
    icon: "trending-up",
    wordCount: 800,
    content: `# Strategic Account Planning Framework

## Overview
This framework governs how we plan, manage, and expand our top-tier strategic accounts — the top 20% of accounts by revenue that represent approximately 65% of total ARR. It ensures systematic growth rather than reactive renewal management.

---

## Annual Planning Cycle

### Account Assessment
At the start of each fiscal year, complete a comprehensive assessment of every strategic account.

1. Review the past 12 months: revenue trajectory, product adoption metrics, support ticket trends, NPS scores, and executive engagement frequency.
2. Map the account's organisational structure, identifying all budget holders, decision-makers, and internal champions across business units.
3. Assess competitive landscape: what alternatives is the client aware of, any incumbent vendors in adjacent areas, and contract renewal timelines for competitive products.
4. Calculate the account's Total Addressable Value (TAV) — the maximum revenue potential if we captured every relevant use case within the organisation.
5. Set the annual expansion target: identify specific whitespace opportunities by business unit or use case.

Every strategic account must have a documented account plan updated quarterly. Accounts without a current plan cannot receive executive engagement or premium support resources.

Accounts with active expansion plans grow at 28% annually compared to 4% for accounts managed reactively. The average strategic account has 3.2 unexplored business units that represent expansion opportunities.

---

## Relationship Management

### Executive Alignment
1. Map our executive team to the client's leadership: identify peer-level relationships and gaps.
2. Schedule at minimum 2 executive touchpoints per year — one strategic review, one informal relationship-building event.
3. Prepare an Executive Brief before every touchpoint: 1 page covering account health, strategic priorities, and the single most important topic to address.
4. After each executive meeting, document commitments and next steps. Distribute to the account team within 24 hours.

Relationships compound. An executive relationship built over 3 years of consistent engagement is virtually un-displaceable by competitors. We invest in relationships before we need them, not when renewal is at risk.

Never surprise a client executive. If there's a service issue, pricing change, or strategic shift, the client's executive sponsor hears it from our executive first — before it reaches their operational team.

---

## Expansion Strategy

### Whitespace Mapping & Cross-Sell
1. Build a whitespace matrix: rows are business units/departments, columns are product capabilities. Mark cells as "Adopted," "Aware," "Opportunity," or "Not Relevant."
2. For each "Opportunity" cell, identify the relevant stakeholder, their most likely pain point, and the ideal entry path (reference from adopted team, executive introduction, or event invitation).
3. Prioritise opportunities by: revenue potential (40%), ease of entry (30%), and strategic importance for product roadmap (30%).
4. Create a quarterly expansion plan with specific targets: 2 new business unit introductions and 1 active proof-of-concept per quarter.

Cross-sell deals within existing strategic accounts close at 62% compared to 28% for new logo deals. The average time to close an expansion deal is 45 days versus 120 days for new business. Internal referrals from adopted teams convert at 4x the rate of cold outreach within the same organisation.

Land and expand is not a metaphor — it's the entire growth engine. Every successful deployment should immediately trigger the question: who else in this organisation would benefit from what we just delivered?`,
  },

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS (3 documents)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ops-vendor-onboarding",
    title: "Vendor Onboarding & Procurement SOP",
    subtitle: "Standard process for evaluating, approving, and onboarding new vendors",
    domain: "Operations",
    icon: "settings",
    wordCount: 800,
    content: `# Vendor Onboarding & Procurement SOP

## Overview
This procedure defines how we evaluate, approve, and onboard new vendors across the organisation. It ensures consistent due diligence, risk management, and contractual standards while keeping procurement timelines reasonable.

---

## Stage 1: Vendor Evaluation

### Request & Initial Screening
1. The requesting team submits a Vendor Request Form specifying: business need, estimated annual spend, alternative vendors considered, and urgency level.
2. Procurement reviews the request within 3 business days and checks the Approved Vendor Registry for existing alternatives.
3. If no approved alternative exists, Procurement conducts an initial screening: company financials, market reputation, client references, and compliance certifications.
4. Vendors with annual spend below €25K follow the Simplified Track (manager approval only). Above €25K requires the full evaluation process.

All vendor engagements exceeding €50K annual spend must go through competitive evaluation with a minimum of 3 vendors unless a sole-source justification is approved by the CFO. No department may engage a vendor or sign any agreement — including free trials with data access — without Procurement's written acknowledgment. Shadow procurement creates unmanaged risk.

Our average vendor onboarding takes 22 business days for standard track and 45 days for complex/high-value vendors. The most common delay is incomplete vendor documentation — providing a clear checklist upfront reduces cycle time by 35%.

---

## Stage 2: Due Diligence & Approval

### Risk Assessment
1. For vendors above €50K or handling sensitive data, conduct a structured risk assessment covering: financial stability, information security posture, business continuity plans, and regulatory compliance.
2. Request and review the vendor's SOC 2 Type II report (or equivalent). Vendors handling personal data must demonstrate GDPR compliance documentation.
3. IT Security conducts a technical assessment for any vendor that will integrate with our systems or access our data.
4. Legal reviews the vendor's standard terms and prepares a Contract Review Brief highlighting deviations from our standard requirements.
5. Compile all findings into a Vendor Assessment Scorecard with a recommendation: Approve, Conditional Approve, or Reject.

Vendors scoring below 60/100 on the security assessment may not be onboarded regardless of business need. No exceptions without CISO written approval and a documented remediation timeline.

Vendor risk is our risk. When a vendor fails, our customers don't blame the vendor — they blame us. Every vendor in our ecosystem extends our attack surface and our reputation.

---

## Stage 3: Contracting & Onboarding

### Contract Execution
1. Use our Standard Vendor Agreement as the starting template. Customisations require Legal approval.
2. Negotiate key terms: payment terms (target Net 45), liability caps, SLAs, data processing agreements, and termination clauses.
3. Ensure the contract includes a right-to-audit clause for vendors handling sensitive data.
4. Obtain final approval signatures: Department Head + Procurement Director for spend <€100K, add CFO for spend ≥€100K.
5. Register the executed contract in the Contract Management System with renewal and review dates.

### Vendor Integration
1. Assign a Vendor Relationship Manager from the requesting team who owns day-to-day operations.
2. Conduct a kickoff meeting with the vendor covering: SLA expectations, escalation procedures, reporting cadence, and primary contacts.
3. Configure system integrations, access controls, and monitoring according to the IT Integration Checklist.
4. Schedule the first Vendor Performance Review for 90 days post-launch.

Vendors with structured onboarding and a designated relationship manager have 45% fewer service incidents in the first year compared to vendors managed ad-hoc. Quarterly performance reviews reduce contract disputes by 60%.`,
  },
  {
    id: "ops-incident-response",
    title: "Incident Response & Escalation Protocol",
    subtitle: "How to detect, classify, communicate, and resolve operational incidents",
    domain: "Operations",
    icon: "settings",
    wordCount: 800,
    content: `# Incident Response & Escalation Protocol

## Overview
This protocol defines how we detect, classify, respond to, and learn from operational incidents affecting our products, services, or internal systems. It applies to all teams and operates 24/7.

---

## Incident Classification

### Severity Framework
All incidents are classified on detection using the following framework:

SEV-1 (Critical): Complete service outage or data breach affecting customers. Revenue impact or regulatory exposure. Target resolution: 1 hour. Requires immediate executive notification.

SEV-2 (Major): Significant degradation affecting >20% of users or a critical business function. Target resolution: 4 hours. Requires VP-level notification.

SEV-3 (Moderate): Partial degradation with workaround available. Affects <20% of users. Target resolution: 1 business day.

SEV-4 (Minor): Cosmetic issue or minor inconvenience. No business impact. Target resolution: next sprint.

When in doubt, classify up, not down. It is always better to over-respond and downgrade than to under-respond and escalate late. Re-classification can happen at any point during the response.

---

## Response Procedure

### Incident Response Steps
1. The person who detects the incident opens an Incident Ticket immediately, providing: what's happening, what's affected, when it started, and initial severity assessment.
2. For SEV-1 and SEV-2: a dedicated Incident Channel is created automatically. The on-call Incident Commander joins within 10 minutes.
3. Incident Commander assigns roles: Technical Lead (drives resolution), Communications Lead (manages stakeholder updates), and Scribe (documents timeline and decisions).
4. Technical Lead conducts initial triage: confirm scope, identify root cause hypothesis, and determine whether the incident can be mitigated immediately or requires a deeper fix.
5. Communications Lead sends the first stakeholder update within 30 minutes of incident declaration, then every 60 minutes for SEV-1 or every 2 hours for SEV-2.

Customer-facing communications during a SEV-1 incident must be reviewed by the Communications Lead before sending. Never speculate on root cause in external communications. State what happened, what's affected, and what we're doing — not why it happened, until confirmed.

Our historical data shows that 68% of SEV-1 incidents are resolved within the 1-hour target. The most common root cause categories are: deployment-related (35%), infrastructure (28%), third-party dependency (22%), and data-related (15%).

---

## Resolution & Recovery

### Post-Incident Process
1. Once the incident is resolved, the Technical Lead documents the confirmed root cause, the fix applied, and any temporary measures still in place.
2. Incident Commander sends the "All Clear" communication to all stakeholders.
3. Within 48 hours, conduct a blameless Post-Incident Review (PIR) with all involved parties. Focus on: what happened, why detection took as long as it did, what we'll change to prevent recurrence.
4. Document the PIR findings and generate action items with owners and deadlines. Track in the Incident Action Register.
5. For SEV-1 incidents, present the PIR summary to the executive team within 5 business days.

We practice blameless post-mortems. Individuals don't cause incidents — systems do. If a single person's mistake can cause a customer-facing outage, that's a system design problem, not a people problem. Our job is to build systems that are resilient to human error.

All SEV-1 and SEV-2 action items from PIRs must be completed within 30 days. Overdue items are automatically escalated to the VP of Engineering. PIR action items take priority over feature work.

Teams that complete all PIR action items within 30 days see a 52% reduction in repeat incidents. The average number of action items per SEV-1 PIR is 4.7. The most impactful category of improvements is monitoring and alerting enhancements.`,
  },
  {
    id: "ops-quality-audit",
    title: "Quality Assurance Audit Process",
    subtitle: "Periodic quality audits across delivery teams to maintain service standards",
    domain: "Operations",
    icon: "settings",
    wordCount: 750,
    content: `# Quality Assurance Audit Process

## Overview
This process defines how we conduct periodic quality audits across all delivery teams to ensure consistent service standards, identify improvement opportunities, and maintain compliance with internal and external quality requirements.

---

## Audit Planning

### Annual Audit Calendar
1. At the start of each fiscal year, the Quality Team publishes the Annual Audit Calendar covering all delivery teams, functions, and processes in scope.
2. Each team is audited at minimum once per year. High-risk areas (client delivery, data handling, financial processes) are audited twice per year.
3. Audit scope and criteria are communicated to the audited team at least 15 business days before the audit begins.
4. Assign a Lead Auditor for each engagement who is independent of the team being audited.

No team may decline or postpone a scheduled audit without Quality Director approval. Postponements must be rescheduled within 30 days of the original date.

Our audit programme covers 14 delivery teams and 32 distinct process areas. Historical data shows that teams audited twice yearly improve their quality scores 40% faster than those audited once.

---

## Audit Execution

### Audit Fieldwork
1. Lead Auditor conducts a kickoff meeting with the team lead to confirm scope, timeline, and logistics.
2. Review documentation: SOPs, process maps, training records, and recent performance data.
3. Conduct staff interviews — minimum 3 team members at different levels to assess process understanding and adherence.
4. Observe live processes where applicable: client calls, delivery reviews, handoff procedures.
5. Sample work products: select 10-15 recent deliverables for detailed quality review against established criteria.
6. Score each audit criterion on a 1-5 scale. Document evidence for any score below 3.

All audit findings must be supported by evidence. Opinions and impressions are documented separately from factual findings. The audit report must distinguish between non-conformities (process violations), observations (improvement opportunities), and good practices (worth sharing across teams).

Audits exist to help teams improve, not to punish them. The tone is collaborative and constructive. A well-conducted audit should leave the team feeling supported and clear on their improvement path, not defensive.

---

## Reporting & Follow-Up

### Findings & Remediation
1. Lead Auditor prepares the Audit Report within 10 business days of fieldwork completion. Report includes: executive summary, detailed findings with evidence, risk ratings, and recommended corrective actions.
2. Present findings to the team lead and department head. Allow 5 business days for factual corrections or clarifications.
3. Team lead submits a Corrective Action Plan within 15 business days of report finalisation, with specific actions, owners, and target dates.
4. Quality Team tracks corrective action completion monthly. Overdue items are escalated to the VP of Operations.
5. Conduct a follow-up verification audit within 90 days to confirm corrective actions have been implemented and are effective.

The most common non-conformities across our organisation are: incomplete documentation (32%), inconsistent process adherence (28%), insufficient training records (18%), and missing quality checkpoints (12%). Teams that complete corrective actions within the target timeframe achieve an average 1.2-point improvement in their next audit score.

Critical non-conformities (rated 1 on the 5-point scale) trigger an immediate remediation plan due within 5 business days. The process area remains under enhanced monitoring until the follow-up audit confirms resolution.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // FINANCE (3 documents)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "finance-monthly-close",
    title: "Monthly Close & Reporting Procedure",
    subtitle: "End-to-end procedure for monthly financial close and management reporting",
    domain: "Finance",
    icon: "landmark",
    wordCount: 800,
    content: `# Monthly Close & Reporting Procedure

## Overview
This procedure defines the end-to-end monthly financial close process, from transaction cut-off through final management reporting. It ensures accuracy, timeliness, and compliance with our reporting obligations.

---

## Close Calendar

### Monthly Close Timeline
The financial close follows a fixed calendar each month:

1. Day 1 (Month+1): Transaction cut-off. All invoices, expenses, and journal entries for the closing month must be submitted by 6:00 PM CET.
2. Day 2-3: Accounts Payable and Accounts Receivable reconciliation. AP team validates all vendor invoices against purchase orders. AR team reconciles customer payments against outstanding invoices.
3. Day 3-4: Bank reconciliation and intercompany eliminations. Treasury confirms all bank account balances match the general ledger.
4. Day 4-5: Accruals, prepayments, and provision adjustments. Controller reviews all manual journal entries for accuracy and proper documentation.
5. Day 5-6: Revenue recognition review. Ensure all revenue is recognised according to IFRS 15 / ASC 606 standards with proper documentation of performance obligations.
6. Day 7: Trial balance review and final adjustments. Controller signs off on the trial balance.
7. Day 8-10: Management reporting package preparation and distribution.

The close must be completed by Day 7. Any delays must be reported to the CFO immediately with root cause and recovery plan. Consistently late closes (2+ months) trigger a process review.

All manual journal entries above €10,000 require dual authorisation. Journal entries above €50,000 require Controller approval. No journal entry may be posted without supporting documentation attached in the ERP.

Our target close timeline is 7 business days. Current average is 8.2 days. Best-in-class for our industry is 5 days. The most common close delays are: late invoice submissions (40%), intercompany reconciliation discrepancies (25%), and revenue recognition complexities (20%).

---

## Reconciliation Standards

### Account Reconciliation
1. All balance sheet accounts must be reconciled monthly. Reconciling items must be individually identified and have a clear resolution path.
2. Reconciling items older than 60 days require written explanation and Controller approval to carry forward.
3. Bank reconciliations must tie to the penny. Any unresolved variance triggers an investigation before close sign-off.
4. Intercompany balances must be confirmed by both entities. Discrepancies above €5,000 must be resolved before close.

The balance sheet tells the truth about our business. Every number on it must be defensible, documented, and reconciled. A clean balance sheet is the foundation of trustworthy reporting.

---

## Management Reporting

### Reporting Package
1. Prepare the Monthly Management Report using the standard template: P&L (actual vs. budget vs. prior year), balance sheet, cash flow statement, and KPI dashboard.
2. Include variance commentary for all P&L lines deviating >5% from budget or >10% from prior year.
3. Prepare the departmental cost reports with spend-by-category breakdowns for each department head.
4. Submit the draft reporting package to the CFO for review by Day 8. Incorporate feedback by Day 9.
5. Distribute the final management reporting package to the executive team by Day 10.

Our management reporting package includes 14 core KPIs tracked monthly. The metrics with the highest executive attention are: MRR growth, gross margin, cash runway, customer acquisition cost, and employee headcount vs. plan.

Financial reports must never be shared externally without CFO approval. Draft reports must be clearly watermarked as "DRAFT — CONFIDENTIAL" until final sign-off.`,
  },
  {
    id: "finance-budget-approval",
    title: "Budget Approval & Variance Analysis",
    subtitle: "How departments request budgets, get approvals, and manage variances",
    domain: "Finance",
    icon: "landmark",
    wordCount: 750,
    content: `# Budget Approval & Variance Analysis

## Overview
This procedure governs the annual budget cycle, in-year budget modification requests, and ongoing variance analysis. It ensures financial discipline while giving teams the flexibility to respond to changing business conditions.

---

## Annual Budget Cycle

### Budget Planning
1. T-90 days (before fiscal year): CFO issues Budget Guidelines Memo defining: overall revenue and expense growth targets, headcount envelope, capital expenditure limits, and strategic investment priorities.
2. T-60 days: Each department head submits a draft budget using the Standard Budget Template, including: personnel costs (by role and start date), operating expenses (by category), capital expenditure requests, and key assumptions.
3. T-45 days: FP&A reviews all departmental submissions and prepares a consolidated draft with gap analysis against company targets.
4. T-30 days: Budget Challenge Sessions — each department presents to the CFO and CEO. Sessions focus on alignment with strategic priorities, ROI justification for investments, and trade-off decisions.
5. T-15 days: Final budget approved by the executive team and ratified by the Board.

Budget submissions without clearly stated assumptions are returned for revision. Every line item above €25K must include a business justification linking to a strategic objective or operational necessity.

A budget is a promise. It reflects our priorities and our discipline. Teams that consistently operate within budget while delivering results earn greater autonomy in subsequent cycles. Teams that regularly overrun lose discretionary spending authority.

---

## In-Year Modifications

### Budget Change Requests
1. For unplanned expenses below €10K, department heads have discretionary authority within their overall budget envelope — no formal request needed, but must be documented.
2. For requests €10K-€50K: submit a Budget Change Request (BCR) to FP&A with: amount, business justification, funding source (reallocation from another line or incremental), and expected ROI.
3. For requests above €50K: BCR requires CFO approval. Requests above €100K require CEO approval. Both must include a board-level summary if the spend alters the approved annual plan.
4. Emergency requests (unforeseeable, time-critical) follow an expedited path: verbal CFO approval within 24 hours, formal BCR documentation within 5 business days after the fact.

Splitting a large expense into smaller requests to avoid approval thresholds is a violation of our financial controls policy. FP&A monitors for patterns of split spending and escalates to the CFO.

---

## Variance Analysis

### Monthly Variance Review
1. By Day 12 of each month, FP&A distributes departmental Variance Reports showing: actual vs. budget, actual vs. forecast, and actual vs. prior year for all major cost categories.
2. Department heads review and provide commentary for all variances exceeding ±5% or ±€10K (whichever is smaller).
3. Variances are classified as: Timing (will self-correct in future months), Permanent (structural change requiring budget adjustment), or One-Time (non-recurring event).
4. Persistent unfavourable variances (3+ consecutive months) trigger a deep-dive review with FP&A and a remediation plan.

Across our organisation, the average monthly budget accuracy is 94% at the company level and 87% at the departmental level. The categories with the highest variance are: professional services (±18%), marketing spend (±15%), and travel & entertainment (±22%). Personnel costs, which represent 70% of total spend, maintain the tightest accuracy at ±3%.

Variance analysis is not about assigning blame — it's about improving our ability to predict and plan. Accurate forecasting is a skill that improves with practice and honest reflection on where our assumptions were wrong.`,
  },
  {
    id: "finance-investment-committee",
    title: "Investment Committee Due Diligence",
    subtitle: "Structured due diligence methodology for evaluating investment opportunities",
    domain: "Finance",
    icon: "landmark",
    wordCount: 800,
    content: `# Investment Committee Due Diligence

## Overview
This methodology defines how the investment committee evaluates opportunities from initial screening through final decision. It applies to all investment types: M&A targets, strategic investments, venture-stage bets, and major capital allocation decisions.

---

## Screening & Prioritisation

### Initial Assessment
1. The sponsoring team submits an Investment Brief (maximum 3 pages) covering: opportunity description, strategic rationale, preliminary valuation range, key risks, and requested diligence budget.
2. Investment Committee conducts a 30-minute screening discussion within 10 business days of submission. Decision: Proceed to Full Diligence, Request Additional Information, or Decline.
3. For approved opportunities, assign a Diligence Lead who owns the process end-to-end and assembles the workstream team.
4. Set the diligence timeline: standard is 45 business days for M&A, 30 days for strategic investments, 15 days for venture-stage.

No investment above €500K may proceed without formal Investment Committee screening. Verbal agreements, letters of intent, or exclusivity arrangements require IC Chair approval before execution.

Our historical acceptance rate at screening is 35%. Of deals that proceed to full diligence, 60% receive final IC approval. The most common decline reasons are: strategic misalignment (40%), valuation concerns (30%), and integration complexity (20%).

---

## Full Due Diligence

### Diligence Execution
1. Structure the diligence into workstreams: Financial (always), Commercial/Market (always), Legal (always), Technical/IT (if applicable), People & Culture (if M&A), and Regulatory (if applicable).
2. Each workstream lead receives a standard checklist of required analyses and documents to request.
3. Conduct management interviews with the target company: at minimum CEO, CFO, and relevant functional leaders.
4. Prepare independent market analysis: TAM validation, competitive positioning, and growth scenario modelling.
5. Legal workstream reviews all material contracts, IP ownership, litigation history, and regulatory compliance status.
6. Financial workstream produces Quality of Earnings analysis, working capital assessment, and 3-year financial projections.

All diligence workstreams must produce written findings reports. Verbal briefings are not sufficient for IC decision-making. Every finding must be categorised as: Confirmed Positive, Neutral, Risk (Mitigatable), or Deal Issue (Potential Blocker).

Our diligence process is thorough but not adversarial. We are seeking to understand the business we're evaluating — its strengths and its vulnerabilities — with the same rigour we'd apply to our own operations. Surprises discovered after closing represent diligence failures, not bad luck.

---

## Decision & Execution

### Investment Committee Decision
1. Diligence Lead prepares the Investment Recommendation Paper (maximum 10 pages plus appendices) covering: executive summary, strategic rationale, financial analysis, risk assessment, integration plan (if M&A), and recommended terms.
2. All workstream leads co-sign the recommendation, confirming their findings are accurately represented.
3. IC convenes a 90-minute decision session. Each workstream lead presents key findings (5 minutes each), followed by Q&A and deliberation.
4. IC decision is by majority vote with IC Chair holding the deciding vote in case of tie. Decisions are documented with explicit rationale.
5. Post-approval, transition to the Deal Execution team with a formal handoff of all diligence materials and agreed terms.

IC members who have a personal financial interest in any investment must recuse themselves and disclose the conflict. There are no exceptions to this requirement.

Investments that receive IC approval but are not executed within 90 days require re-screening. Market conditions and company circumstances change, and our approval is based on conditions at the time of review.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // PEOPLE & HR (3 documents)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "hr-onboarding",
    title: "New Employee Onboarding Programme",
    subtitle: "90-day structured onboarding from pre-boarding through full integration",
    domain: "People & HR",
    icon: "users",
    wordCount: 850,
    content: `# New Employee Onboarding Programme

## Overview
This programme defines our structured 90-day onboarding process for all new hires. It covers pre-boarding preparation, first-week orientation, and the progressive ramp to full productivity. The goal is to get every new team member to confident, independent contribution within 90 days.

---

## Pre-boarding (Offer Accepted → Day 1)

### Administrative Setup
1. HR sends the Welcome Pack within 3 business days of signed offer: contract copies, benefits enrolment forms, company handbook, and Day 1 logistics.
2. IT provisions hardware, email, and core tool access at least 2 business days before start date.
3. Hiring Manager prepares the 30-60-90 Day Plan tailored to the role, identifying specific deliverables and learning milestones for each phase.
4. Assign a "Buddy" — a peer from the team (not the direct manager) who serves as the informal guide for the first 90 days.
5. Hiring Manager sends a personal welcome email introducing the team, sharing the first week's schedule, and setting expectations.

All pre-boarding tasks must be completed before the new hire's start date. A new employee arriving to missing equipment, no email access, or an unprepared team signals that we don't value their time. First impressions set the tone for the entire employment relationship.

---

## Week 1: Orientation (Days 1-5)

### First Week Structure
1. Day 1: Welcome session with HR (90 min) covering: company history, mission, values, organisational structure, and benefits overview. Followed by team introduction and workspace tour.
2. Day 1-2: Hiring Manager conducts a dedicated 1-hour role expectations session: what success looks like at 30, 60, and 90 days.
3. Day 2-3: IT orientation: core tools training, security protocols, password management, and communication norms (email, Slack, meetings).
4. Day 3-5: Buddy-led sessions: how work actually gets done, team rituals, unwritten norms, and key stakeholders to know.
5. End of Week 1: Hiring Manager check-in — 30 minutes to answer questions and adjust the Week 2 plan if needed.

### Weeks 2-4: Immersion
1. Begin working on a "starter project" — a real but low-risk deliverable that builds confidence and exposes the new hire to core workflows.
2. Shadow at least 3 cross-functional meetings to understand how the team interacts with other departments.
3. Complete all mandatory compliance training: data protection, code of conduct, anti-harassment, and information security.
4. Meet 1-on-1 with at least 5 key stakeholders identified in the 30-60-90 plan.
5. Day 30 checkpoint: Hiring Manager conducts a formal 30-day review. Assess: cultural integration, role clarity, initial deliverable quality, and any support needs.

The first 30 days form the employee's mental model of the company. Every interaction, every process, every moment of confusion or clarity shapes how they'll approach their work for years. We invest in onboarding because first impressions compound.

---

## Month 2-3: Acceleration (Days 31-90)

### Month 2: Building Contribution
1. New hire takes ownership of a core workstream or project with increasing autonomy.
2. Hiring Manager shifts from daily check-ins to weekly 1-on-1s with a structured agenda: wins, blockers, feedback, and development.
3. New hire attends their first team planning/sprint session as an active participant.
4. Complete role-specific training modules from the Learning & Development catalogue.
5. Day 60 checkpoint: Formal review assessing: independent contribution quality, stakeholder feedback, and alignment with role expectations.

### Month 3: Full Integration
1. New hire is fully integrated into team workflows and expected to operate at the standard performance level for their role and tenure.
2. Begin contributing to team improvement initiatives: process refinements, documentation updates, or mentoring newer team members.
3. Buddy relationship transitions from structured support to informal peer connection.
4. Day 90 checkpoint: Comprehensive review covering: performance against 30-60-90 plan, cultural fit, development goals for the next 6 months, and formal confirmation of successful onboarding.

If any concerns emerge during the 90-day period — performance, cultural fit, or role misalignment — they must be documented and addressed immediately with an Improvement Plan. Waiting until the 90-day review to raise concerns is too late.

Employees who complete the full structured 90-day programme have 35% higher retention at 12 months and reach full productivity 25% faster compared to unstructured onboarding. The single most impactful element is the assigned buddy — new hires with buddies report 2x higher confidence and satisfaction scores.`,
  },
  {
    id: "hr-performance-review",
    title: "Performance Review & Calibration Process",
    subtitle: "Bi-annual performance evaluation, calibration, and development planning",
    domain: "People & HR",
    icon: "users",
    wordCount: 800,
    content: `# Performance Review & Calibration Process

## Overview
This process defines how we conduct bi-annual performance reviews, calibrate ratings across teams, and create individual development plans. It applies to all full-time employees who have completed their probation period.

---

## Review Preparation

### Self-Assessment & Manager Review
1. Week 1-2 of the review cycle: HR launches the review cycle in the performance management system. All employees receive instructions and deadlines.
2. Employee completes a Self-Assessment covering: key accomplishments against goals, challenges encountered, skills developed, and areas they want to grow in.
3. Manager collects 360-degree input from 3-5 stakeholders (peers, cross-functional partners, direct reports if applicable) using the Standard Feedback Template.
4. Manager prepares the Performance Review document assessing the employee across 4 dimensions: Goal Achievement (what was delivered), Core Competencies (how it was delivered), Growth & Learning (development trajectory), and Collaboration & Impact (team contribution).
5. Manager assigns a preliminary rating on the 5-point scale: Exceptional, Exceeds Expectations, Meets Expectations, Developing, Below Expectations.

Preliminary ratings must be supported by specific examples and evidence. Ratings of "Exceptional" or "Below Expectations" require at least 3 documented examples. No rating may be assigned based on a single data point or recency bias.

Our current performance distribution is: Exceptional 8%, Exceeds Expectations 25%, Meets Expectations 52%, Developing 12%, Below Expectations 3%. We do not force a distribution curve, but deviations >10% from this pattern at the department level trigger a calibration discussion.

---

## Calibration

### Calibration Sessions
1. Department heads convene calibration sessions with all managers within their function. Sessions are facilitated by an HR Business Partner.
2. Managers present each employee's rating with supporting evidence. Focus discussion on employees rated Exceptional, Below Expectations, and any borderline cases.
3. Compare employees at the same level and role to ensure consistency: is an "Exceeds Expectations" in Team A equivalent to one in Team B?
4. Adjust ratings where calibration reveals inconsistencies. Document the rationale for any changes.
5. Final calibrated ratings are approved by the department head and HR before being shared with employees.

Calibration sessions are confidential. Individual employee discussions, ratings, and deliberations must not be shared beyond the calibration participants. Breaches of calibration confidentiality are treated as a serious conduct issue.

Fairness requires comparison. A manager can only assess their team fairly when they see how their assessments stack up against the broader organisation. Calibration isn't about politics — it's about equity and consistency.

---

## Review Delivery & Development Planning

### Review Conversation
1. Schedule a dedicated 60-minute review conversation for each employee. This meeting is not a surprise — the employee should already know the general direction from ongoing feedback throughout the period.
2. Begin with the employee's self-assessment: where do they feel strong, where do they want to grow? This sets a collaborative tone.
3. Share the calibrated rating with specific examples and context. Be direct but respectful. Avoid sandwiching critical feedback — address it clearly and constructively.
4. Discuss development goals for the next 6 months: identify 1-2 strengths to leverage and 1-2 growth areas with specific actions.
5. Co-create an Individual Development Plan (IDP) with measurable milestones, resources (training, mentoring, stretch assignments), and check-in dates.

Performance reviews must never be the first time an employee hears about a performance concern. If a manager delivers unexpected negative feedback during a review, this indicates a management failure, not an employee failure. Ongoing feedback is a non-negotiable management responsibility.

Performance management is not a biannual event — it's a continuous relationship between manager and employee. The formal review is simply the checkpoint that documents what both parties should already know. The real work happens in the weekly 1-on-1s, real-time feedback, and daily coaching moments.

Teams with managers who deliver feedback monthly have 23% higher employee engagement and 15% lower voluntary attrition compared to teams where feedback only occurs during formal reviews. The most valued element of the review process, according to our employee surveys, is the Individual Development Plan (rated 4.3/5.0 in importance).`,
  },
  {
    id: "hr-hiring-methodology",
    title: "Hiring & Interview Methodology",
    subtitle: "Structured hiring process from job scoping through offer, with bias-reduction practices",
    domain: "People & HR",
    icon: "users",
    wordCount: 800,
    content: `# Hiring & Interview Methodology

## Overview
This methodology defines our structured approach to hiring, from job scoping through offer delivery. It's designed to reduce bias, improve candidate experience, and consistently identify candidates who will thrive in our environment.

---

## Role Definition

### Job Scoping
1. Hiring Manager completes the Role Design Canvas defining: team context, key responsibilities, success metrics for the first 6 months, must-have vs. nice-to-have qualifications, and reporting structure.
2. HR Recruiter reviews the canvas and challenges any requirements that may unnecessarily narrow the talent pool (e.g., specific degree requirements, years-of-experience thresholds).
3. Define the Interview Scorecard: 5-7 competencies that will be assessed, each mapped to specific interview stages and assessed by designated interviewers.
4. Agree on the compensation band based on market data and internal equity analysis.
5. Write the job description using our Inclusive Job Description Template — reviewed for gender-neutral language and unnecessary jargon.

Job descriptions must focus on outcomes and competencies, not credentials. Replace "requires 10 years of experience" with "has led cross-functional initiatives at scale." Experience thresholds disproportionately exclude diverse candidates without predicting performance.

Roles with structured scorecards and pre-defined competencies have 40% less interviewer disagreement and 28% faster decision-making. Our average time-to-fill is 42 days for individual contributors and 65 days for manager-level roles.

---

## Interview Process

### Structured Interviews
Our standard interview process has 4 stages, each with a defined purpose and assessor:

1. Recruiter Screen (30 min): Assess motivation, basic qualifications, salary expectations, availability, and cultural add. Scored on: Communication Clarity and Role Motivation.
2. Hiring Manager Interview (60 min): Deep dive into relevant experience, problem-solving approach, and leadership style. Uses behavioural interview questions mapped to scorecard competencies. Scored on: Technical/Functional Expertise and Strategic Thinking.
3. Team Interview (2x 45 min): Two separate sessions with future peers/cross-functional partners. Assess collaboration style, technical depth, and team dynamics fit. Each interviewer scores different competencies to avoid redundancy.
4. Final Interview (45 min): Senior leader or skip-level manager. Focus on values alignment, ambition, and long-term potential. Scored on: Values Alignment and Growth Potential.

All interviewers must use the standardised scorecard and submit their assessment before seeing other interviewers' scores. This prevents anchoring bias and ensures independent evaluation. Interview questions must be consistent across candidates for the same role. Interviewers may ask follow-up questions based on responses, but the core question set remains the same for fairness.

We hire for trajectory, not just track record. Someone who has demonstrated rapid growth, intellectual curiosity, and resilience will outperform someone with an impressive resume and a fixed mindset. Look for the learning curve, not just the current position.

---

## Decision & Offer

### Hiring Decision
1. Within 24 hours of the final interview, all interviewers submit their scorecards with a clear recommendation: Strong Hire, Hire, Neutral, or Do Not Hire.
2. The Hiring Manager convenes a 30-minute Debrief Session with all interviewers. Discuss the candidate against the scorecard, not against other candidates or gut feelings.
3. A single "Do Not Hire" from any interviewer triggers a deeper discussion — it doesn't veto the candidate, but the concern must be addressed and documented.
4. Hiring Manager makes the final decision with HR Recruiter input. Document the rationale, including why the candidate was selected over other finalists.
5. Deliver the offer within 48 hours of the hiring decision. Include: role details, compensation breakdown, start date, and any negotiation boundaries pre-approved by HR.

Our offer acceptance rate is 82%. The top 3 reasons candidates decline are: competing offer with higher compensation (45%), location/flexibility concerns (30%), and role scope misalignment (15%). Offers delivered within 48 hours of decision have a 91% acceptance rate vs. 72% for offers delivered after 5+ days.

Counter-offers are evaluated on a case-by-case basis by the Hiring Manager and HR together. We will match within our compensation band but will not engage in bidding wars. If we can't compete on salary, we differentiate on growth opportunity, team, and mission.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // CUSTOMER SUCCESS (3 documents)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "cs-client-onboarding",
    title: "Enterprise Client Onboarding Methodology",
    subtitle: "Four-phase methodology for onboarding enterprise clients with €500K+ ARR contracts",
    domain: "Customer Success",
    icon: "heart-handshake",
    wordCount: 900,
    content: `# Enterprise Client Onboarding Methodology

## Overview
This methodology defines our four-phase approach to onboarding enterprise clients with contract values exceeding €500K ARR. It ensures consistent, high-quality engagements that establish trust, set expectations, and position the relationship for long-term success.

---

## Phase A: Discovery & Stakeholder Mapping

### Stakeholder Identification
The discovery phase begins with identifying all decision-makers, influencers, and end-users within the client organisation.

1. Request the client's organisational chart within 48 hours of contract signature.
2. Schedule a 30-minute introductory call with the executive sponsor to understand strategic priorities.
3. Identify the Day-to-Day Contact (DDC) who will serve as the operational liaison throughout onboarding.
4. Map all stakeholders to a RACI matrix covering: Project Governance, Technical Integration, Change Management, and Executive Reporting.
5. Document each stakeholder's communication preference (email, Slack, Teams, phone) and timezone.

The executive sponsor must be engaged at minimum once every two weeks during the onboarding period. Failure to maintain executive engagement correlates with a 3x increase in churn risk within the first year. Internal pricing models, margin data, and competitive intelligence must never be shared with client stakeholders, regardless of seniority.

### Needs Assessment & Gap Analysis
1. Distribute the Standard Needs Assessment Questionnaire (NAQ) to the DDC within 3 business days of contract execution.
2. Review the NAQ responses and prepare a Gap Analysis Brief highlighting mismatches between client expectations and platform capabilities.
3. Conduct a 60-minute deep-dive workshop with the client's technical team to validate integration requirements.

Our average enterprise onboarding takes 47 business days from contract signature to go-live. Top-quartile performance is 32 days. Onboardings exceeding 65 days have a 40% higher churn rate at 12 months.

---

## Phase B: Planning & Execution

### Onboarding Plan Construction
1. Create the Onboarding Project Plan within 5 business days of completing discovery.
2. Define 3-5 milestone checkpoints with clear success criteria and owner assignments.
3. Set the target Go-Live date with a minimum 5-day buffer for contingency.
4. Send the Onboarding Plan for client sign-off within 10 business days.

All onboarding plans must include a "Risk Register" section listing at least 3 identified risks with mitigation strategies.

### Technical Implementation
1. Provision the client's production environment within 2 business days of plan sign-off.
2. Configure SSO/SAML integration and validate with the client's IT team within 5 business days.
3. Execute data migration — always run a dry migration first.
4. Perform UAT with the client's designated testers.

Production data migration must never proceed without a validated rollback plan approved by the Solutions Engineering Lead.

---

## Phase C: Training & Go-Live

### Training & Enablement
1. Deliver Platform Fundamentals training to all end-user cohorts at least 5 business days before go-live.
2. Conduct a "Day in the Life" simulation session where users complete realistic workflows.
3. Provide access to our self-service knowledge base and video tutorial library.

Post-training satisfaction target: >4.2/5.0. Clients with training scores below 3.8 require a follow-up reinforcement session within 10 business days.

---

## Phase D: Handoff & Continuous Success

### Transition to Customer Success
1. Schedule a formal handoff meeting between the Onboarding Lead, CSM, and client DDC within 5 business days of go-live.
2. Prepare the Client Health Scorecard capturing: adoption metrics, training completion, outstanding issues, and risk indicators.
3. Set the first QBR date — must occur within 60 days of go-live.

The Onboarding Lead must remain available for escalations for 15 business days after handoff.

Onboarding quality is the single strongest predictor of long-term retention. Every hour invested returns 10x in reduced support burden and increased expansion revenue.

Our NPS benchmark for enterprise onboardings is +62. Current quarterly average: +58. Analysis of 127 onboardings shows that clients completing all four phases within target have 2.3x higher expansion revenue at 18 months.`,
  },
  {
    id: "cs-escalation-sla",
    title: "Support Escalation & SLA Management",
    subtitle: "Tiered support process with defined SLAs, escalation paths, and customer communication",
    domain: "Customer Success",
    icon: "heart-handshake",
    wordCount: 750,
    content: `# Support Escalation & SLA Management

## Overview
This procedure defines our tiered support model, service level agreements, escalation paths, and customer communication standards. It applies to all post-sales support interactions across all customer segments.

---

## Support Tiers & SLAs

### Tier Framework
Tier 1 — Front-line Support: Handles initial ticket triage, known-issue resolution, and how-to questions. SLA: first response within 2 hours (business hours), resolution within 1 business day for standard issues.

Tier 2 — Technical Support: Handles complex technical issues, configuration problems, and bug reproduction. SLA: first response within 4 hours, resolution within 3 business days.

Tier 3 — Engineering Escalation: Handles confirmed bugs, platform issues, and infrastructure problems. SLA: acknowledgment within 4 hours, resolution timeline provided within 1 business day.

SLA timers begin at ticket creation, not at first response. A ticket that receives a quick acknowledgment but no meaningful progress is still subject to resolution SLAs. Enterprise clients with Premier Support contracts receive priority queuing: all SLAs are 50% tighter and Tier 2 is the entry point (no Tier 1 routing for Premier accounts).

Our current SLA compliance rates are: Tier 1 first response 96%, Tier 1 resolution 91%, Tier 2 first response 93%, Tier 2 resolution 84%, Tier 3 acknowledgment 89%. Our target across all tiers is >95%. Tier 2 resolution is our weakest metric, primarily driven by complex integration issues.

---

## Escalation Process

### Escalation Steps
1. Tier 1 → Tier 2: Automatic after 30 minutes of troubleshooting without resolution, or immediately if the issue involves data integrity, security, or service outage. Tier 1 agent completes the Escalation Handoff Template before transferring.
2. Tier 2 → Tier 3: When the issue is confirmed as a product bug or requires code-level investigation. Tier 2 engineer provides: reproduction steps, environment details, business impact assessment, and customer communication history.
3. Management Escalation: Any customer who explicitly requests to speak with a manager, or any ticket that has breached its SLA by >50%, triggers management escalation. Support Manager contacts the customer within 2 hours.
4. Executive Escalation: For Enterprise clients: any SEV-1 ticket, any client threatening churn, or CSM-flagged accounts. VP of Customer Success is notified and personally reviews the response plan.

Customers must never be asked to re-explain their issue after an escalation. The receiving tier must review all prior communications and demonstrate understanding before engaging the customer.

Every escalation is a signal that our product, process, or people need improvement. We track escalation patterns not to manage workload, but to identify and eliminate the root causes that create the need for escalation in the first place.

---

## Customer Communication Standards

### Communication Guidelines
1. All customer communications use professional, empathetic language. Acknowledge the impact before diving into technical details.
2. Status updates are proactive, not reactive. For any ticket open >24 hours, send a daily update even if there's no progress to report — silence is worse than "we're still working on it."
3. Resolution communications must include: what happened, what we did to fix it, and what we're doing to prevent recurrence.
4. After resolution, send a Customer Satisfaction Survey. Tickets scoring below 3/5 trigger a follow-up call from the Support Manager.

Tickets with proactive daily updates receive satisfaction scores 1.4 points higher (on a 5-point scale) than tickets where the customer had to ask for updates. Our overall support CSAT is 4.2/5.0. The strongest driver of support satisfaction is "felt informed throughout the process," not resolution speed.`,
  },
  {
    id: "cs-qbr-playbook",
    title: "Quarterly Business Review Guide",
    subtitle: "How CSMs prepare, deliver, and follow up on strategic customer reviews",
    domain: "Customer Success",
    icon: "heart-handshake",
    wordCount: 750,
    content: `# Quarterly Business Review Guide

## Overview
The Quarterly Business Review is our primary strategic touchpoint with clients. It's where we demonstrate value delivered, align on future priorities, and identify expansion opportunities. This guide ensures every QBR is consistently excellent.

---

## Preparation (T-14 to T-1)

### QBR Preparation
1. T-14 days: CSM confirms the QBR date, attendees, and agenda with the client's executive sponsor and DDC. Ideal attendees: executive sponsor, DDC, key stakeholders from 2-3 departments.
2. T-10 days: Pull the QBR Data Pack from our analytics platform: usage metrics, adoption trends, support ticket summary, feature utilisation, and ROI calculations based on the client's agreed success metrics.
3. T-7 days: Draft the QBR Presentation using the Standard QBR Template. Customise the value narrative to the client's specific goals and industry context.
4. T-5 days: Internal QBR Prep Session with the Account Executive — align on renewal timeline, expansion opportunities to seed, and any sensitive topics to navigate.
5. T-2 days: Send the client a pre-read summary (maximum 1 page) highlighting key achievements and proposed discussion topics, inviting them to add their own agenda items.

A QBR must never be a one-way data dump. Maximum 40% of the meeting should be presentation; 60% should be discussion. If you're talking more than listening in a QBR, you're doing it wrong.

Clients who attend QBRs consistently (4 per year) have 45% higher renewal rates and 2.1x higher expansion revenue compared to clients with sporadic QBR attendance. The most common reason clients skip QBRs is "didn't see value in previous sessions."

---

## Delivery

### QBR Structure
The Standard QBR structure (60-90 minutes):

1. Opening (5 min): Relationship check — how are things going generally? Any immediate concerns before we dive in?
2. Value Delivered (15 min): Present the top 3-5 measurable outcomes since the last QBR. Tie every metric to the client's stated business goals. Use their language, not ours.
3. Adoption & Health (10 min): Share usage trends, feature adoption, and any areas where the platform is underutilised. Frame underutilisation as opportunity, not failure.
4. Client Voice (20 min): Open discussion — what's working, what's frustrating, what's changed in their business, and what are their priorities for the next quarter?
5. Forward Plan (15 min): Co-create the mutual action plan for the next quarter. Include specific goals, deadlines, and owners from both sides.
6. Strategic Preview (10 min): Share relevant upcoming features or capabilities, tailored to their use case. Seed expansion conversations naturally by connecting new capabilities to their stated challenges.

The best QBR leaves the client thinking "these people understand my business." It's not about our platform — it's about their outcomes. Every slide, every metric, every recommendation should be framed through the lens of what matters to them, not what matters to us.

---

## Follow-Up (T+1 to T+5)

### Post-QBR Actions
1. Send a QBR Summary email within 24 hours: key takeaways, agreed action items with owners and dates, and any commitments made.
2. Log the QBR outcome in the CRM: client health assessment, expansion signals, risk flags, and next QBR date.
3. Share relevant expansion signals with the Account Executive within 48 hours. Include context on the client's priorities and the natural entry point for the conversation.
4. Complete any CSM-owned action items within the committed timeframe. Overdue QBR actions are automatically flagged to the CS Director.
5. If the client raised a concern or frustration, follow up with a specific resolution or progress update within 5 business days — don't wait for the next QBR.

QBR follow-up is non-negotiable. A QBR without follow-through is worse than no QBR at all — it teaches the client that our commitments are unreliable. Every action item must be tracked, completed, and communicated.

CSMs who send the QBR summary within 24 hours see 30% higher action item completion rates from both sides compared to summaries sent after 3+ days. The most impactful QBR element, rated by clients, is "concrete action plan with clear ownership."`,
  },
];

/** Legacy export for backward compatibility */
export const SAMPLE_CONTENT = SAMPLE_DOCUMENTS[0].content;
