/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/hero-split): Row 1 = images cell (collage), Row 2 = H1, paragraph,
 * CTA links (primary wrapped in <strong>, secondary in <em>), each link in its own paragraph.
 * Selectors validated against migration-work/block-context/hero-split/source.html:
 *   .h1-heading / h1, p.subheading, .button-group a.button, img.cover-image
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, .h1-heading, h2');
  const subheading = element.querySelector('p.subheading') || element.querySelector('p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a'));
  const fallbackLinks = ctaLinks.length ? ctaLinks : Array.from(element.querySelectorAll('a.button'));
  const images = Array.from(element.querySelectorAll('img'));

  if (!heading && !subheading && !images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: image collage
  if (images.length) cells.push([images]);

  // Row 2: text content
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  fallbackLinks.forEach((link) => {
    const p = document.createElement('p');
    const isSecondary = link.classList.contains('secondary-button');
    const wrapper = document.createElement(isSecondary ? 'em' : 'strong');
    wrapper.append(link);
    p.append(wrapper);
    contentCell.push(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
