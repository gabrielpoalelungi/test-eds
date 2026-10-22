# cards-category

Custom **cards** block. Purpose: horizontally scrolling category navigation (icon + label links).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per category; cell 1 = icon image only; cell 2 = label linked to the category page; optional cell 3 = badge text (e.g. "Nou"). Categories linking to `/…/noutati` get a "Nou" badge automatically when no badge cell is authored.

## Behavior

- Full-width bar, sticky under the header (`--nav-height`); shrinks to a compact state (48px icons, 12px labels) while pinned.
- The item whose link matches the current page is active (`aria-current="page"`); if none matches, the first item is shown active, as on the source.
- Prev/next arrows appear only when the list overflows and scroll one category per click.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
