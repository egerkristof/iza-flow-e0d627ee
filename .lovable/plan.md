

# Enrich Audit Solution Page with Advisory Revenue Narrative

## The Strategic Insight

The biggest revenue driver for audit firms is **advisory/consulting** (40-50%+ of revenue), not statutory audit itself. Audits are often low-margin "door openers" to high-margin advisory engagements. The narrative should position the audit engine not just as a speed tool, but as the entry point to a knowledge flywheel that directly feeds advisory pipeline.

## Changes to `src/pages/marketing/SecurityAuditSolution.tsx`

### New Section 1: "Beyond the Audit" -- The Revenue Flywheel
Placed after "Why It Matters," before "Deployment Model." A horizontal 4-step flow showing:

1. **Execute** -- Complete audits 10x faster (the engine)
2. **Capture** -- Every audit surfaces control gaps, client patterns, recurring weaknesses. This intelligence is currently lost in spreadsheets.
3. **Advise** -- Findings become data-driven advisory proposals. "We found 14 control gaps across your last 3 audits -- here's a remediation programme." Your advisory pipeline becomes evidence-based, not relationship-dependent.
4. **Compound** -- Past audits inform future ones. New auditors inherit institutional memory. Cross-client patterns surface emerging risks.

Framing headline: **"Your audits are already generating advisory revenue. You just can't see it yet."**

Subtext: "Every audit produces structured intelligence about client risk posture, operational gaps, and control maturity. Today, that insight lives in your auditors' heads and disappears when they move to the next engagement."

### New Section 2: "Knowledge That Pays" -- Audit-to-Advisory Bridge
A focused two-column section:
- **Left column** -- "What auditors learn but never capture": Client-specific risk patterns, recurring control failures, evidence quality signals, industry-specific gap clusters
- **Right column** -- "What this becomes with LIZA": Data-driven remediation proposals, proactive risk briefings, cross-client benchmarking insights, advisory engagement blueprints

### New Section 3: "What Becomes Possible" -- Vision
A subtler, aspirational section (dashed borders to signal forward-looking):
- **Predictive Scoping**: System suggests which controls will likely fail based on client profile and historical data
- **Automated Remediation Tracking**: Audit findings auto-generate follow-up tasks with full context
- **Cross-Client Intelligence**: Anonymised patterns across your client base surface emerging risks
- **New Auditor Acceleration**: Junior staff execute at near-senior quality from day one, backed by institutional knowledge

## Minor Update to `src/pages/marketing/UseCases.tsx`

Update the audit card description (line ~196) to hint at the broader value chain: add a brief line about how the engine captures intelligence that feeds advisory pipeline.

## Technical Details
- New icons added to imports: `BookOpen`, `Lightbulb`, `RefreshCw`, `DollarSign`, `Brain`, `LineChart`
- All new sections reuse existing `SectionTag`, `GradientText`, and card patterns
- Vision section uses dashed borders and lower-opacity accents to differentiate from live features
- No new components or dependencies needed

