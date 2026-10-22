/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-heritage (kfc.ro heritage band).
 * Source: .heritage-inner > img.image-left, .heritage-content (.title, p.body, .button a),
 *   img.image-right, img.signature
 * Block: one row, three cells -> [image] | [h2 title, paragraph, CTA link] | [image, signature image]
 */

function absUrl(src) {
  if (!src) return '';
  try {
    return new URL(src, 'https://kfc.ro/').href;
  } catch (e) {
    return src;
  }
}

function makeImage(document, img, alt) {
  if (!img) return null;
  const out = document.createElement('img');
  out.src = absUrl(img.getAttribute('src') || img.src);
  out.alt = alt || img.getAttribute('alt') || '';
  return out;
}

export default function parse(element, { document }) {
  const leftCell = [];
  const left = makeImage(document, element.querySelector('img.image-left'), 'KFC heritage');
  if (left) leftCell.push(left);

  const contentCell = [];
  const content = element.querySelector('.heritage-content') || element;
  const title = content.querySelector('.title');
  if (title && title.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    contentCell.push(h2);
  }
  content.querySelectorAll('p.body, .body p').forEach((src) => {
    if (!src.textContent.trim()) return;
    const p = document.createElement('p');
    p.innerHTML = src.innerHTML.trim();
    contentCell.push(p);
  });
  const cta = content.querySelector('.button a[href]') || content.querySelector('a[href]');
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

  const rightCell = [];
  const right = makeImage(document, element.querySelector('img.image-right'), 'Colonel Sanders');
  // each image in its own paragraph so the block can tag the second one as the signature
  [right, makeImage(document, element.querySelector('img.signature'), 'Semnătura Colonelului')]
    .filter(Boolean)
    .forEach((img) => {
      const p = document.createElement('p');
      p.append(img);
      rightCell.push(p);
    });

  const cells = [[leftCell, contentCell, rightCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-heritage', cells });
  element.replaceWith(block);
}
