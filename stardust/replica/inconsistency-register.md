# Inconsistency register — www.wknd-trendsetters.site replica

Everything not listed here is frozen; any other design delta found by the gate
is a defect, not an improvement.

## R-01 — Mobile nav row overflows the viewport at ≤479px

- **Evidence:** `measure.mjs https://www.wknd-trendsetters.site/ --width 360`: root scrollWidth 421 > viewport 360 (+61px). Nav row = logo 182 + gap 32 + Subscribe 119 + gap 32 + menu button 40 = 405px in a 328px container; the menu button renders at x=381, off-screen (the mobile menu is unreachable without horizontal scrolling). The replica gate's horizontal-overflow assert (≤ 4px) fails on a verbatim copy.
- **Change:** at `max-width: 479px` only: nav row gap 2rem → 0.5rem; header Subscribe button inline padding 1.5rem → 0.75rem (block padding unchanged, bar height stays 83px); menu button padding 0.5rem → 0.25rem. Row = 182 + 8 + 95 + 8 + 32 = 325px ≤ 328px. Nothing else changes; ≥480px is untouched.
- **Scope:** header (all pages), ≤479px.
- **Status:** adopted (hands-off: required to pass the overflow assert; the alternative is shipping an unreachable menu).
