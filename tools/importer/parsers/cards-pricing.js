/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-pricing. Base block: cards (no images) variant.
 * Source: https://www.hellointerview.com/
 * Generated: 2026-07-20
 *
 * Structure (from library-description.txt, "Cards (no images)"):
 * 1 column, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - One row per pricing tier: single text cell with tier title + price +
 *    feature list + purchase CTA.
 *
 * Source specifics (validated against source.html):
 *  - Pricing tiers live in a grid ([class*="grid-cols-3"]); each direct child
 *    is one tier card. The highlighted middle card carries a "Most Popular"
 *    chip (.MuiChip-label).
 *  - Title: <h5 class="MuiTypography-h5">.
 *  - Price: current <h2 class="MuiTypography-h2"> + original <h6> (crossed out).
 *  - Feature list: <p class="MuiTypography-body2 mui-1dcyak8"> items (contain
 *    inline links which are preserved).
 *  - Purchase CTA: <a class="MuiButton-root" href*="checkout">.
 *  - The section <h3> heading is default content handled outside this block.
 */
export default function parse(element, { document }) {
  // Locate the pricing grid and treat each direct child as a tier card.
  const grid = element.querySelector('[class*="grid-cols-3"]');
  let tierCards = [];
  if (grid) {
    tierCards = Array.from(grid.children);
  }
  // Fallback: derive tiers from their h5 titles if the grid wasn't found.
  if (!tierCards.length) {
    tierCards = Array.from(element.querySelectorAll('h5.MuiTypography-h5, h5[class*="h5"]'))
      .map((h) => h.closest('div'))
      .filter(Boolean);
  }

  const cells = [];

  tierCards.forEach((card) => {
    const contentCell = [];

    // "Most Popular" (or similar) badge.
    const chip = card.querySelector('.MuiChip-label');
    if (chip && (chip.textContent || '').trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = (chip.textContent || '').trim();
      p.appendChild(em);
      contentCell.push(p);
    }

    // Tier title.
    const title = card.querySelector('h5.MuiTypography-h5, h5[class*="h5"], h5');
    if (title) {
      const h = document.createElement('h3');
      h.textContent = (title.textContent || '').trim();
      contentCell.push(h);
    }

    // Price (current + original).
    const price = card.querySelector('h2.MuiTypography-h2, h2[class*="h2"], h2');
    const originalPrice = card.querySelector('h6.MuiTypography-h6, h6[class*="h6"], h6');
    if (price) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = (price.textContent || '').trim();
      p.appendChild(strong);
      if (originalPrice && (originalPrice.textContent || '').trim()) {
        p.appendChild(document.createTextNode(' '));
        const del = document.createElement('del');
        del.textContent = (originalPrice.textContent || '').trim();
        p.appendChild(del);
      }
      contentCell.push(p);
    }

    // Feature list — preserve inline links by cloning the paragraphs.
    const features = Array.from(card.querySelectorAll('p.mui-1dcyak8, p.mui-eqdl97'));
    if (features.length) {
      const ul = document.createElement('ul');
      features.forEach((f) => {
        const li = document.createElement('li');
        // Move the paragraph's children into the list item to keep links.
        Array.from(f.childNodes).forEach((n) => li.appendChild(n.cloneNode(true)));
        ul.appendChild(li);
      });
      if (ul.children.length) contentCell.push(ul);
    }

    // Purchase CTA (the primary checkout button).
    const cta = card.querySelector('a[href*="checkout"], a.MuiButton-root');
    if (cta) contentCell.push(cta);

    if (contentCell.length) cells.push([contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
