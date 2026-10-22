/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product (kfc.ro product grid).
 * Source: div.products-container .product-card
 *   .label-new-product ("Nou"), .card-title, .card-description, a.black ("Vezi detalii"), img.card-image
 * Block: one row per product -> [image] | [badge p (optional), h3 title, description p, details link p]
 * The overlay links are empty and removed by the importer, so the product href is read
 * from any anchor inside the card.
 */

function absUrl(src) {
  if (!src) return '';
  try {
    return new URL(src, 'https://kfc.ro/').href;
  } catch (e) {
    return src;
  }
}

export default function parse(element, { document }) {
  const cards = [...element.querySelectorAll('.product-card')];
  const cells = [];

  cards.forEach((card) => {
    const wrapper = card.parentElement || card;

    const imageCell = [];
    const srcImg = card.querySelector('img.card-image');
    if (srcImg) {
      const img = document.createElement('img');
      img.src = absUrl(srcImg.getAttribute('src') || srcImg.src);
      img.alt = srcImg.getAttribute('alt') || '';
      imageCell.push(img);
    }

    const bodyCell = [];
    const badge = card.querySelector('.label-new-product');
    if (badge && badge.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = badge.textContent.trim();
      bodyCell.push(p);
    }

    const titleEl = card.querySelector('.card-title');
    if (titleEl && titleEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      bodyCell.push(h3);
    }

    const descEl = card.querySelector('.card-description');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      bodyCell.push(p);
    }

    const detailsLink = card.querySelector('a.black[href]')
      || card.querySelector('a[href]')
      || wrapper.querySelector('a[href]');
    if (detailsLink) {
      const labelEl = detailsLink.querySelector('.underline');
      const label = (labelEl ? labelEl.textContent : detailsLink.textContent).trim() || 'Vezi detalii';
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = detailsLink.getAttribute('href');
      a.textContent = label;
      p.append(a);
      bodyCell.push(p);
    }

    if (imageCell.length || bodyCell.length) cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
