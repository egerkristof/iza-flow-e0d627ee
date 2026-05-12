## The expert council (4 lenses I will review the deck through)

1. **The Storyteller** (pitch coach). Does each slide pull the reader to the next? Is there a single sentence per slide a tired investor remembers?
2. **The Operator-Investor** (angel writing €25K). What is the risk, what is my money buying, what is the next milestone, when do I get a markup?
3. **The Founder-CFO**. Does the use of funds reconcile with runway, salary, and engineering cost? Is the urgency credible?
4. **The Visual Editor**. Is each slide one idea with one diagram? No wall of text, no jargon, no orphan boxes.

Council reading the current 10 slides: thesis is right but the deck still feels like a "company overview" rather than a *bridge ask under time pressure*. It misses the human stakes (founders need salary, engineers need to keep shipping), the urgency clock, the proof we are already converting, and an irresistible "why now / why this check" close.

## The new narrative arc (12 slides, every slide earns its place)

Each slide has: one headline idea, one supporting visual, and a one-line sub that hands off to the next slide.

```text
1  Cover ──► 2 Moment ──► 3 Proof ──► 4 What we built ──► 5 The gap to scale
                                                           │
6  The €200k unlock ◄── 7 What it buys ◄── 8 6-month plan ◄┘
                                                           │
9  Wedge industries ──► 10 Path to markup ──► 11 Team ──► 12 Ask + close
```

## Slide-by-slide blueprint

**1. Cover — "€200K. 6 weeks. The bridge to self-serve."**
Dark hero. Round size, check size, close window, target close date. One line: *"Funding the engineering runway that turns 4 paid design partnerships into a self-serve SaaS engine."*

**2. The Moment — Why now, why us, why this round**
Three-column split: *Market moment* (every enterprise is wiring AI, nobody owns the context layer) · *Company moment* (4 paid partnerships, core works, self-serve is the next unlock) · *Capital moment* (€200K bridges to a financeable Seed on proven self-serve metrics). One sentence: *"This is the cheapest entry point we will ever offer."*

**3. Proof — The Knowledge Cycle, validated 4 / 4**
Reuse the 4 partnership cards (Consulting, AEC, Pharma, Cybersecurity) but lead with a single big diagram: *Capture → Govern → Execute → Evolve*, with a checkmark on each industry where the loop ran end-to-end. Right rail: 18 days → 1 day, early ARR, 4/4 industries. Replaces today's "Traction" slide.

**4. What we built — Core infra + native UIs, in plain English**
Drop "AACE". Replace with four labeled blocks: *Knowledge Capture, Reasoning Engine, Governance & Audit, Workbooks*. Each block shows a tiny mock UI screenshot-style card so the reader *sees* the product. Caption: *"Live with paying partners. The engine is not the bottleneck."*

**5. The gap to scale — Why the engine alone is not a SaaS**
Reuse the funnel (Complex deployment → Guided Kickstart → Live customers). Replace any leftover "demand outruns" framing with: *"Every customer today still needs us in the room. That is the only thing standing between us and self-serve growth."* Three failure modes: manual deployment, founder-time gated, linear not SaaS.

**6. The €200K unlock — From "us in the room" to "anyone can start"**
Keep the Before / After mock UI. Sharpen subtitle: *"€200K buys the wizard, the workspace flow, and the activation telemetry that lets a single team launch a playbook on day one and grow from there."* Add a small "smallest unit possible" diagram: 1 person → 1 playbook → 1 team → 1 org.

**7. What the money actually buys — Use of funds, with people on it**
Re-cut the stacked bar to be honest about salary: *Engineering salary + ship self-serve · Founder runway · Vertical packaging · Activation telemetry · Legal & infra*. Right column: *"6 months of runway. Founders stay full-time. Two engineers keep shipping. No marketing burn."* This is the slide the council says is currently missing.

**8. The 6-month plan — Week-by-week milestones**
Horizontal timeline. Month 1–2 harden core + wizard MVP · Month 3 first self-serve activation · Month 4 paid self-serve cohort · Month 5 activation funnel optimised · Month 6 metrics ready for Seed. Every milestone tied to a measurable signal (activation rate, time-to-first-playbook, paid conversions).

**9. Wedge industries — Where self-serve lands first**
Keep the current Wedge slide (council loves it). Tighten copy so it reads as the *deployment target* of slide 6, not a separate strategy.

**10. Path to markup — Bridge → Seed → A**
Keep the Roadmap slide. Add a small valuation arrow showing implied step-up so the angel sees the markup math without us spelling out a number.

**11. Team — Built by operators, shipping for 15 months self-funded**
Keep the 3 founders. Add a one-line under each that ties to the bridge: *"István: closes paid partnerships. Kristóf: ships the engine. Zoltán: codifies the standards customers pay for."* Caption: *"Same team that built the proof will ship the self-serve."*

**12. The Ask + close — €200K. SAFE. Closing in 6 weeks.**
Keep the SAFE slide (council loves it). Add a closing-line above the table: *"You are not betting on a thesis. You are funding the last engineering sprint between a working product and a self-serve SaaS."* End with a single CTA line: *"Wire to close: [date]. Two slots left at first-mover terms."* (the urgency hook).

## Visual + UX standards applied throughout

- One headline + one diagram + one supporting block per slide. No orphan text bricks.
- Replace every "AACE" with plain English. Keep the term out of investor copy.
- No em-dashes anywhere (memory rule). Voice stays punchy and statement-led.
- Light slides for proof and product, dark slides for the three "moment" slides (Cover, Moment, Ask) so the rhythm pulls the reader.
- Every slide ends with a one-line bridge into the next, written as a footer caption in subtle text.

## Implementation notes (technical)

- All work in `src/pages/BridgeDeck.tsx`. New slides `S00Moment`, `S07UseOfFunds` (rewritten), `S08Plan`, plus copy reworks across S02/S03/S04/S07/S10.
- New `SLIDES` order: Cover, Moment, Proof, Built, Gap, Unlock, Funds, Plan, Wedge, Roadmap, Team, Ask. Drops the standalone "Thesis" slide (its idea is absorbed into slides 2 and 5, where the council says it lands harder).
- Reuse existing `ScaledSlide`, `Tag`, `SlideBar`, `DARK_BG/BG` tokens. No new dependencies.
- Add a small "footer bridge caption" helper so every slide carries the next-slide handoff line consistently.

## What you get when this is built

A 12-slide deck that reads like a story: *here is the moment, here is the proof, here is what we built, here is the one thing missing, here is exactly what €200K buys and when, here is your markup, here is the team, here is how to wire.* An angel can scan it in 90 seconds and decide.