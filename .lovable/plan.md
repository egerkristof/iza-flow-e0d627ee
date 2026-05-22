## The reframe

You're right. The current 4-domain maturity probe is the wrong instrument. The leader walking in doesn't want to score themselves on tiers. They want to describe **what they're trying to achieve, the AI tools they're using, and the limitations they're hitting**, and walk out with a read on their **AI Operating Model** seen through the LIZA grid (the same grid that anchors `/os` and `/tech-dd`: in-the-moment execution sitting between intent and outcomes, governed by a knowledge layer).

This makes The Brief consistent with the rest of the system instead of inventing its own vocabulary.

## New flow (one screen, three inputs, one diagnosis)

```text
┌─────────────────────────────────────────────────────────────┐
│  INPUT — Describe your current AI state                     │
├─────────────────────────────────────────────────────────────┤
│  1. Goal                                                    │
│     What are you trying to achieve with AI in your unit?    │
│                                                             │
│  2. Current stack                                           │
│     Which AI tools / copilots / agents are in use today?    │
│     (multi-select chips + free text)                        │
│                                                             │
│  3. Limitations                                             │
│     What's not working? Where does it break down?           │
│     (multi-select chips + free text)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  DIAGNOSIS — Your AI Operating Model, mapped to the grid    │
├─────────────────────────────────────────────────────────────┤
│  A. Read of your current model                              │
│     One paragraph naming what they're actually running      │
│                                                             │
│  B. Tool limitations (per tool they named)                  │
│     ChatGPT       → no persistent context, every prompt    │
│                     restarts the conversation               │
│     Copilot       → bounded to code, no business standard  │
│     Notion AI     → reads pages, not your decision logic   │
│                                                             │
│  C. Gaps on the LIZA grid                                   │
│     Visualised on the same stack you show at /os:           │
│       Intent  ──▶  KNOWLEDGE LAYER  ──▶  Execution  ──▶ Out │
│       (goal)      (where they're empty)   (their tools)     │
│     Red/amber/green per layer.                              │
│                                                             │
│  D. What they haven't thought about yet                     │
│     2 to 3 specific blind spots, grounded in their stack    │
│                                                             │
│  E. The correction                                          │
│     One move that closes the biggest gap. Named, scoped,    │
│     tied to LIZA capability.                                │
└─────────────────────────────────────────────────────────────┘
```

## What I'd build

**Frontend — rewrite `src/pages/TheBrief.tsx`**
- Replace seat → 4 probes → blueprint with a single input screen (goal, tool chips + other, limitation chips + other).
- Tool chip set, curated: ChatGPT, Claude, Gemini, Copilot (M365), GitHub Copilot, Cursor, Glean, Notion AI, custom GPTs, internal RAG, agent framework (LangChain/CrewAI), none yet.
- Limitation chip set, curated: hallucinations, no memory across sessions, can't enforce our standards, no audit trail, siloed per user, doesn't know our data, output quality inconsistent, no governance, can't hand off between tools.
- Submit shows a **single diagnosis view** rendered on the LIZA grid (reuse the visual language from `/os` — three horizontal layers: Intent → Knowledge → Execution).

**Edge function — replace `generate-brief` modes**
- One mode: `diagnose_operating_model`. Takes `{ goal, tools[], limitations[], freeText }`, returns a structured diagnosis via tool call:
  - `current_model_read` (paragraph)
  - `tool_limitations[]` — `{ tool, limitation }` (only for tools they named, grounded in known properties of each tool)
  - `grid_status` — `{ intent: status, knowledge: status, execution: status }` with one-line `why` each
  - `blind_spots[]` — 2 to 3 items, each `{ title, why }`
  - `correction` — `{ move, scope, liza_capability }`
- Model: `google/gemini-3-flash-preview`, 18s timeout, deterministic fallback if it times out (same pattern we have now).

**Visual — the grid panel**
- Inline component (not a new page). Three horizontal bands stacked: **Intent**, **Knowledge Layer**, **Execution**. Each band shows status colour (red = missing, amber = partial, green = working). Their tools render as chips inside the Execution band. The Knowledge Layer is the one we expect to be empty — that's the punchline.

## What goes away
- Seat selection (function / unit shape / scale) — gone, or collapsed into one optional dropdown.
- The 4-domain probes (Demand / Capacity / Quality / Economics) — gone for this surface. They remain valid for a future consulting-grade audit but are the wrong instrument for first contact.
- The blueprint pillar animation — replaced with the LIZA grid diagram (which already exists conceptually on /os and is on-brand).

## One thing to confirm before I build

**Scope of this rewrite.** Two options:

**A. Replace the existing `/the-brief` entirely** with this new flow. Old seat + 4-domain code is removed. This is what I'd recommend — keeps one surface, one story.

**B. Keep the existing flow at `/the-brief` and add the new diagnosis at `/the-brief/quick`** so we can A/B. More code to maintain, more places for the user to get lost.

I'll proceed with **A** unless you say otherwise.
