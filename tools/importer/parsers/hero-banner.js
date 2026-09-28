/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/hero-banner): Row 1 = background image, Row 2 = heading, text, CTA link.
 * Selectors validated against migration-work/block-context/hero-banner/source.html:
 *   img.cover-image, .card-body h2.h1-heading, p.subheading, .button-group a
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img.cover-image') || element.querySelector('img');
  const body = element.querySelector('.card-body') || element;
  const heading = body.querySelector('h1, h2, h3');
  const subheading = body.querySelector('p.subheading') || body.querySelector('p');
  let ctaLinks = Array.from(body.querySelectorAll('.button-group a'));
  if (!ctaLinks.length) ctaLinks = Array.from(body.querySelectorAll('a.button'));

  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    p.append(link);
    contentCell.push(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
