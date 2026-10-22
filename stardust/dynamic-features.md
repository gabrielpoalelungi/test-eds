<!-- stardust provenance: skill=stardust:dynamics (via stardust:replica Phase 2) · curated from stardust/dynamics/dynamic-features.generated-plan.md (34 findings, 1 page) · 2026-10-21 · hands-off -->
# Dynamic features — BMW România (www.bmw.ro/ro/index.html)

## Listings contract
none — the single in-scope page carries no listing blocks.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | v-hero-video | hero stage video (scene7 HLS `bmw-ix4-home-teaser-AVS.m3u8`, autoplay, play/pause button, poster image) | V | 1/1 | rebuild-native | block (hero stage, authored poster + video URL) | self | pending | timer-driven media | — | `_dynamics.json` media[video blob]; captured DOM `.cmp-stage .cmp-video` |
| 2 | m-infoi-tooltips | WLTP info-i tooltips on the energy disclaimers (button opens the WLTP explainer text) | M | 1/1 | rebuild-native | runtime (block JS) | self | pending | modal-loader | — | captured DOM `.cmp-infoi` ×4 |
| 3 | r-chrome-nav | header navigation flyouts (Modele, Electric, Inspirație, …), mobile menu | R | 1/1 | rebuild-native | runtime (header block) | self | pending | chrome | — | header contract (Phase 3) |
| 4 | cr-settled-dom | client-rendered slots (focus-visible polyfill, personalization XF) | CR | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | reason: settled DOM is the content; unfreeze if personalization is re-wired | `_dynamics.json` clientRendered |
| 5 | a-settings | CMS/app settings objects (adobeDataLayer, CQ) | A | 1/1 | static-snapshot | content | self | pending | read-settings | reason: no consumer on the migrated page | `_dynamics.json` globals |
| 6 | a-personalization-xf | first-party API GET /content/experience-fragments/…/personalization/direct-entry (host-bound on target) | A | 1/1 | static-snapshot | content | needs-business-decision | interim | off-origin-data | personalization on the new host? — interim: default variant as captured | dead on target probe |
| 7 | a-flyout-login | first-party API GET /ro-ro/login/bmw/api/flyout/data (session-bound, host-bound) | A/X | 1/1 | static-snapshot | content | needs-backend | interim | off-origin-data | account flyout backend — interim: sign-in links point to source host | dead on target probe |
| 8 | a-events | first-party POST /events/{hash} (telemetry, host-bound) | A | 1/1 | static-snapshot | — | needs-business-decision | interim | off-origin-data | telemetry on the new host? — interim: not wired | dead on target probe |
| 9 | t-tags | tag managers, analytics, RUM and marketing pixels (Adobe Launch, GTM, Adobe Analytics/ECID, Akamai mPulse, Google Ads/GA, Facebook, LinkedIn, Pinterest, Teads, Adform, Amazon, Criteo, VoC survey, tron.bmwgroup.com) | T | 1/1 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | which tags run on the new host + property ids (martech not requested — scaffolded off) | rows 15–32 of the draft |
| 10 | t-consent | ePaaS consent manager (cookie drawer) | T | 1/1 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | CMP on the new host — goes with the tags decision | `epaas-consent-drawer-shell` |
| 11 | a-media-hosts | asset hosts bmw.scene7.com / www.bmw.com / bmw.app.baqend.com / stream.bmw.com.cn | A | 1/1 | static-snapshot | content | self | pending | inspect → media | reason: image/video renditions, rehosted or referenced as content media | draft rows 1–4 |
| 12 | i18n-ro | locale ro-RO (single locale in scope) | I18N | 1/1 | static-snapshot | content | self | pending | locale-tree | reason: single locale migrated; locale tree scope revisit at rollout | draft row 14 |
| 13 | x-account-commerce | sign-in / account links, commerce signals | X | 1/1 | static-snapshot | content | needs-backend | interim | — | auth/commerce on new host — interim: links kept to source | draft rows 33–34 |

## Decision batch
One message to the owner (hands-off: recorded as named assumptions, interim tier shipped):
- **Tags & consent (rows 9–10):** which tags and which CMP run on the new host, with property ids. Assumption: none wired; scaffolded off.
- **Personalization, telemetry, account flyout (rows 6–8, 13):** whether the new host serves personalization fragments, events and the login flyout. Assumption: default captured variant; account/sign-in links go to the source host.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement yet; hands-off assumptions never decide out | — |

Rollout B2 verification (2026-10-21): fresh dynamics-detect (34 findings, 200 /ro/index.html) + dynamics-plan --target-origin main--bad0ba01--aemcoder.aem.page --migrated stardust/migrated (evidence in stardust/.work/dynamics/fresh/). One finding id not in the capture run — `t-unknown-third-party-host-cm-teads-tv` (Teads cookie-match host) — is covered by row 9 (Teads already listed); first-party APIs host-bound 3/3 = rows 6–8. No new rows; every row keeps its disposition.
