/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/cards-gallery): one row per gallery item, one cell containing the image
 * (an optional caption is kept if the source item carries text).
 * Selectors validated against migration-work/block-context/cards-gallery/source.html:
 *   :scope > div.utility-aspect-1x1 (x8), img.cover-image
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));
  if (!items.length) items = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;
    const cell = [img];
    const caption = item.querySelector('p, figcaption, h3, h4');
    if (caption && caption.textContent.trim()) cell.push(caption);
    cells.push([cell]);
  });

  // Fallback: bare images directly in the grid
  if (!cells.length) {
    element.querySelectorAll('img').forEach((img) => cells.push([img]));
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
