# Learnings — www.wknd-trendsetters.site replica rollout (2026-10-16)

Entry shape: `../../stardust/reference/learnings.md` (plugin). Harvested by plugin maintainers.

### Out-of-scope internal links shipped root-relative and failed verify
- failure class: path-safety (scope extension discovered late)
- evidence: one-page scope; migrate kept 21 root-relative hrefs to 11 uncaptured source pages (sidecar `migrationDecisions: broken-links-out-of-scope`); C-deliver published them; `verify.mjs --all` failed `/` in Phase E; E2 repointed them to the source host + redirect rows
- proposed change: `skills/migrate/SKILL.md` (pagemap audit) or `skills/replica/reference/handoff-contract.md` § 2 — when a link target is outside the declared caps, repoint it to the source host at migrate/deploy time (and emit a `stardust/redirects.tsv` row) instead of recording it as a broken-links decision
- status: pending

### Coverage block rows left `pending` after a complete delivery
- failure class: bookkeeping-drift
- evidence: `coverage/blocks.json` 9/9 `pending` at H-report although every block was live and the page verified; `rollout.json.lastRun.blocks.converted` 0 until `update-coverage.mjs --block <id> --status verified` was run by hand in H
- proposed change: `skills/rollout/SKILL.md` § Phase C (unit end) — flip each unit's blocks with `update-coverage.mjs --block` when the unit is `done`; or `verify.mjs` flips the blocks of a verified page
- status: pending

### First-viewport hero images lazy-loaded
- failure class: perf (LCP candidate lazy)
- evidence: hero collage imgs kept the pipeline's `loading=lazy` in the first viewport (1440: 3, 360: 2; LCP at 360 = a hero img); baseline `optimize.mjs` has no detector, found by a headless probe in F; fixed in `blocks/hero/hero.js`
- proposed change: `skills/rollout/reference/checks.md` — add a `lazy-in-first-viewport` baseline check (P2, platform-migration); `skills/deploy/SKILL.md` § 8 — first-section media blocks set `loading=eager`
- status: pending
