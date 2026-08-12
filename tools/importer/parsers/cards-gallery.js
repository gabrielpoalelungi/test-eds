/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-gallery
 * Base block: cards
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Cards block. Each subsequent row is one card.
 * This gallery variant is image-only: every card contains just an image
 * (no title/description/CTA), so each row has a single image cell.
 */
export default function parse(element, { document }) {
  // Each direct child div of the grid is a card wrapping a single image.
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS ---
  // One row per card. Image-only cards → single cell holding the image.
  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('img');
    if (img) {
      cells.push([img]);
    }
  });

  // If no images were found, bail gracefully.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
