/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-testimonial. Base block: cards (no images) variant.
 * Source: https://www.hellointerview.com/
 * Generated: 2026-07-20
 *
 * Structure (from library-description.txt, "Cards (no images)"):
 * 1 column, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - One row per card: single text cell with Heading/eyebrow + Description
 *    (quote) + company + Call-to-Action.
 *
 * Source specifics (validated against source.html):
 *  - Each testimonial card is a .MuiCard-root inside a .masonry-item.
 *  - Eyebrow label: first <span class="MuiTypography-caption"> in the card
 *    (e.g. "Passed OpenAI Senior Interview").
 *  - Quote: <p class="MuiTypography-body1 mui-dw53iu">.
 *  - Company name: <p class="MuiTypography-body1 mui-gnehma">.
 *  - "Read more" CTA: <span class="MuiTypography-caption mui-1ey2dni"> (no href).
 *  - The section <h3> and top "Read more success stories" link are default
 *    content handled outside this block.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.masonry-item .MuiCard-root, .MuiCard-root'));

  const cells = [];

  cards.forEach((card) => {
    const contentCell = [];

    // Eyebrow label (first caption in the card).
    const eyebrow = card.querySelector('.MuiTypography-caption');
    const eyebrowText = eyebrow ? (eyebrow.textContent || '').trim() : '';

    // Quote body.
    const quote = card.querySelector('p.mui-dw53iu, p[class*="body1"]');

    // Company name (a body1 paragraph distinct from the quote).
    const bodyParas = Array.from(card.querySelectorAll('p[class*="body1"]'));
    const company = bodyParas.find((p) => p !== quote);

    // "Read more" CTA (a later caption, distinct from the eyebrow).
    const captions = Array.from(card.querySelectorAll('.MuiTypography-caption'));
    const readMore = captions.find((c) => c !== eyebrow);

    if (eyebrowText) {
      const h = document.createElement('h3');
      h.textContent = eyebrowText;
      contentCell.push(h);
    }
    if (quote) {
      const p = document.createElement('p');
      p.textContent = (quote.textContent || '').trim();
      contentCell.push(p);
    }
    if (company) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = (company.textContent || '').trim();
      p.appendChild(strong);
      contentCell.push(p);
    }
    if (readMore) {
      const text = (readMore.textContent || '').trim();
      if (text) {
        const p = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = text;
        p.appendChild(em);
        contentCell.push(p);
      }
    }

    if (contentCell.length) cells.push([contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
