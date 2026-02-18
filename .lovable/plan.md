
## Brand Alignment: Look & Feel

The brand document is clear and beautiful. The core of LIZA's visual identity is:

- Pure black backgrounds with radial blue/emerald atmospheric glows
- The LIZA wordmark: geometric, tracked, with a cyan-to-emerald gradient on the "A"
- Section headers in bright cyan uppercase ("OUR STORY", "OUR PURPOSE") — small, tracked, authoritative
- Large, bold white or cyan body statements — not small grey helper text
- Brand essence: "Your Organisational Intelligence. The infrastructure shaping the future of organisations."
- Values: Resilient, Courageous, Integrative, Intentional

The current app has the colour system right but is missing the brand's *voice* and *visual weight* — particularly on the home screen.

---

### What Needs to Change (and Why)

**1. The Operator Home — copy & visual hierarchy**

The current greeting block says "Mission Briefing" in a tiny eyebrow and then a generic personalised greeting. The brand doc's voice is declarative and purposeful — it doesn't say "Good morning, Alex" like a weather app. The eyebrow label should use the brand's own section heading style (small cyan uppercase, like "OUR PURPOSE" in the doc).

The subtitle currently reads: *"Here's where you stand. Pick up where you left off, or set your horizon for today."* — functional, but not brand-aligned. The brand doc says: "We are here to turn intentions into outcomes." That is the energy this page should carry.

We will also add a status line beneath the greeting to reinforce the "operating system" feel — a small `● SYSTEMS ACTIVE` or `● N protocols in motion` indicator, in brand green, that gives the user an immediate sense of state.

**2. The `WhereYouLeftOff` card — the "active lock state"**

The brand values "intentional" work — every action is a deliberate choice. A protocol execution is a locked-in commitment. The card currently looks like a plain info panel. We will:
- Add a left-border accent (`border-l-2` with brand cyan glow) to signal an "active engagement"
- Add a `PROTOCOL ACTIVE` badge (brand cyan, small) to make it clear this is a running system, not just a reminder
- Change the eyebrow from "Resume where you left off" to `ACTIVE PROTOCOL` — matching the infrastructure vocabulary
- Keep the "Resume" button but upgrade it to feel like re-engaging a system

**3. The Operator Home — collapsible section labels**

The brand document uses bright cyan uppercase section headers throughout. The current "Leadership Mandates" and "Priority Feed" collapsible triggers are plain. We will upgrade them to match the brand's authoritative label style, and rename "Priority Feed" to "NERVE CENTRE" — which is what the component underneath is actually called (`NerveCenterFeed`).

**4. The Leader / Architect Home — the three zone cards**

Currently all three QuickCards look identical. The brand doc establishes three distinct zones of organisational intelligence. We will visually differentiate them:
- **Execute / Launchpad**: Primary brand cyan border + glow — kinetic, execution-focused
- **Design / Process Studio**: Emerald/green border + glow — structural, generative
- **Oversee / Command Centre**: Amber/warning border + glow — elevated, authoritative

The Leader home subtitle will be updated to carry a line directly from the brand doc's essence: *"The infrastructure shaping the future of your organisation."*

**5. The Sidebar — OS identity and logo**

The LIZA wordmark in the brand doc is geometric and tracked. The current sidebar has "LIZA" bold + "OS" small. We will add a version tag line beneath the wordmark — `Your Organisational Intelligence` in very small tracked muted text — echoing the brand essence statement. This makes the sidebar feel like a product chrome, not just a nav.

---

### Files to Edit

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Operator: eyebrow label, subtitle copy, status indicator, section labels. Leader: card differentiation, subtitle copy. |
| `src/components/oversight/WhereYouLeftOff.tsx` | Add `PROTOCOL ACTIVE` badge, left border glow, updated eyebrow. |
| `src/components/AppSidebar.tsx` | Add "Your Organisational Intelligence" tagline beneath wordmark. |

No new components, no database changes, no dependencies. Pure copy and CSS.

---

### Copy Changes Summary

| Location | Current | New |
|---|---|---|
| Operator eyebrow | "Mission Briefing" | "OPERATIONAL BRIEFING" |
| Operator subtitle | "Here's where you stand…" | "Turning intentions into outcomes. Your execution infrastructure is live." |
| Resume card eyebrow | "Resume where you left off" | "ACTIVE PROTOCOL" |
| Resume card badge | (none) | `PROTOCOL ACTIVE` badge in cyan |
| Mandates trigger | "Leadership Mandates" | "DIRECTIVE STREAM" |
| Feed trigger | "Priority Feed" | "NERVE CENTRE" |
| Leader eyebrow | "Your Organisational Intelligence" | kept — it IS from the brand doc |
| Leader subtitle | "Your team's best thinking, made executable…" | "The infrastructure shaping the future of your organisation." |
| Sidebar beneath wordmark | (none) | "Your Organisational Intelligence" in tiny muted tracked text |
