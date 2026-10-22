---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-21T14:04:38Z
  againstInput: https://www.bmw.ro/ro/index.html
  mode: bounded-single
  readArtifacts:
    - stardust/current/pages/ro-index-html.json
    - stardust/current/_computed-styles.json
    - stardust/current/DESIGN.json (extensions.breakpoints, cap-probe)
    - stardust/replica/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.bmw.ro/ro/index.html
(no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/ro-index-html.json + Phase-3 CSS lift
(stardust/replica/tokens.json, current/_computed-styles.json, cap-probe breakpoints)
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-21T14:04:38Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Gate breakpoints: run.json "desktop,mobile" → 1440, 360 (skill defaults). No target breakpoints — the source's own breakpoints are kept.

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link audit decision — scope extension repointed (2026-10-21)
Scope is exactly one page (/ro/index.html). The 59 other www.bmw.ro targets linked from the nav, footer and home page (model pages, financing, test-drive form, dealer locator, charging, …) are outside the declared single-page scope: SCOPE EXTENSION → kept as absolute links to the source site (no 404 on the new origin). The logo/home link points to /ro/; `/`, `/index.html` and `/ro/index.html` redirect to /ro/.
