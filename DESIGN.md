---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-16T09:47:12Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# Design — WKND Trendsetters (descriptive, preserved as-is)

Target spec for a same-design migration: every value below is lifted from the
source stylesheet (`stardust/current/css/site.css`) or the captured page; nothing is invented.

## Colors
White `#ffffff` canvas, black `#000000` text and primary buttons, light gray
`#f5f5f5` alternating sections, gray-200 `#e8e8e8` hairline borders, gray-500
`#666666` secondary text (`#999999` inside the black footer), gray-700 `#404040`
(FAQ answers, social icon chips). Accent yellow `#f4fe8b` on tags.

## Typography
- Headings: **Syncopate** 700, uppercase, line-height 1.1. h1 3.5rem (-0.02em),
  h2 2.5rem, h3 2rem, h4 1.5rem, h5 1.25rem, h6 0.875rem (+0.05em).
  Steps down at ≤991px (h1 2.5 / h2 2 / h3 1.5rem), ≤767px (2 / 1.75 / 1.375rem), ≤479px (1.75 / 1.5rem).
- Body: **Instrument Sans** 400–700, 1rem/1.6, antialiased. Subheading 1.125rem; paragraph-xl 1.25rem; paragraph-sm 0.875rem.
- Both faces are open (OFL) and self-hosted on the source; they are rehosted unchanged.

## Layout
Centered 1200px container, 1.5rem side padding (1rem ≤479px). Sections pad 8rem
block (5rem ≤991px, 4rem ≤767px). Two-column grids collapse to one column ≤991px
where marked `tablet-1-column`; 4-column grids go 2 ≤991px and 1 ≤767px.
Sticky white navbar with a 1px bottom border; hamburger overlay ≤991px.

## Components
- Button: pill (9999px), 2px black border, 0.75rem 1.5rem, 0.875rem/600, hard
  offset shadow `4px 4px 0 0 #000`; hover lifts -2px with a 6px shadow. Secondary = white fill;
  inverse = white on black with a translucent white shadow. Full-width stacked ≤767px.
- Cards: 1.25rem radius, 1px #e8e8e8 border; article cards 16:10 image, 1.5rem body, yellow tag + date meta.
- FAQ: native `<details>` rows, 1px border, 1rem radius, 1.5rem 2rem question padding, plus icon rotates 45° open.
- Testimonial tabs: 4 avatar tab buttons (1rem radius, active = black border + gray-100 fill) switching a 4:3 image + quote panel.
- Footer: black, 5rem block padding, logo + 5 round social chips, 3 link columns with h6 headings.
