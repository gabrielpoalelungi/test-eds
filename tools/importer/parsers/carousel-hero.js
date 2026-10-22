/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero (kfc.ro home hero slider).
 * Source: div.hero > swiper-container > swiper-slide
 *   .hero-image img | .hero-content h1.headline, .body p, a (CTA), .hero-disclaimer p
 * Block: one row per slide -> [image] | [heading, paragraph(s), CTA link, disclaimer paragraph(s)]
 * Slide 1 keeps H1, subsequent slides use H2.
 */

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

  slides.forEach((slide, idx) => {
    const imageCell = [];
    const img = makeImage(document, slide.querySelector('.hero-image img'));
    if (img) imageCell.push(img);

    const contentCell = [];
    const headline = slide.querySelector('.headline, h1, h2');
    if (headline && headline.textContent.trim()) {
      const h = document.createElement(idx === 0 ? 'h1' : 'h2');
      h.textContent = headline.textContent.trim();
      contentCell.push(h);
    }

    slide.querySelectorAll('.hero-content .body p').forEach((p) => {
      if (!p.textContent.trim()) return;
      const para = document.createElement('p');
      para.innerHTML = p.innerHTML.trim();
      contentCell.push(para);
    });

    const cta = slide.querySelector('.hero-content a[href]');
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

    slide.querySelectorAll('.hero-disclaimer p').forEach((p) => {
      if (!p.textContent.trim()) return;
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      contentCell.push(para);
    });

    if (imageCell.length || contentCell.length) cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
