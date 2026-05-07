## Mobile Architecture Walkthrough

A Stories/Reels-style guided tour that replaces the dense `LizaOSStack` mobile fallback on the homepage. Users tap or swipe through 6 short "screens", each one animating in to show one piece of the Liza architecture. Designed for the 393px viewport.

### Where it lives
- New component: `src/components/marketing/home/ArchitectureWalkthrough.tsx`
- Rendered **only on mobile** (`md:hidden`) inside `ArchitectureTeaser.tsx`. The existing diagram stays for tablet and desktop (`hidden md:block`).
- No changes to platform page yet (can extend later).

### The 6 screens

```text
1. The problem        → "Your AI is ungoverned. Every tool invents its own answers."
2. The fix            → "One Decision Standard. Owned by leadership. Applied everywhere."
3. Systems of record  → animated cards (Drive, DBs, docs, email) flowing into a center
4. AI tools           → Copilot, Glean, ChatGPT cards reading from the standard
5. Where work happens → Liza Workspace screen-frame animates in, surrounded by the others
6. The loop           → Leadership pushes down, signal flows up. Final CTA.
```

Each screen:
- Full-width card, ~85vh tall, snap-aligned
- Big numbered kicker ("01 / 06") + 1 short headline + 1 sub-line
- One central animated visual (icons, arrows, framed window) using framer-motion
- Animation triggers on enter via `useInView` so re-swiping replays it

### Interaction
- Horizontal scroll-snap container (`overflow-x-auto snap-x snap-mandatory`). Native swipe, no JS gesture lib.
- Dots indicator + Prev/Next buttons at the bottom
- Final screen ends with a primary CTA: **Score your AI execution** → `/diagnostic`

### Visual system
- Reuse the existing tone tokens (primary amber/cyan glow for Liza-owned, muted for external)
- Same window-chrome motif used in the desktop diagram for consistency
- Subtle dot-grid background per screen
- Motion: stagger entrance (springs), small float loops on idle so the screen never feels static

### Out of scope
- Audio / actual video files (this is animated UI, not video)
- Editing the desktop diagram
- Platform page version (do later if user likes it)

### Files touched
- ADD: `src/components/marketing/home/ArchitectureWalkthrough.tsx`
- EDIT: `src/components/marketing/home/ArchitectureTeaser.tsx` (mount mobile-only)
