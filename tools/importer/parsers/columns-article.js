/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/columns-article): 1 row, 2 cells -
 *   [image] | [breadcrumb links paragraph, heading, byline paragraph, date/read-time paragraph].
 * Selectors validated against migration-work/block-context/columns-article/source.html:
 *   :scope > div (2 columns), img.cover-image, .breadcrumbs a, h2.h2-heading, .flex-horizontal spans
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const heading = element.querySelector('h1, h2, h3, h4');

  // Image column: first column that holds an image but no heading
  const imageCol = columns.find((col) => col.querySelector('img') && !col.querySelector('h1, h2, h3, h4'));
  const image = imageCol ? imageCol.querySelector('img') : null;
  const textCol = (heading && heading.closest('.grid-layout > div')) || columns.find((col) => col !== imageCol) || element;

  if (!heading && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textCell = [];

  // Breadcrumbs: keep links only (the chevron separator is a decorative inline SVG)
  const crumbLinks = Array.from(textCol.querySelectorAll('.breadcrumbs a'));
  if (crumbLinks.length) {
    const p = document.createElement('p');
    crumbLinks.forEach((a, i) => {
      if (i > 0) p.append(document.createTextNode(' / '));
      p.append(a);
    });
    textCell.push(p);
  }

  if (heading) textCell.push(heading);

  // Byline/meta rows: each .flex-horizontal row becomes a paragraph of its span texts
  const metaRows = Array.from(textCol.querySelectorAll('.flex-horizontal'));
  metaRows.forEach((row) => {
    const parts = Array.from(row.querySelectorAll('span'))
      .map((s) => s.textContent.trim())
      .filter(Boolean);
    const text = parts.length ? parts.join(' ') : row.textContent.trim().replace(/\s+/g, ' ');
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      textCell.push(p);
    }
  });

  // Fallback: plain paragraphs after the heading if no flex meta rows exist
  if (!metaRows.length) {
    textCol.querySelectorAll('p').forEach((p) => textCell.push(p));
  }

  const cells = [[image || '', textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
