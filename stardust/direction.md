---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-16T09:47:12Z
  againstInput: https://www.wknd-trendsetters.site/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.wknd-trendsetters.site/
(no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-16T09:47:12Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Decision — out-of-scope link targets: SCOPE EXTENSION, repointed (E2-link-audit, 2026-10-16)

Declared cap: one page (`/`, `stardust/.labs/site-plan.json`); no capture gap. 21 internal hrefs
(11 distinct targets) point outside the cap → repointed to the source site, regardless of count,
and mirrored as redirect rows (`stardust/redirects.tsv` → `/redirects.json`, live) so inbound
requests to those paths on the new host bounce to the source instead of 404:
`/blog`, `/blog/fashion-blog-post`, `/blog/fashion-trends-young-culture`,
`/blog/fashion-trends-young-style`, `/blog/latest-trends-young-casual-fashion`, `/case-studies`,
`/faq`, `/fashion-insights`, `/fashion-trends-of-the-season`, `/fashion-trends-young-adults`,
`/fashion-trends-young-adults-casual-sport` (index 7 hrefs, nav 14). When a later wave delivers
one of these pages: drop its redirect row, re-run `localize-links.mjs` to restore the root-relative
href. `href="#"` placeholders (Subscribe, See more, 20 footer links) are source parity, kept.
