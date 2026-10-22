# Learnings — BMW România replica (single page, 2026-10-21)

- **gate-all unit-geometry origin cache is width-agnostic.** `current/measure/<slug>-units.json` held the 1440 inventory, so the 360 roster row failed `units off 6` while pixel/clip/content passed. Re-running with the `.360` cache in place gave PASS. Width-keyed caches would remove the swap.
- **Consent drawer pollutes fresh 360 origin stitches.** The ePaaS drawer appeared in every chunk on two tries (6124 px vs 5449 clean); the gated archetype's clean live.png served as origin, as in the prototype stage.
- **Runner done-check probes the coverage `path` verbatim with redirect:manual.** A folder index recorded as `/ro` reads not-live (404) though `/ro/` is 200; record folder indexes with the trailing slash.
- **Boilerplate shell `index` published for the C0 chrome gate** enters the served sitemap and must be unpublished once the source root is a redirect (sheet rows `/`, `/index.html` → landing).
- **EDS renders a `JSON-LD` metadata row natively** into `<head>`; no client injector needed to restore source structured data.
- **chrome-explore needs the build `--root`** recorded in the previous build record; the default root found 0 controls on the EDS header.
