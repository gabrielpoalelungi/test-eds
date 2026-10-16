# EDS conversion log — www.wknd-trendsetters.site replica

Publish decision: publish (owner decision recorded by the run brief, 2026-10-16) — every delivered page, the redirects sheet and the chrome documents go live on aem.live.

## C0 foundation (2026-10-16)

- Runtime contract: `stardust/runtime-contract.json` (vanilla-eds; buttons = `a.button.primary|secondary` in `p.button-wrapper`, formatted-only).
- Fonts: Instrument Sans (variable 400–700) + Syncopate 400/700, SIL OFL 1.1, self-hosted in `fonts/`, declared in `styles/fonts.css`; metric-matched Arial fallbacks (`instrument-sans-fallback`, `syncopate-fallback`) in `styles/styles.css`. Boilerplate Roboto removed. No licensing alert (OFL).
- Favicon: `favicon.svg` (captured source icon) + one `head.html` link.
- Chrome reservation: `body > header` sticky, `--nav-height: 83.4px` (measured bar height, all widths); scoped to `body > header` so block-internal `<header>` elements are not clamped.
- Register R-01 (≤479px nav-row compaction) implemented in `blocks/header/header.css`.

## Decode tiers

| Section | Block | Tier | Notes |
|---|---|---|---|
| Header (/nav) | `header` | Template-slotted | 3 sections: brand link (`:logo:` icon + text), nav list (nested lists → mega menu columns + promo item, or dropdown), tools (`**Subscribe**` CTA). Mega link = `[icon] link <br> description`. |
| Footer (/footer) | `footer` | Template-slotted | Section 1 = brand link + social list (icon + label, label visually hidden); each further section = `h2` + link list column. |
| Hero (index s1) | `hero` | Template-slotted | One row, two cells: h1 + lede `<p>` + `**primary**` / `*secondary*` CTA paragraphs; collage = 3 images. Section style `muted`. Prototype `<header>` host → section `div` (blocks emit no `<header>`). |
| Featured story (s2) | `featured` | Template-slotted | Image cell; text cell = breadcrumb link `<p>` (Home, Case studies — chevron is a CSS mask on `a + a::before`), h2, byline paragraphs (`By **Taylor Brooks**`, date line). |
| Gallery (s3) | `gallery` | Reconstructive | Head row h2 + lede; every image → one square tile. Style `muted`. |
| Testimonials (s4) | `testimonials` | Reconstructive | One row per person: photo · (who `<p>` with `<strong>` name + role, quote `<p>`) · avatar. Tab labels are stripped presentational clones of the who `<p>` (EW4). Tabs: click + Arrow/Home/End (dynamics x-testimonial-tabs). |
| Latest articles (s5) | `articles` | Reconstructive | Head row h2 + lede; one row per card: image · (tag `<p>`, date `<p>`, h3 with link). Card-as-link, inner anchor unwrapped (EW6). Style `muted`. |
| FAQ (s6) | `faq` | Reconstructive | Head row h2 + lede; one row per Q (cell 1) / A (cell 2). Native `<details>` kept per dynamics row x-faq-details; the authored question `<p>` is moved into `<summary>` (EW7 deviation, accepted to keep the native accordion; text stays editable — EW gate 10/10). |
| Closing banner (s7) | `banner` | Template-slotted | Image (absolute background, gradient overlay) + h2 + lede + `**See more**`. Style `inverse` (foundation paints the on-dark button). |

### C-archetype landing / index (2026-10-16)

- Media: 19 captured AVIF re-encoded to WebP in headless Chromium (DA media accepts jpg/png/webp), uploaded to `media/index/` via `da-media-upload.mjs` (19/19).
- Local asserts: `block-roundtrip.mjs --ew` whole page — 0 structural 🔴, EW editable 45/45; `davids-model-lint` PASS (3 🟡: gallery/articles/faq head rows are 1-cell beside 2-cell item rows — intended); `localize-links --check` PASS; `npm run lint` clean.
- Deploy: PUT 201 → preview 200 → live 200; `/` on aem.page and aem.live serves the index (title + description from the capture).
- Gate pub1 (preview origin, `--main main`, symmetric: live `<main id="main-content">`, EDS `<main>`; marker "Fresh looks, bold stories" — "Fashion Blog" is JS-rendered chrome, absent from server HTML, so the identity assert cannot see it): 1440 0.01 % Δh 0; 360 1.23 % Δh 0; overflow ok; clip 4 (the 4 closed FAQ answers, origin also 4).
- Structural 🔴 10 per width, none block-owned: 4 × ICON DIFF on the tab avatars = the pipeline's `media_<hash>` rename of authored images (filename-only compare; same image, pixel band 0.01 %); 6 × [footer] → foundation-requests line.
- cap-probe @2560: content cap 1200 = 1200; module 1 row ✗ is a probe miss — the live hero is a `<header>` element the probe does not resolve (px null); measured directly the live hero `div.container` is 1200 px at x=680, same as the build.
