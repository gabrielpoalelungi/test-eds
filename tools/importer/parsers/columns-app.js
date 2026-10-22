/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-app (kfc.ro KFC App promo).
 * Source: section.app-section > div.container
 *   img.app-logo, .left-content (.headline, .description[img.description-icon + p], .cta-button a),
 *   .right-content img.image (animated GIF)
 * Block: one row, two cells ->
 *   [logo p, h2 headline, paragraph, icon+text feature paragraphs, CTA link] | [image]
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
  const textCell = [];

  const logo = makeImage(document, element.querySelector('img.app-logo'));
  if (logo) {
    logo.alt = 'KFC App';
    const p = document.createElement('p');
    p.append(logo);
    textCell.push(p);
  }

  const left = element.querySelector('.left-content') || element;

  const headline = left.querySelector('.headline');
  if (headline && headline.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = headline.textContent.replace(/\s+/g, ' ').trim();
    textCell.push(h2);
  }

  left.querySelectorAll('.description').forEach((desc) => {
    const icon = desc.querySelector('img.description-icon');
    const paragraphs = [...desc.querySelectorAll('.description-text p')]
      .filter((p) => p.textContent.trim());
    paragraphs.forEach((src, i) => {
      const p = document.createElement('p');
      if (icon && i === 0) {
        const img = makeImage(document, icon);
        img.alt = '';
        p.append(img, ' ');
      }
      const span = document.createElement('span');
      span.innerHTML = src.innerHTML.trim();
      p.append(...span.childNodes);
      textCell.push(p);
    });
  });

  const cta = left.querySelector('.cta-button a[href]');
  if (cta) {
    const label = (cta.querySelector('.text') || cta).textContent.trim();
    if (label) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = label;
      p.append(a);
      textCell.push(p);
    }
  }

  const mediaCell = [];
  const media = makeImage(document, element.querySelector('.right-content img'));
  if (media) {
    if (!media.alt || media.alt === 'image') media.alt = 'KFC App';
    mediaCell.push(media);
  }

  const cells = [[textCell, mediaCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}
