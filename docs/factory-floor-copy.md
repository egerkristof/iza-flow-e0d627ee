# Factory Floor — Full Copy Document

**Route (proposed):** `/factory-floor`
**Audience:** Head of AI / AI Rollout Owner at a scaling org (DACH).
**Core mental shift:** *AI is a tool people use* → *AI is a factory floor, and right now I'm running it like a craft workshop.*
**Promise:** In 90 seconds, 4 questions, you'll see whether your AI operation is a workshop or a factory — and what's missing to scale it.

---

## 0. Page-level framing

### Above-the-fold title (one of two — pick later)
- **A:** *Your AI works. Now it has to scale. Most orgs don't survive that step.*
- **B:** *You're running AI like a craft workshop. Scaling needs a factory floor.*

### Sub-line
*4 questions. 90 seconds. A verdict you can show your CEO on Monday.*

### Single CTA on the page
**"Run the check"** — no email, no signup, instant verdict on screen. Email only at the end, to send the PDF.

---

## 1. The 4 input scenes

Each scene has three pieces:
- **Question** (binary or single number, 5 seconds to answer)
- **The moment-after line** (appears the instant they answer — this is the reframe)
- **Tiny visual cue** (one icon/diagram element that builds toward the final 4-quadrant factory)

The 4 questions map 1:1 to the 4 factory parts: **Standard / Line / QA / Meter.**

---

### Scene 1 — **The Standard** (do you have a written definition of "good"?)

**Question:**
> For your most-used AI workflow, is there a written, agreed definition of what a "good output" looks like — that the AI is held to?
>
> ◯ Yes, written and used
> ◯ Sort of, in people's heads
> ◯ No

**Moment-after line (any answer):**
> *Every factory starts with a spec sheet. Without one, every AI output is a craftsman's opinion, and every reviewer is grading on vibes.*

**Visual cue:** The "Standard" quadrant of the factory diagram lights up — green if Yes, amber if Sort-of, red if No.

---

### Scene 2 — **The Line** (is the AI work repeatable, or bespoke every time?)

**Question:**
> When two different people use AI for the same task in your org, do they get the same shape of output?
>
> ◯ Yes, it's templated
> ◯ Roughly, depends on the person
> ◯ No, every output looks different

**Moment-after line:**
> *A factory line produces the same part a thousand times. A workshop produces a thousand different parts. Workshops don't scale by hiring more craftsmen — they collapse.*

**Visual cue:** The "Line" quadrant lights up.

---

### Scene 3 — **The QA** (who catches bad output before it ships?)

**Question:**
> When AI produces a wrong or off-brand output, what catches it before it reaches a customer/decision?
>
> ◯ An automated check
> ◯ A human reviewer, every time
> ◯ Whoever happens to notice

**Moment-after line:**
> *Factories ship at scale because QA runs in-line, not as heroics. If your only QA is "someone notices," your error rate is whatever your most tired employee allows.*

**Visual cue:** The "QA" quadrant lights up.

---

### Scene 4 — **The Meter** (do you know cost-per-output and quality-per-output?)

**Question:**
> For your top AI workflow, can you state — today — the cost per output and the rework rate?
>
> ◯ Yes, both
> ◯ One of them
> ◯ Neither

**Moment-after line:**
> *A factory without meters is just an expensive room with lights on. You can't scale what you can't measure, and you can't defend an AI budget to a CFO with vibes.*

**Visual cue:** The "Meter" quadrant lights up. All 4 quadrants now visible — the factory diagram is complete (in whichever colors their answers produced).

---

## 2. The verdict engine — three states

After Scene 4, the page renders **one of three verdicts**, picked by their pattern of answers. Same factory metaphor across all three. Different dramatic posture.

**State selection rules (rough):**
- **Pre-factory:** mostly "No" answers, and they self-described as early (we infer from a 1-line bonus question: *"Roughly how many AI workflows are live in production today?"* → 0–2).
- **Workshop:** mix of Yes/Sort-of/No. 3–8 workflows.
- **Workshop-at-scale:** mostly "Sort-of" / "No" but **10+ workflows live**. The dangerous one.

---

### State A — **Pre-factory** ("You're about to hire craftsmen. Don't.")

**Headline on screen:**
> **You haven't built the workshop yet. Build the line first.**

**Diagnosis paragraph (on screen):**
> Right now AI in your org is a few smart people doing impressive things by hand. That's the workshop stage, and it's the right stage — for about six months. The trap is the next decision: most leaders respond to early wins by greenlighting more pilots and hiring more "AI people." That's hiring more craftsmen for a workshop that has no spec sheet, no line, no QA, no meter. It doesn't scale; it multiplies the chaos. The window you have right now — before headcount and pilots compound — is the cheapest window you will ever have to install the four factory parts.

**Named gap:** *All four. Start with **the Standard.***

**"Monday in 6 months" scene (on screen):**
> *It's a Monday in May. You have 12 AI initiatives live across 5 teams. No two produce output the same way. Three have quietly stopped. Your CFO asks what the €400K cloud bill bought. You don't have an answer that survives the meeting.*

**Next move (single line, in the verdict card):**
> Write **one Standard** for your single most-used AI workflow before your next pilot launches. One page. That's the foundation of the factory.

**PDF (2 pages, emailed):** *"The Pre-Factory Brief — How to install the first Standard before your next pilot."* Includes one template: a 1-page Standard for an AI workflow (Inputs / Decision criteria / Output shape / Rejection conditions / Owner).

---

### State B — **Workshop** ("The bruise is real. You have months, not years.")

**Headline:**
> **You have a workshop. It's already bruising. You have months, not years, to install the line.**

**Diagnosis paragraph:**
> You're past the demo phase. AI is producing real work, used by real people, on real customer-facing surfaces. And the cracks are appearing in the places cracks always appear in a workshop being asked to behave like a factory: outputs drift between users, review is a bottleneck, costs creep without a story, and you personally are the QA function. None of this is a tooling problem. It's a structural one. You have one, maybe two of the four factory parts installed — the rest are running on goodwill. Goodwill expires the quarter after the CFO starts asking for unit economics.

**Named gap:** *Whichever quadrant they scored weakest. The page names it explicitly: "Your weakest part is the **QA**" (or Standard / Line / Meter).*

**"Monday in 6 months" scene:**
> *It's a Monday in May. Your best AI workflow now runs 800 times a week. You're reviewing 30% of outputs personally because no one else can hold the bar. You stop a launch on Wednesday because two outputs went out wrong on Tuesday and you can't tell whether it's the model, the prompt, or the user. The CEO asks if AI is ready for the next department. You hedge.*

**Next move:**
> Pick your **highest-volume AI workflow**. Install an automated QA check on it within 30 days. One workflow, one check. That's how the line begins.

**PDF:** *"The Workshop Brief — Installing the first QA gate on your highest-volume workflow."* Includes one template: a QA gate spec (Trigger / Rule / Pass condition / Fail handling / Owner).

---

### State C — **Workshop-at-scale** ("You're running a factory with no factory.")

**Headline:**
> **You are running a factory with no Standard, no QA, no Meter. The cost is compounding monthly.**

**Diagnosis paragraph:**
> You're not in the workshop stage anymore. You have ten or more AI workflows live, hundreds of people using them, and a monthly spend that already shows up on the CFO's radar. The structure underneath has not kept up. There is no Standard to hold outputs to, no Line that makes outputs repeatable, no QA that catches errors in-line, and no Meter that ties cost to value. Every new initiative you launch from this base inherits the missing structure and compounds the rework. The right move is not another pilot. The right move is to stop launching, install the Meter first so you can see the bleeding, and only then rebuild the line.

**Named gap:** *Multiple, ranked. **1. Meter. 2. Standard. 3. QA. 4. Line.*** (Meter first because in this state the org is flying blind on cost — every decision after needs the Meter to defend.)

**"Monday in 6 months" scene:**
> *It's a Monday in May. A board member asks for the ROI of your AI program. You have 23 workflows live, a €1.2M annual spend, and no defensible number for any of them. The CTO has started routing around you. Two of your best AI engineers have left because "no one knows what good looks like here."*

**Next move:**
> **Stop launching new AI workflows for 30 days.** Install the Meter on your top 3 by spend. You cannot fix what you cannot see, and right now you cannot see.

**PDF:** *"The Workshop-at-Scale Brief — Installing the Meter before the next pilot."* Includes one template: a Meter spec (Cost-per-output / Rework rate / Quality sample / Reviewer / Cadence).

---

## 3. The artifacts they leave with

### Artifact 1 — On-screen verdict card (the screenshot moment)
- 4-quadrant factory diagram of **their** org (colored by their answers)
- Headline + 1-line diagnosis + named gap + next move
- "Copy as image" button

### Artifact 2 — Shareable PNG
- Same diagram + headline
- LIZA OS footer, no hard brand sell
- Text overlay: *"My org's AI factory floor — [State]. [Named gap] is missing."*

### Artifact 3 — Emailed PDF (2 pages, state-specific)
- **Page 1:** Diagnosis paragraph + 4-quadrant diagram + the one "Monday in 6 months" scene.
- **Page 2:** The named gap explained + the one template they can use without us + a single line on what a 30-day sprint would install if they want help.

**Email gate copy:**
> *Want the 2-page brief and the template? Drop your work email. No sequence, no nurture — one email, one PDF.*

---

## 4. New vocabulary the page installs

By the end, the buyer should leave with **4 words they didn't have before**, all in the same metaphor:
- **Standard** — the written definition of "good"
- **Line** — the repeatable shape of the work
- **QA** — the in-line check
- **Meter** — the cost/quality instrument

This is the vocabulary the sales call inherits. The first call no longer starts with "tell me about your AI strategy." It starts with *"You scored weakest on Meter — walk me through your top workflow."*

---

## 5. What is deliberately NOT on the page

- No product screenshots.
- No mention of LIZA OS features.
- No pricing.
- No long methodology section (a single collapsed "How this is scored" link at the bottom).
- No second CTA competing with the verdict.
- No persona selector — the engine handles the fork.

---

## 6. Open questions for you to mark up

1. **Title A vs B** at the top — which lands harder?
2. **The 4 questions** — anything to cut, sharpen, or replace?
3. **The 3 verdict headlines** — do they each feel like a different film, or do they blur?
4. **The "Monday in 6 months" scenes** — too dramatic, just right, or too soft?
5. **The bonus question** ("how many AI workflows live in production?") — keep as a 5th input, or infer from the 4?
6. **The PDF templates** (Standard / QA gate / Meter spec) — right three, or swap one?

Mark this up. Once it's locked, we storyboard the diagram, then build `/factory-floor`.