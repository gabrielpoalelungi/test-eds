# Journal — BMW România (www.bmw.ro/ro/index.html) replica

## Extract — single-page bounded capture of ro/index.html (2026-10-21)

- `crawl.mjs --pages /ro/index.html --dynamics`, headless, 1/1 captured (HTTP 200, medium wait 2500 ms, renderedBy playwright). Slug `ro-index-html`.
- Dynamic reach: 1 same-site data endpoint, page hydrated, no search form.
- Vision check: ok — content clean; the cookie-consent overlay sits over the first viewport of the screenshot only (dismiss in gate captures).
- Capture gaps: none (bounded run; no sibling pages in scope).
- Bounded entry: no PRODUCT/DESIGN synthesis here — Phase 2 takes the bounded-single promotion branch.

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-10-21)

- Bounded promotion branch (no current/PRODUCT|DESIGN): synthesized root PRODUCT.md / DESIGN.md / DESIGN.json from the page JSON + the CSS lift (`stardust/replica/tokens.json`, `lift-notes.md`), provenance `bounded-single`.
- Lift: source breakpoints 768/1024/1280/1920; grid margin 84/16, full 96/24; body 15/24 / 14/22 w300 #262626; buttons 52px r3 primary #1c69d4; shell cap 1752 only ≥1920 (cap-probe). Header is absolute over the hero, not sticky. Footer #f6f6f6, accordion at 360. Fixed assist launcher bottom-right.
- Fonts: bmwTypeNextWeb is licensed — not rehosted; brand family first, source fallbacks (Arial/Helvetica/Roboto) render.
- Register: empty — pure replica. Gate widths 1440, 360 (run.json desktop,mobile).
- Dynamics: detect 34 findings → 13 curated rows, all dispositioned; hero HLS video, info-i tooltips and nav are rebuild-native; tags/CMP/personalization/account are one hands-off decision batch (interim shipped, nothing decided-out).
- Publish decision recorded in stardust/eds-conversion-log.md.

## Recreate + source-fidelity gate — ro-index-html gated at 1440 and 360 (2026-10-21)

- Prototype `stardust/prototypes/ro-index-html-proposed.html` + `canon.css` (tokens, type, buttons, header, footer, assist launcher) + `ro-index-html.css` + `ro-index-html.js` (hero play/pause, info-i tooltips, Online Store flyout, footer accordion at 360, timed assist nudge). Media harvested to `stardust/current/assets/media/`.
- gate.sh (3 iterations per width, final --full): 1440 pixel 9.10% Δh 0, 360 pixel 9.62% Δh 0; 0 structural red, 0 visual flags, clipped 0, overflow 0. cap-probe PASS (≥1920 cap 109.5rem replicated).
- Hot band = hero video only (live autoplay frame vs poster). Prototype table (gate-all --stage prototype) with the hero rows masked: 1440 3.02% PASS, 360 4.74% PASS; model-cards unit family within 4 px.
- Fonts: bmwTypeNextWeb not rehosted; metric-matched local fallback (size-adjust 101.5% / 106%). Icon font replaced by inline SVG.
- Motion observed live → implemented: hero play/pause, info-i tooltip, flyout, assist pulse + nudge; footer accordion at 360. Approved hands-off.

## Plan — migrate page map for the single approved archetype (2026-10-21)
One page in scope: ro-index-html (landing), status approved, branch A (archetype tier). Page map: /ro/index.html → stardust/migrated/ro/index.html, 0 collisions. Delivery note: the EDS root `/` serves this page (root index document); /ro/index.html redirects to `/` via the redirects sheet (D-site).

## Render — ro-index-html placed as archetype (branch A) (2026-10-21)
migrate.mjs render: `A ro-index-html → ro/index.html (landing; 26 assets, 165 links, 163 broken, 12 sections)`; rendered 1, refused 0. The 163 "broken" internal links point at bmw.ro pages outside the one-page roster (soft; E2 link audit repoints them). modules[] = hero, model-cards, teaser, wallbox. gate-evidence: 1440 3.02% / 360 4.74% (prototype table), content-diff 0 red, delivery-lint 0 P0 / 0 P1 / 1 P2; content-fidelity declared.

## Assets — 26 assets bundled, 0 missing, no rehost in migrate (2026-10-21)
stardust/migrated/assets/ holds 26 files (canon.css, page css/js, favicon, media renditions, logos, AI-label, social PNGs); missingAssets 0, selfContained true. Media is not rehosted here: editorial images go to DA media (da-media-upload.mjs) at deploy, chrome icons to the code bus /icons.

## State and report — 1/1 page migrated (2026-10-21)
state.mjs advance ro-index-html → migrated (stardust/migrated/ro/index.html). Tier archetype; gatesPassed per gate-evidence (pixel numbers are the prototype table; the published-origin row is earned in C-deliver).

## A-inventory — 1 page, 1 template, DA coordinates filled (2026-10-21)
inventory.mjs --state: 1 page (ro-index-html, template ro-index-html/landing), 1 pending. rollout.json site.da = aemcoder/bad0ba01@main, liveHost main--bad0ba01--aemcoder.aem.live. Note: coverage path reads /ro (derived from the URL-literal migrated path ro/index.html); the page is delivered as the DA root document `index` (served at `/`), with /ro/index.html → / in the redirects sheet — recorded in rollout.json site.deliveryPathNotes for the archetype unit.

## B-block — 4 distinct module blocks, each converted once (2026-10-21)
blocks.mjs: hero, model-cards, teaser, wallbox (4 module, 0 widget); chrome (header/footer → /nav, /footer) is C0 foundation scope. plan.mjs: ro-index-html is the representative and converts all four.

## B2-dynamic — inventory verified against fresh evidence, no new rows (2026-10-21)
dynamics-detect (fresh, 13 s) 34 findings vs 34 at capture; the one new id (Teads cookie-match host) folds into row 9 (tags). dynamics-plan target probe: first-party APIs host-bound 3/3 (rows 6–8, interim/owner decisions). 13 rows dispositioned; rows 1–3 (hero video, WLTP info-i, header nav) are rebuild-native in C (header nav = C0 foundation).

## C-deliver — unit C0 foundation done: chrome live, foundation frozen (2026-10-21)
Authored styles/styles.css (canon tokens, base type, overlay chrome `--nav-height: 0`, flex-column page shell, buttons, info-i, assist launcher), styles/fonts.css (licensed bmwTypeNextWeb never rehosted; "bmwTypeNext Fallback" local faces), scripts/icons.js (inline SVG for the licensed icon font), blocks/header + blocks/footer, /icons (logos, Alpina, AI label), favicon (WebP capture re-encoded to PNG + ICO), content/nav.html + content/footer.html (Robots noindex). Social PNGs → DA media/chrome. nav/footer PUT → preview → live (deploy-batch, 2/2 live). Header contract recorded from the origin (chrome-explore 1440+360, --root .cmp-globalnavigation, 80 states/depth 3 — the default budget hit the 900 s deadline). Five build rounds took chrome-compare from 68 to 32 errors with every behavioural finding closed; the 32 left are panel crops (font residual at 1440, consent-drawer-covered source crops at 360), the nameless Alpina drill control and a logo-hover state that is the assist nudge timer. Footer crop 1440 2.19 % / 360 3.07 % — at or under the gated prototype's own band (2.21 % / 3.45 %), glyph-only. Header band and pixel rows need the archetype page (shell = boilerplate home). foundation-freeze: 13 files.

## C-deliver — unit archetype-landing done: /ro/ live and gated on preview (2026-10-21)
Blocks hero (autoplay muted HLS hero video, progressive fallback, poster beneath), model-cards, teaser, wallbox authored from the gated prototype; content/ro/index.html PUT → preview → live (deploy-batch, 1/1). gate-all on the preview host: 1440 1.66 % / Δh 0, 360 4.86 % / Δh −1, clip 0, content 0 missing/hidden, PASS both (hero video masked as in the prototype table; 360 origin = archetype live.png, fresh capture consent-polluted). 2 of 3 fix rounds. Footer band 2.15 %/2.96 % (foundation font residual). No foundation requests; freeze unchanged.

## C-deliver — complete: cluster (no siblings), gate-all 1/1 PASS, final (2026-10-21)
Cluster unit `landing` had no siblings (single-page scope). gate-all --skip-existing on the published roster: 1440 1.66 % PASS; 360 first read failed units only because unit-geometry's origin cache held the 1440 inventory — re-run with the 360 origin units cache in place → 4.86 % PASS (cache restored). update-coverage --gate written for both widths (page verified). C-final: freeze check unchanged, foundation-requests queue empty.

## D-site — root redirects to /ro/, served sitemap 1 = assembled 1 (2026-10-21)
Source root 302s to /ro/index.html, so the redirects sheet (/redirects.json, published) carries `/`, `/index.html` and `/ro/index.html` → `/ro/`; the boilerplate shell `index` used for the C0 gate was unpublished (preview + live) so it neither shadows the redirect nor enters the sitemap. nav/footer carry robots noindex. assemble.mjs --verify-origin exit 0; `/` → /ro/ 200 on aem.page and aem.live.

## D2-dynamic — 5 parity checks PASS on the live host (2026-10-21)
stardust/dynamics/parity.json: hero video plays (native video, currentTime advancing), info-i tooltips (5), header navigation, tags consent-gate (no tag-manager/pixel host requested — tags/CMP await the owner's decision, row 9/10 interim), no page errors. No query index or search on the single page; first-party APIs (rows 6–8, 13) stay interim/static as triaged. dynamics-check exit 0 (stardust/qa/dynamics-report.md).

## E-full-site — 1/1 verified on aem.live (2026-10-21)
verify.mjs --base aem.live --all: /ro/ 200, 0 about:error, internal hrefs resolve, gate pass true at 1440 and 360. Render check incl. restoreAtDelivery: hero video playing on the live host (dynamics-check video-plays, Δt 0.80 s).

## E2-link-audit — 0 localizable links left; 59 out-of-scope targets repointed to source (2026-10-21)
localize-links normalized the nav logo href `/` → `/ro/` (nav re-PUT → preview → live); --check PASS. Every other www.bmw.ro target is outside the single-page scope and stays absolute to the source (decision recorded in direction.md). No internal href 404s on the live tree.

## F-optimize — health 90, 0 open P1, 1 open P2 (JSON-LD) (2026-10-21)
optimize.mjs on aem.live: 1 page + site checks; open P1 0 · P2 1 (ai-search/jsonld: no JSON-LD on /ro/ — the source carries it) · P3 0; gate passes. Scorecard written.

## G-aem — JSON-LD restored; optimize 100/100, 0 open findings (2026-10-21)
autofix-aem flagged eds-jsonld as manual. The source's WebPage/VideoObject/Corporation graph was authored verbatim as a `JSON-LD` metadata row on ro/index (re-PUT → preview → live); the pipeline renders it as ld+json in <head> (a client-side injector was tried and reverted as redundant; foundation unchanged). Re-run optimize: health 100, P1 0 · P2 0 · P3 0 (1 P2 fixed). verify 1/1.

## H-report — 1/1 delivered, gate PASS both widths, quality 100 (2026-10-21)
Summary in stardust/rollout/report.md; learnings in stardust/learnings.md. Header parity re-explored on the live /ro/ (build root `body>header>div>div:nth-of-type(2)`): same 32 undecided findings as at C0 (0 behavioural) — needs site-owner decisions or the licensed font to close.

## I-dashboard — dashboard written (2026-10-21)
dashboard.mjs → stardust/rollout/dashboard/{index.html,data.json}: 1 page identified · prototyped · deployed · optimised.

## Handoff — complete: /ro/ live on aem.live, root redirects to it, done-check complete (2026-10-21)
migrate → deploy → rollout A–I finished for the single page. Runner done-check: complete, 0 gaps. Open for the owner (not blocking): header-parity 32 visual/state findings (licensed font, consent-covered source crops, nameless Alpina control, logo-hover nudge), tags/CMP/personalization/account decisions (dynamic rows 6–10, 13).
