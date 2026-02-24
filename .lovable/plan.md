

# Refined 7 Capability Cards -- Demand-Driven Framing

## The Problem with the Current Draft

The original 7 cards use insider language ("governance," "technical debt," "intelligence-first workflows"). Real buyers don't think in those terms. They think: "We bought Copilot licences and nothing changed," or "Our best person is leaving and nobody knows what she knows."

## The Reframe: From Abstract Principles to Felt Demands

Each card will follow this structure:

```text
+-----------------------------------------------+
| [icon]                                         |
| THE DEMAND (what the buyer is feeling/saying)  |
| Short gut-punch question or statement          |
|                                                |
| WHY IT HAPPENS                                 |
| One sentence explaining the root cause         |
|                                                |
| WHAT WE BUILD TOGETHER                         |
| What gets created during the Sprint/Programme  |
+-----------------------------------------------+
```

### The 7 Cards (Revised)

| # | Demand (buyer's voice) | Why it happens | What we build |
|---|---|---|---|
| 1 | **"We bought AI tools and nothing changed."** | AI amplifies whatever process it's given. If the process was never documented properly, AI just automates the mess. | A structured knowledge base where every process has an owner, a version, and a scope -- so AI has something worth executing. |
| 2 | **"We're still doing everything the same way, just with a chatbot."** | Most firms bolt AI onto existing human workflows. The process stays the same; AI just sits on top. | Workflows redesigned for AI execution with human steering -- not the other way around. The system runs the process; your people steer it. |
| 3 | **"We gave everyone AI access and productivity didn't move."** | People are still doing the work manually and using AI as a spell-checker. The role hasn't changed, just the tools. | Clear role boundaries: AI handles execution, your people handle judgment calls. Accountability shifts from "doing" to "steering." |
| 4 | **"We tried to scale AI and hit a wall of undocumented processes."** | Years of shortcuts, tribal knowledge, and "ask Sarah" culture. AI forces you to confront what was never written down. | A diagnostic extraction that surfaces every undocumented dependency, unclear decision, and knowledge gap -- then codifies them. |
| 5 | **"AI is an IT project. The business doesn't own it."** | Central AI teams build tools; business teams don't adopt them. There's no ownership where value is actually created. | Business teams own their own protocols inside LIZA. IT enables the platform; the business defines what runs on it. |
| 6 | **"We have 30 AI use cases but nothing that actually scales."** | Pilots are isolated experiments. Nobody reorganised the actual workflow around them. | Knowledge packaged around complete end-to-end workflows, not point solutions. One Sprint codifies a whole process, not a feature. |
| 7 | **"People are afraid AI will expose what they don't know."** | No visibility into what AI is doing or who's accountable when it's wrong. Fear of exposure kills adoption. | Full transparency: every AI action traces to a governed protocol with a visible owner. People see what it follows, and they stay in control. |

## Where This Goes

### Enterprise Page (`src/pages/EnterpriseDeck.tsx`)

Add a new `TransformationFramework` component (~130 lines) inserted **after** `MaturityInfographic` and **before** `LizaDifferentiator` in the page composition. This is the natural place: after "here's where you are on the maturity curve" comes "here's why you're stuck."

Section heading: *"Sound familiar?"* with subheading: *"Seven things every organisation hits when they try to scale AI. We've built the answer to each one."*

The 7 cards render in a responsive grid (2 columns on desktop, 1 on mobile). Each card uses the existing design system (rounded-2xl, border, muted backgrounds, brand gradient accents).

### Home Page (`src/pages/marketing/ProfessionalServices.tsx`)

Add a compact `ValidationBridge` component (~25 lines) inserted **between** `<Proof />` and `<LizaDifferentiator />`. This is a single-paragraph callout block:

> *"AI transformation fails when companies automate broken processes. We start by codifying the judgment layer -- the part that was never written down. That's the foundation everything else scales on."*

This bridges the Sprint positioning to the broader AI narrative without disrupting the conversion flow.

### Technical Details

- New `TransformationFramework` component in `EnterpriseDeck.tsx` using the existing `SectionTag`, `GradientText` helpers and `GRN` color constant already defined in that file
- New `ValidationBridge` component in `ProfessionalServices.tsx` using the same existing helpers
- Icons from lucide-react (already imported): `Shield`, `Layers`, `Brain`, `Cpu`, `BarChart3`, `Zap`, `Lock` mapped to each card
- No new dependencies required
- Page composition updated to insert the new components at the specified positions
