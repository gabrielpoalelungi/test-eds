/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-campaigns (kfc.ro campaigns slider).
 * Source: swiper-container.campaigns-swiper > swiper-slide > .campaign-card
 *   h2.card-headline, img.card-image, p.card-body, .card-button a
 * Block: one row per slide -> [image] | [h2 heading, paragraph, CTA link]
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
  const slides = [...element.querySelectorAll('swiper-slide')];
  const cells = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('.campaign-card') || slide;

    const imageCell = [];
    const srcImg = card.querySelector('img.card-image');
    if (srcImg) {
      const img = document.createElement('img');
      img.src = absUrl(srcImg.getAttribute('src') || srcImg.src);
      img.alt = srcImg.getAttribute('alt') || '';
      imageCell.push(img);
    }

    const contentCell = [];
    const headline = card.querySelector('.card-headline, h2, h3');
    if (headline && headline.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = headline.textContent.trim();
      contentCell.push(h2);
    }

    const body = card.querySelector('.card-body');
    if (body && body.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = body.innerHTML.trim();
      contentCell.push(p);
    }

    const cta = card.querySelector('.card-button a[href]') || card.querySelector('a[href]');
    if (cta) {
      const label = (cta.querySelector('.text') || cta).textContent.trim();
      if (label) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = cta.getAttribute('href');
        a.textContent = label;
        p.append(a);
        contentCell.push(p);
      }
    }

    if (imageCell.length || contentCell.length) cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-campaigns', cells });
  element.replaceWith(block);
}
