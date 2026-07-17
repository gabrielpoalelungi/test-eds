/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-feature
 * Base block: hero
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Hero is a 1-column block with up to 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image(s) (optional)
 *   Row 3: title (heading), subheading, call-to-action links (optional)
 */
export default function parse(element, { document }) {
  // --- INPUT EXTRACTION (validated against source.html) ---
  // Images live in the second grid column as .cover-image (multiple images possible).
  const images = Array.from(element.querySelectorAll('img.cover-image, img[class*="cover"]'));

  // Content: heading, subheading and CTA buttons.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard: bail gracefully if nothing meaningful was found.
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS (1 column) ---
  const cells = [];

  // Row 2: background/hero image(s) — optional.
  if (images.length > 0) {
    cells.push([images]);
  }

  // Row 3: title, subheading, CTAs — all in the single content cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
