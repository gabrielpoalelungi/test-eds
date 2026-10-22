# Lift notes — https://www.bmw.ro/ro/index.html (replica, widths 1440 / 360)

Source: live computed styles (measure.mjs, consent accepted) + stardust/current/assets/css/{1,3,6}-bmw.min.css.
Structured values with per-value citations are in `tokens.json`. rem = 16px.

## Breakpoints
- 768 / 1024 / 1280 / 1920 (min-width). Bands: small <768, medium 768–1023, large 1024–1279, xlarge 1280–1919.
- 1440 → xlarge (uses >=1280 tokens). 360 → small (base tokens).
- Watch out: the grid sheet's xlarge suffix is `x-large`. The markup uses `--xlarge--`, which matches no rule, so at 1440 the `--default--` column widths apply.

## Globals
- Font `"bmwTypeNextWeb","Arial","Helvetica","Roboto",sans-serif`, swap; weights 300/400/500/700.
  Files: https://www.bmw.ro/etc.clientlibs/bmw-web/clientlibs/clientlib-site/resources/fonts/BMWTypeNext-{Light,Regular,Medium,Bold}.woff2 (+ unicode-range subsets; latinextended covers ș/ț). Licensed, so not downloaded.
- :root: 16px, w300, line-height 26px; `text-rendering:optimizeSpeed; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale`. Computed font-synthesis = UA default; font-kerning auto.
- body = body-2: **15/24 @1440, 14/22 @360**; color #262626; no background (white canvas). Universal border-box.
- Type (360 → 1440): headline-2 28/40 → 35/50 · subsection-1 19/28 → 23/36 · body-1 16/26 → 18/28 · body-3 12/18 · stage-zone-1-large 35/37 → 48/50 · stage-sub-headline 17/19 → 20/24 (uppercase, w500).
- Colors: text #262626, CTA #1c69d4 (hover #0653b6), outline-light #f2f2f2, border #e6e6e6, light surface #f6f6f6, hero/teaser black #000.

## Container / grid
- `--grid-gutter / --grid-margin / --grid-full`: small .5/1/1.5rem (8/16/24) · medium .75/2.25/3rem · xlarge .75/5.25/6rem (12/84/96).
- The page shell (`.style-container--fixed`) has margin = --grid-margin. **main: x84 w1272 @1440; x16 w328 @360.** At ≥1920 it is margin auto with max-width 109.5rem (1752px).
- `.aem-GridColumn` padding: 0 8px (<768), 0 12px (>=768). Responsivegrid columns have 0 padding. Content starts at x96 @1440 and x24 @360 (inner width 1248 / 312).
- Full-bleed components (stage, backgroundmedia) use margin `0 calc(var(--grid-full)*-1)`, which is -96px / -24px.
- Spacing utilities `.style-common--cmp-spacing-{top,bottom}-N` (px at <1280 / 1280–1919 / ≥1920): 3: 8/8/12 · 4: 8/12/16 · 5: 12/16/20 · 8: 20/24/32 · 10: 24/32/40 · 12: **32/40/48** · 16: **40/48/64** · 20: 48/64/80.

## Header (`.cmp-globalnavigation--transparent-white`)
- position:absolute over the hero, z-index 6050. **Not sticky, and no scroll state.** The CSS has no sticky/fixed classes, so the bar scrolls away.
- :before gradient `linear-gradient(0deg,#0000,color-mix(in srgb,#000 40%,#0000))`. Height 180px ≥1280, 128px for 768–1279, 96px below 768.
- 1440: total 85px (container 84 + a 1px white line at x96 w1248). Padding 0 96px. Logo: white SVG, 52×52 at (96,16), margin-right 24. Nav starts at x172: Modele (flyout), Online Store, Electromobilitate, Servicii și asistență, Despre BMW. Each is 15/24 w500 #fff, padding 0 12px, 84px tall. Right side: 4 icon buttons 48×84 from x1152, each with a 20px glyph (font 24px).
- 360: 68px tall, padding 0 24px, logo 36×36 at (24,16). Right side: 3 icon buttons 48×68 + hamburger 52×68 (x140→336). The primary nav becomes an off-canvas white panel: top 69, padding 0 24, items 17/26 w300 #666, padding 24px 0.

## Main — section order and root selectors
`main.cmp-container > .aem-Grid` columns. The section vertical rhythm is the margins below.

1. **Hero stage**: `.stage .cmp-stage.style-overlay--in-fixed-parent`. Section y0, height 666 @1440 / 968 @360.
   - 1440: stage 1440×630 (video aspect 16/7), black bg. The overlay is absolute from top 400, padding 0 0 48 96, left-aligned flex column. Title "NOUL BMW iX4" 48/50 w500 #fff. Sub-headline 20/24 w500 uppercase. Button group padding-top 24, gap 24: primary 184×52 and outline-light 189×52. Below it: disclaimer (spacing-top-4 = 12) 12/18.
   - 360: stage 360×900. The video frame is 408×544 (3:4) at x-24, with a bottom gradient `360deg, #000 10% → transparent 60%`. The overlay is absolute from top 608, height 292, **black bg**, padding 20 24 40, centered. Title 35/37. Sub 17/19. Buttons are stacked (175×52, then 180×52, gap 24). Disclaimer at y908.
2. **Model choice**: `.container.style-common--cmp-spacing-top-12.…-bottom-12 .xftoggle`. Margins 40/40 @1440, 32/32 @360.
   - Headline "Alege modelul BMW preferat." is headline-2, centered, #262626, 8/12 wide with offset 2 (x296 w848), margin-bottom 40 (32 on mobile).
   - 3 cards × 424px (4/12), centered: icon-font glyph 64px (@≥1280 via inline `--icon-size:4rem`; 48px on mobile), then title subsection-1 (margin-top 24 / 20), then outline-dark button (margin-top 24 / 20). Button sizes: 184×52 for "Configurator şi preţ", 104×52 for "Căutare".
   - 360: cards stacked (174/198 tall). Buttons 203×52 (8/12 col, offset 2).
3–5. **Stage teasers ×3**: `.container.style-common--cmp-spacing-top-12 .backgroundmedia.style-backgroundmedia--fullwidth .cmp-backgroundmedia--v2`. margin-top 40 / 32.
   - 1440: image 3:1 at 1440×~479, margin 0 -96. The overlay is absolute inset 0, padding 0 96. Content block is bottom-anchored at x96, width 520 (iX5, i3) or 1040 (iX3), margin-bottom 48.
     - Headline 35/50 w300 #fff. Body-1 18/28 (margin-top 16). Buttons: primary + outline-light, 184×52 each, 24 apart.
     - Gradient: iX5/i3 `90deg, #000 10%, .8 20%, .6 30%, .4 40%, .2 50%, 0 60%`. iX3 `110deg, rgba(38,38,38,.8) → 0 50%`.
     - Disclaimer under the media: margin-top 16.
   - 360: image 1:1 at 360×360, no gradient on the image. The overlay is position:relative with margin-top -172, padding 48 24 0, gradient `transparent → #000 at 128px`, then solid black. Content is 260 wide, centered (10/12, offset 1), margin-bottom 40. Headline 28/40, body 16/26. Buttons are stacked full width 244×52, 16 apart.
   - i3 price tag (`.style-container--price-tag`): "455€*" 35/50 w700 (28/40 @360) + "+ TVA" 18/28 (16/26) with an info-i. Flex row @1440, column @360.
   - iX3 "WINNER" badge: there is no DOM element for it. It is most likely baked into the image (not verified).
6. **Wallbox**: `.container.style-common--cmp-spacing-top-16 .cmp-container--layout-flex.cmp-container--flex-row`. margin-top 48 / 40.
   - 1440: flex row, align-items center. Image column 742 (7/12), with the image 718×323 at x96. Text column x826 w530 with padding-left 40. Headline-2 #262626, body 15/24 (margin-top 12), text link "Detalii" + chevron (66×24).
   - 360: stacked. Image 312×140, then text: headline 28/40, body 14/22, link 63×22.
7. **"Conținut generat de AI" strip**: the first row of `<footer>` (not in main), `.style-container--border-bottom`.
   - 1440: 1272×84, margin 12 0 20, AI-label image (scene7 skin) in a 106px slot, text 15/24, bottom border 1px #e6e6e6 full-bleed.
   - 360: 328×116, text 14/22.

Disclaimers (`.style-text--disclaimer-1>.cmp-text`): 12/18 w300 #262626 at opacity .7051. They are followed inline by `.cmp-infoi__icon--small`, a 24×24 button holding a 16px `information` glyph.

## Buttons (all from 6-bmw.min.css)
- Base: inline-flex, centered, min-height 52px (`--button-large-height` 3.25rem), padding 4px, radius 3px, border 0. The border is drawn as an inset box-shadow (`--border-width`/`--border-color`). Font 15/24 w500 @1440, 14/22 @360.
- `--flex` (≥768): width auto, padding-inline 24px, max-width calc(25vw - 4.125rem) at 1280–1919. `--grid`: min-width 100% of its column.
- Primary: bg #1c69d4, text #fff. Hover/focus: bg #0653b6, no shadow.
- Outline-light: transparent, text #f2f2f2, inset 1px #f2f2f2. Hover: text #fff, inset 2px #fff.
- Outline-dark: transparent, text #262626, inset 1px #262626. Hover: inset 2px.
- Text link (`--as-link`): padding 0, 15/24 w500 #262626. Hover #1c69d4, active #0653b6. Chevron `arrow_chevron_right` sits in a 20px box after the text (glyph 1.25rem w400).

## Footer (`footer.container.style-container--disable-hscroll`)
- Background **#f6f6f6** full-bleed. It is painted by the `:before` of `.style-container--background-light__without-spacing-top>.cmp-container` (ctx-mode--light). Content margin 0 84 / 0 16.
- 1440 (y3201, height 1103): 3 float columns of 424px (padding 0 12), each holding 2 lists:
  - col 1: Contact şi informaţii / Despre BMW
  - col 2: Asistenţă şi service / Alege și comandă
  - col 3: Modele / Automobile electrice BMW
  - The second list in each column comes after a spacing-top-16 (48) spacer.
  - Headings 23/36 w300, margin-bottom 32. Lists: margin 15 0 32. Links 15/24 w300 #262626, 36px pitch.
  - Social row (x84 h76): right-aligned, 4 PNG icons about 30px tall.
  - Legal bar (h91): flex-wrap, left-aligned, border-top 1px #e6e6e6 full-bleed. Items 15/24 margin 0 32 12 0. The first item is the span "Copyright © BMW AG 2026".
- 360 (height 1084): **accordion**. 6 stacked titles (`.cmp-list__title--collapsable-mobile`, 19/28 w300 computed, padding-bottom 24, margin-bottom 24, chevron `arrow_chevron_down` 24px via ::after). Lists are collapsed (padding 8 0 0 16 when open). Social row centered (h74). Legal items centered, one per line (h346).

## Sticky sidebar (`.cmp-stickysidebar`)
- The BMW assist launcher. Its markup sits before `<main>`. It is visible on load and stays fixed.
- z 6040, flex column-reverse, pointer-events none on the box. right 56px (3.5rem) @1440 / 16px @360; bottom 20vh (≥768) / 15vh (<768) / 24vh (≥1920). max-width calc(100% - 2rem). The box is ~319×237, mostly the hidden nudge card.
- Visible part: round 52px white button with shadow `0 6px 20px rgba(0,0,0,.16), 0 0 1px rgba(0,0,0,.24)` and a `speech_bubbles` glyph. At 1440 the button sits at (1332,668).
- The nudge ("Bună, cu ce te putem ajuta?") and the dropdown (Live Chat…) are hidden until interaction or timer. The captured footer has an inline margin-bottom:365px set by script.

## Icons
- Ligature icon font `bmw_next_icons`: `<i data-icon="name">` with `:before{content:attr(data-icon);font-feature-settings:"liga"}`.
  Files: …/clientlib-site/resources/icons/bmw_next_icons_{light,regular}.woff2.
- Names on this page: information, close, arrow_chevron_right, arrow_chevron_down, car_front_double, pre_owned_car_search, add_car, speech_bubbles, speech_bubble_with_person, plus the header glyphs.
- Raster/SVG icons:
  - BMW logo SVG (`/content/dam/bmw/common/images/logo-icons/BMW/BMW_White_Logo.svg.asset.1670245093434.svg`)
  - social PNGs (`/content/dam/bmw/common/footer/social/{facebook,instagram,youtube,linkedin}-default@2x.png.asset.*.png`)
  - AI label (`https://bmw.scene7.com/skins/BMW/AI-label`)

## Image renditions actually used
| image | 1440 | 360 |
|---|---|---|
| hero | HLS `scene7 …/bmw-ix4-home-teaser-AVS.m3u8`, poster `bmw-ix4-home-teaser-fb?qlt=80&wid=1024&fmt=webp` (1024×448, hidden while playing) | same |
| iX5 | `g65_bev_promotional-teaser:3to1?fmt=webp-alpha&wid=1919` → 1440×479 | `…:1to1 …wid=767` → 360×360 |
| i3 | `bmw-i3-home-promotional-teaser-1:3to1 … wid=1919` | `…:1to1 … wid=767` |
| iX3 | `DI26_000417112_BMW-iX3-NA5-BEV_V1:3to1 … wid=1919` | `DI26_000417112_1_V1_O_sRGB_BMW-iX3-NA5-mob_V1:1to1 … wid=767` |
| wallbox | `/ro/index/_jcr_content/…/image.coreimg.jpeg/1750062632035/bmw-emobility-support-wallbox-gen4-sp-desktop.jpeg` (1680×756, no srcset) → 718×323 | same file → 312×140 |

Picture media bands: ≤767 1to1 w767 · 767–1023 3to2 w1023 · 1023–1279 3to1 w1279 · 1279–1919 3to1 w1919 · fallback img 3to1 w2560.

## Mobile restacking rules (360)
- Header: nav collapses to the hamburger; 3 icons remain.
- Hero: the overlay moves below the video into a black panel; centered text; buttons stack.
- Model cards: stack 1 column, centered; icon 48px.
- Stage teasers: image goes 1:1, and the text sits under the image on black (gradient fade from -172px); centered; buttons full-width and stacked.
- Wallbox: image on top, text below, left-aligned.
- Footer: link columns become accordions; social and legal are centered; legal wraps one per line.
- Sidebar button stays bottom-right (right 16px, bottom 15vh).
