

## LinkedIn Data Card — Self-Contained Visual

The card must work as a standalone artifact. Someone scrolling LinkedIn sees the image and the first line of text. They should immediately understand: "Teams are failing at AI not because of tools, but because they have no standards."

### Card Layout (1200×627px, dark background)

**Top third — The Hook (largest text)**
"AI Doesn't Hallucinate. It Has No Truth."

**Middle — The Evidence**
Five horizontal bars showing the five dimensions, each labeled with name and score. The bars use the brand cyan gradient, visually showing how short they fall against 100. A large "39/100" callout sits to the left or overlaid, making the overall failure unmissable.

Key detail: the dimension names themselves tell the story. "Standard Internalization: 35.6" instantly communicates what's broken without explanation.

**Bottom strip — The CTA + Authority**
Left: "Based on 60 team assessments" (establishes credibility)
Right: "Get your score → lizaos.ai/diagnostic" (action)
Corner: LIZA OS wordmark, small

### Why this works at a glance
- The headline is a provocation that reframes the AI debate
- The bars are visually "short" against a 100-scale, communicating failure without reading numbers
- The CTA gives a next step
- No paragraph text needed. Every element is a label or a number.

### Implementation
1. Create `src/pages/LinkedInImageCard.tsx` — standalone page at `/linkedin-card`, renders a fixed 1200×627 div with dark bg, brand fonts, gradient bars, and the layout above
2. Add route in `App.tsx` (public, no auth)
3. All styling via Tailwind — dark card, cyan gradient bars, white/gray typography hierarchy

User visits `/linkedin-card`, screenshots at 2x for retina clarity, posts to LinkedIn.

