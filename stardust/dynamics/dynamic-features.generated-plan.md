<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-21T14:02:38.549Z · input stardust/current/_dynamics.json (1 pages, 34 findings) · target probe main--bad0ba01--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-bmw-scene7-com | A | unknown third-party host bmw.scene7.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-www-bmw-com | A | unknown third-party host www.bmw.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-bmw-app-baqend-com | A | unknown third-party host bmw.app.baqend.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-stream-bmw-com-cn | A | unknown third-party host stream.bmw.com.cn | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-c-amazon-adsystem-com | A | unknown third-party host c.amazon-adsystem.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-cm-teads-tv | A | unknown third-party host cm.teads.tv | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-first-party-api-get-content-experience-fragments-bmw-marke | A | first-party API GET /content/experience-fragments/bmw/marketRO/bmw_ro/ro_RO/personalization/direct-entry/jcr:content.variation.targetPath++content++bmw++marketRO++bmw_ro++ro_RO++index++jcr:content++root++maincontent++contentblueprint_829++xftoggle.json/master | 1/1 (reach 1/1) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (Failed to parse URL from main--bad0ba01--aemcoder.aem.page/content/experience-fr)** |
| 9 | a-first-party-api-get-ro-ro-login-bmw-api-flyout-data | A | first-party API GET /ro-ro/login/bmw/api/flyout/data | 1/1 | data-fed | — | needs-backend | pending | decided-out | none (session-bound off-origin) | **dead on target (Failed to parse URL from main--bad0ba01--aemcoder.aem.page/ro-ro/login/bmw/api/f)** |
| 10 | a-first-party-api-post-events-hash | A | first-party API POST /events/{hash} | 1/1 | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (Failed to parse URL from main--bad0ba01--aemcoder.aem.page/events/1)** |
| 11 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 12 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 13 | cr-client-rendered-slot-js-focus-visible | CR | client-rendered slot js-focus-visible | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | i18n-locale-variants-ro-ro | I18N | locale variants ro-RO | 1/1 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 15 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-rum-akamai-mpulse | T | RUM: Akamai mPulse | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-unknown-third-party-host-tron-bmwgroup-com | T | unknown third-party host tron.bmwgroup.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-s-pinimg-com | T | unknown third-party host s.pinimg.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-feedback-survey-voc-badge | T | feedback: survey / VoC badge | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-p-teads-tv | T | unknown third-party host p.teads.tv | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-px-ads-linkedin-com | T | unknown third-party host px.ads.linkedin.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-track-adform-net | T | unknown third-party host track.adform.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-t-teads-tv | T | unknown third-party host t.teads.tv | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-aax-eu-amazon-adsystem-com | T | unknown third-party host aax-eu.amazon-adsystem.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-s2-adform-net | T | unknown third-party host s2.adform.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-unknown-third-party-host-adservice-google-com | T | unknown third-party host adservice.google.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | x-sign-in-account-links | X | sign-in / account links | 1/1 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 34 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 1/1 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 3 row(s) — read-settings, settled-dom-snapshot.
- **One owner decision batch:** 29 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · none (session-bound off-origin) · scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 3 of 3 probed API paths — the off-origin data work.

## Phases

- **tags** — 18
- **detect** — 9
- **register** — 3
- **off-origin data** — 2
- **capture** — 1
- **locale wave** — 1
