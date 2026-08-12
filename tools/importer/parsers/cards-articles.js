/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-articles
 * Base block: cards
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Cards is a 2-column block. Each subsequent row is a card:
 *   Cell 1: Image (mandatory)
 *   Cell 2: Text content — title, description, CTA (mandatory)
 *
 * Source: each card is an <a class="article-card card-link"> wrapping an
 * .article-card-image (image) and an .article-card-body (meta tags + heading).
 * The card itself is the link, so we preserve its href as the CTA.
 */
export default function parse(element, { document }) {
  // Each card is a direct <a> child of the grid.
  const cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  // Empty-block guard.
  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS (2 columns) ---
  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('.article-card-image img, img');
    const body = card.querySelector('.article-card-body');
    const href = card.getAttribute('href');

    // Content cell: body content (meta + heading) plus a CTA link preserving href.
    const contentCell = [];
    if (body) contentCell.push(body);
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      contentCell.push(cta);
    }

    // Keep rows 2-wide even if the image is missing.
    cells.push([img || '', contentCell.length ? contentCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
