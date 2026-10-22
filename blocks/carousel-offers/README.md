# carousel-offers

Custom **carousel** block. Purpose: horizontal slider of offer cards, several visible at once, with prev/next arrows.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per card; cell 1 = image only; cell 2 = title link (heading or paragraph) and an optional plain paragraph rendered as a badge (e.g. availability note).

## Rendering notes

- A card with a badge paragraph gets a black content area plus the red "selected locations" icon (`selected-locations.svg`, shipped with the block) above it; the badge text shows on hover.
- A card whose title starts with "Vezi toate" (or whose image alt is `see-more`) renders as the outlined "see all offers" card (white border, transparent content area).
- Other cards: white content area, red title, red-outlined arrow pill.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
