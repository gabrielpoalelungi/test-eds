<!-- stardust provenance: skill=stardust:dynamics · phase=triage (curated) · 2026-10-16 · input stardust/dynamics/dynamic-features.generated-plan.md + stardust/current/pages/index.html (inline scripts) · target https://main--c579f7f0--aemcoder.aem.page -->
# Dynamic features — www.wknd-trendsetters.site (curated)

Scope: one page (`/`). Static migration continues regardless of any row.

## Listings contract

None. "Latest articles" is four authored cards (static in the source HTML, no fetch); delivered as authored rows.

## Features

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | t-unknown-third-party-host-static-cloudflareinsights-com | T | Cloudflare Web Analytics beacon (static.cloudflareinsights.com, injected by the source CDN) | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which analytics run on the new host; beacon token | interim tier: not shipped (scaffolded off); no page content depends on it |
| 2 | x-nav-mobile-toggle | X | Mobile navigation toggle (#nav-toggle → .nav-menu.is-open, aria-expanded) ≤991px | 1/1 | rebuild | self | planned | header-contract | — | inline module script on source; rebuilt in header block |
| 3 | x-nav-mega-menu | X | "Trends" mega menu + "Support" dropdown (CSS :hover / :focus-within) | 1/1 | rebuild | self | planned | header-contract | — | pure CSS on source |
| 4 | x-testimonial-tabs | X | Testimonial tabs (4 role=tab buttons switch 4 tabpanels; arrow/Home/End keys) | 1/1 | rebuild | self | planned | tabs | — | inline module script on source |
| 5 | x-faq-details | X | FAQ accordion (native `<details>`, icon rotates 45° when open) | 1/1 | rebuild | self | planned | accordion | — | no JS on source |

## Decision batch (owner, one batch)

1. Analytics on the new host (row 1): keep Cloudflare Web Analytics (needs the beacon token on the new CDN) or use the platform's built-in RUM only. Interim: not shipped.

## Register

No dynamic feature changes the design; inconsistency register stays empty.

## Verification — rollout B2 (2026-10-16)

Fresh evidence: `dynamics-detect.mjs --urls https://www.wknd-trendsetters.site/ --from-state stardust/state.json --reach stardust/current` → 1 finding (row 1, same id as the curated row); its only first-party request is the beacon's own `POST /cdn-cgi/rum` (204), part of row 1 — no new row. `dynamics-plan.mjs --target-origin https://main--c579f7f0--aemcoder.aem.page --migrated stardust/migrated` → 1 row, host-bound 0/0, delivered 0, owner batch 1. Migrated page carries rows 2–5 (menu toggle button with aria-expanded/aria-controls, Trends + Support menus, 4 tabs / 4 tabpanels, 4 `<details>`), beacon not shipped. Every row has a disposition; no listings contract. Gate: PASS — C-deliver may import.
