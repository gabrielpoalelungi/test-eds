/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-offers (kfc.ro "Oferte #pebune" slider).
 * Source: swiper-container.featured-offers-swiper-container > swiper-slide > [a] > .offer-card
 *   .card-image img | .card-title, optional .availability-text
 * Block: one row per card -> [image] | [title link (h3 > a), optional badge paragraph]
 * Cards without their own link point to the offers listing (/ofertepebune/).
 */

const FALLBACK_HREF = '/ofertepebune/';

function absUrl(src) {
  if (!src) return '';
  try {
    return new URL(src, 'https://kfc.ro/').href;
  } catch (e) {
    return src;
  }
}

function makeImage(document, img) {
  if (!img) return null;
  const out = document.createElement('img');
  out.src = absUrl(img.getAttribute('src') || img.src);
  out.alt = img.getAttribute('alt') || '';
  return out;
}

export default function parse(element, { document }) {
  const slides = [...element.querySelectorAll('swiper-slide')];
  const cells = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('.offer-card') || slide;

    const imageCell = [];
    const img = makeImage(document, card.querySelector('.card-image-wrapper img, img.card-image'));
    if (img) imageCell.push(img);

    const contentCell = [];
    const titleEl = card.querySelector('.card-title');
    const title = titleEl ? titleEl.textContent.trim() : '';
    if (title) {
      const link = slide.querySelector('a[href]');
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = link ? link.getAttribute('href') : FALLBACK_HREF;
      a.textContent = title;
      h3.append(a);
      contentCell.push(h3);
    }

    const availability = card.querySelector('.availability-text');
    if (availability && availability.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = availability.textContent.trim();
      contentCell.push(p);
    }

    if (imageCell.length || contentCell.length) cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-offers', cells });
  element.replaceWith(block);
}
