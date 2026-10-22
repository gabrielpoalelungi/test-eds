/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category (kfc.ro product category navigation).
 * Source: nav.product-categories swiper-slide > button.product-category
 *   img.product-category-image + .product-category-title (buttons, no links)
 * Block: one row per category -> [icon image] | [label linked to /meniu/<slug>]
 * Slug = Romanian label without diacritics, lower-cased, non-alphanumerics -> "-".
 */

function absUrl(src) {
  if (!src) return '';
  try {
    return new URL(src, 'https://kfc.ro/').href;
  } catch (e) {
    return src;
  }
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function parse(element, { document }) {
  const items = [...element.querySelectorAll('.product-category')];
  const cells = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('.product-category-title');
    const label = titleEl ? titleEl.textContent.trim() : '';
    if (!label) return;

    const imageCell = [];
    const srcImg = item.querySelector('img.product-category-image') || item.querySelector('img');
    if (srcImg) {
      const img = document.createElement('img');
      img.src = absUrl(srcImg.getAttribute('src') || srcImg.src);
      img.alt = srcImg.getAttribute('alt') || label;
      imageCell.push(img);
    }

    const a = document.createElement('a');
    a.href = `/meniu/${slugify(label)}`;
    a.textContent = label;

    cells.push([imageCell, [a]]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
