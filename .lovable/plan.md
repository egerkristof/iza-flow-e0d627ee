

## Expand Use Cases Page to 7 Detailed Use Cases + Flywheel

### Overview
Replace the current 3 use cases with 7 detailed ones, keeping all existing structural elements. The "Bigger Picture" section stays as-is (4-step knowledge spiral). A new "Seven Compounding Results" flywheel section is added after it, showing the concrete use-case chain.

### The 7 Use Cases (each with same card structure: icon, tag, headline, subheading, competitor box, body, carries-forward callout, stats sidebar)

1. **The Onboarding Accelerator** -- Broadened from sales-only to all roles. "Onboard anyone in weeks, not months."
2. **Sales Playbooks** -- "Your best seller's instincts, running on every deal."
3. **Account Management Playbooks** -- "Protect revenue before the data tells you it's at risk."
4. **Marketing Playbooks** -- "Stop guessing which message lands. Encode what works."
5. **Professional Services Delivery Playbooks** -- "Deliver every engagement like your best consultant ran it."
6. **The Meeting Intelligence Engine** -- Cross-meeting drift detection, follow-up tracking, team oversight. "Every meeting builds your organisation's memory."
7. **The Smart Brief** -- Existing, renumbered. "Don't delegate tasks. Generate briefs."

### Flow Connectors Between Each Pair
1. "Onboarding surfaces expertise -> Playbooks encode it"
2. "Sales patterns reveal market value -> AM protects and expands it"
3. "Account signals shape positioning -> Marketing encodes what works"
4. "Marketing insights feed delivery -> Services runs on encoded methodology"
5. "Delivery generates new knowledge -> Meetings capture and connect it"
6. "Meeting intelligence surfaces decisions -> Smart Briefs delegate them"

### Page Structure (top to bottom)
1. **Hero** -- Updated subtitle: "Start with one. Within months, you're running all seven, because each one compounds the last."
2. **Divider** -- "Deployed - Being productised"
3. **7 Use Case Cards** with flow connectors between them
4. **The Bigger Picture** -- Stays exactly as-is (4-step knowledge spiral grid: Tacit to Explicit, Explicit to Infrastructure, Infrastructure to Execution, Execution to New Knowledge)
5. **NEW: The Seven-Step Flywheel** -- A new section after The Bigger Picture showing the 7 use cases as a connected chain/loop, visualising how each feeds the next and the last feeds back into the first. Compact numbered cards in a visual flow with arrows, reinforcing the compounding message.
6. **CTA buttons** -- Book a Discovery Call + See the Platform

### New Flywheel Section Design
- Section heading: "Seven compounding results"
- Subheading: "Each use case feeds the next. Start anywhere. The system compounds."
- 7 compact cards in a flowing layout (could be a horizontal scroll on mobile, grid on desktop), each with: number, short title, one-line description, arrow to next
- The 7th card connects back to the 1st (circular), reinforcing the flywheel concept
- Uses each use case's unique HSL colour for visual consistency

### Technical Details

**File modified**: `src/pages/marketing/UseCases.tsx` only

- Replace `USE_CASES` array with 7 entries, each containing: icon, tag, col (unique HSL), headline, subheading, competitors, competitorNote, body (array of paragraphs), carries (string or null for last), stats (array of 3)
- Add Lucide icon imports: `Users`, `ShieldCheck`, `Megaphone`, `Briefcase`, `Radio`
- Update flow connector logic from index-based ternary to array lookup
- Update hero text from "all four" to "all seven"
- Keep "The Bigger Picture" section unchanged
- Add new flywheel section between "The Bigger Picture" and the CTA buttons
- Update flywheel heading from "Four compounding results" to "Seven compounding results"
- No em dashes anywhere (commas or periods only)

### Colour assignments (HSL)
1. Onboarding: `200 90% 52%` (blue)
2. Sales: `38 92% 50%` (amber)
3. Account Management: `155 72% 46%` (green)
4. Marketing: `330 70% 55%` (pink)
5. Professional Services: `270 60% 65%` (purple)
6. Meeting Intelligence: `180 65% 45%` (teal)
7. Smart Brief: `15 80% 55%` (orange-red)

