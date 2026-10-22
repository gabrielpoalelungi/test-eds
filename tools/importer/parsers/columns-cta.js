/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta (kfc.ro "Comandă online" band).
 * Source: .comanda-section-inner > .description p + .cta-button a
 * Block: one row, two cells -> [paragraph text] | [CTA link only]
 */

export default function parse(element, { document }) {
  const textCell = [];
  element.querySelectorAll('.description p').forEach((src) => {
    if (!src.textContent.trim()) return;
    const p = document.createElement('p');
    p.innerHTML = src.innerHTML.trim();
    textCell.push(p);
  });

  const actionCell = [];
  const cta = element.querySelector('.cta-button a[href]') || element.querySelector('a[href]');
  if (cta) {
    const label = (cta.querySelector('.text') || cta).textContent.trim();
    if (label) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = label;
      p.append(a);
      actionCell.push(p);
    }
  }

  const cells = [[textCell, actionCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
