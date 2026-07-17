/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-banner
 * Base block: hero
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Hero is a 1-column block with up to 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image (optional)
 *   Row 3: title (heading), subheading, call-to-action (optional)
 *
 * Source: an inverse banner with a single background .cover-image, an
 * overlaid .card-body containing the heading, subheading and a CTA button.
 */
export default function parse(element, { document }) {
  // Background image (the overlaid cover image).
  const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img');

  // Content lives inside the overlaid card body.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS (1 column) ---
  const cells = [];

  // Row 2: background image — optional.
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: title, subheading, CTA — all in a single content cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
