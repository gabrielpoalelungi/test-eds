---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-21T14:13:28Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/ro-index-html.json
    - stardust/replica/tokens.json
colors:
  text: "#262626"
  background: "#ffffff"
  primary: "#1c69d4"
  primary-hover: "#0653b6"
  outline-light: "#f2f2f2"
  border: "#e6e6e6"
  surface-light: "#f6f6f6"
  stage: "#000000"
typography:
  family: '"bmwTypeNextWeb", Arial, Helvetica, Roboto, sans-serif'
  body: 15/24 w300 (14/22 at 360)
  headline-2: 35/50 w300 (28/40 at 360)
  stage-title: 48/50 w500 (35/37 at 360)
rounded:
  button: 3px
spacing:
  grid-margin: 84px (16px at 360)
  grid-full: 96px (24px at 360)
  section-gap: 40px / 48px (32px / 40px at 360)
---

# Design — BMW România home page (descriptive, bounded-single)

Captured current state of https://www.bmw.ro/ro/index.html; the target IS this state (preserve mode). Values trace to
`stardust/replica/tokens.json` (per-value source citations) and the section map in `stardust/replica/lift-notes.md`.

## Visual character
Black, full-bleed cinematic media (video hero, 3:1 car teasers) with white type overlaid on left-to-transparent gradients;
a white canvas between them with dark-grey (#262626) light-weight (300) BMW Type Next text; one blue (#1c69d4) primary CTA
per module beside a thin outline button; a light-grey (#f6f6f6) footer.

## Layout
Shell margin 84px at 1440 (16px at 360), content inset 96px (24px); full-bleed modules break out by the same amount.
Source breakpoints 768 / 1024 / 1280 / 1920; at 360 every module stacks and centers, media go 1:1 or 3:4 with text on black below.

## Components
- Header: transparent over the hero with a top gradient, white BMW logo, five nav items, four icon buttons; hamburger at 360. Not sticky.
- Buttons: 52px, radius 3px, w500; primary blue, outline-light (inset 1px #f2f2f2), outline-dark, text link with chevron.
- Disclaimers: 12/18 at 70% opacity with an info-i tooltip trigger.
- Footer: three columns of two link lists each, social row, legal bar; accordion at 360.
- Assist launcher: fixed round 52px white button bottom-right.

## Fonts
bmwTypeNextWeb is a licensed corporate face — not rehosted on the new domain. The brand family stays first in the stack; the
source's own fallbacks (Arial, Helvetica, Roboto) render until a licensed drop-in is supplied.
