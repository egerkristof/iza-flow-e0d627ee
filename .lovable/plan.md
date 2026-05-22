
# The Brief v2 — From conversation to diagnosis

## What changes vs today

Today: 5 open questions → memo. Generic across any GM.

Tomorrow: **Function selected up front → 4 domains probed with function-specific questions → maturity scored per domain → bridge framework prescribes the moves to reach the LIZA target state.**

The output stops being a memo. It becomes a diagnosis with a prescription.

## Step 1 — Seat selection (30 seconds)

Three dropdowns before any AI call:

- **Function**: GM / Head of Ops / Head of Commercial / Head of Delivery / Head of R&D / Head of Finance / Head of People
- **Unit shape**: P&L slice / Shared service / Product line / Region
- **Scale**: <50 / 50–200 / 200–500 / 500–2000 / 2000+

This bounds every prompt downstream. No more "tell me about your unit." The system already knows the rough shape.

## Step 2 — The four decision domains

Every operating role makes decisions in four domains. We probe each one with 2 function-specific questions. The questions a Head of Ops gets are not the questions a Head of Commercial gets.

```text
┌─────────────────────────────────────────────────────────────┐
│  1. DEMAND          What's coming at the unit               │
│                     Pipeline, orders, tickets, requests     │
│                     Decision: what do we take, what do we   │
│                     refuse, what do we price up             │
├─────────────────────────────────────────────────────────────┤
│  2. CAPACITY        What the unit can actually deliver      │
│                     People, machines, hours, skill mix      │
│                     Decision: where do we add, where do we  │
│                     stretch, where do we cut                │
├─────────────────────────────────────────────────────────────┤
│  3. QUALITY         Whether the output meets the bar        │
│                     Defects, rework, SLA, compliance        │
│                     Decision: what's the standard, who      │
│                     enforces it, what's the consequence     │
├─────────────────────────────────────────────────────────────┤
│  4. ECONOMICS       Whether the unit math works             │
│                     Margin, unit cost, leakage, mix         │
│                     Decision: what do we kill, what do we   │
│                     double down on, where do we invest      │
└─────────────────────────────────────────────────────────────┘
```

For each domain we ask:
- **What signal do you trust today?** (the input)
- **What system produces it?** (the substrate — ERP, CRM, spreadsheet, Slack, head)

The second question is the one that exposes maturity. "I look at the dashboard" vs "I ask Maria" vs "I feel it" are three different operating states.

## Step 3 — The bridge framework

For each domain we score the unit against four maturity tiers. This is the **LIZA target state** mapped to a real operating function.

```text
TIER 0 — TACIT          Decision lives in someone's head
TIER 1 — RECORDED       Decision logic exists, in scattered files/people
TIER 2 — STANDARDISED   Decision logic is one place, one version
TIER 3 — EXECUTABLE     Decision logic runs as code or AI can use it directly
```

The diagnosis output looks like this, per domain:

```text
DEMAND          Tier 1   →   needs to reach Tier 3
                Today: pipeline lives in CRM + 3 spreadsheets + Maria's head
                Bridge: codify deal-scoring rules, expose to AI, retire Maria-as-router
                Effort: 6 weeks, 1 ops analyst
                Unlock: 8 hrs/week back to GM, faster qualification

CAPACITY        Tier 0   →   needs to reach Tier 2
                ...

QUALITY         Tier 2   →   already healthy, hold
                ...

ECONOMICS       Tier 1   →   needs to reach Tier 3
                ...
```

## Step 4 — The economic anchor

You said it: *the cost of tokens must be in line with the value created*. So the diagnosis closes with a **token-economics view**:

```text
WHERE AI EARNS ITS KEEP IN YOUR UNIT

DEMAND          High ROI on AI    — repetitive, structured, high-volume decisions
CAPACITY        Medium ROI        — needs human judgement, AI augments
QUALITY         High ROI          — pattern detection, AI catches what humans miss
ECONOMICS       Low ROI today     — needs Tier 2 data first, then high ROI

START HERE: Demand. Move it from Tier 1 to Tier 3 first.
That's where tokens convert to margin fastest in a unit your size.
```

## What the user experiences

1. Picks function + unit shape + scale (15 seconds, no AI)
2. Sees 4 domain cards, opens each, answers 2 questions per domain (5–8 minutes total)
3. Sees per-domain maturity tier with a one-line "why this tier" justification
4. Sees the bridge: current → target, with the move, the effort, the unlock
5. Sees the token-economics ranking telling them **where to start**

## Technical sketch

- New file `src/lib/brief-framework.ts`: function profiles, domain definitions, tier definitions, question banks per function × domain
- `TheBrief.tsx` becomes a 4-step flow: seat → domain probes (4 sub-steps) → diagnosis → bridge
- `generate-brief` edge function gains two new modes:
  - `score_domain` — given function + domain + user answers, returns tier (0–3) + one-line justification + bridge move + effort estimate + unlock
  - `synthesize_diagnosis` — given all 4 domain scores, returns the token-economics ranking and the "start here" call
- Persists the full diagnosis (function, unit shape, scale, per-domain tier, per-domain bridge, ranking) in `briefs.output` so it can be re-opened, exported, or revisited.

## One thing I want you to confirm

**The four domains.** I proposed Demand / Capacity / Quality / Economics because they apply across functions (a Head of R&D has demand=requests from business, capacity=scientists, quality=experimental rigor, economics=cost-per-insight).

If you have a different four — say, the LIZA canonical four are different — tell me now and I'll build against those instead. Otherwise I proceed with these.
