/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/cards-article): one row per article, two cells -
 *   [image] | [tag, date, H3 title linked to the article].
 * Selectors validated against migration-work/block-context/cards-article/source.html:
 *   a.article-card (x4) > .article-card-image img, .article-card-body > .article-card-meta
 *   (span.tag, span.paragraph-sm), h3.h4-heading
 * Iteration is keyed on the inner block wrapper .article-card-body (not the <a> wrapper) so the
 * importer's inline-element merging cannot collapse cards; the href is read from closest('a').
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll('.article-card-body')).map((body) => {
    const card = body.closest('a, .article-card') || body.parentElement;
    return {
      body,
      image: (card && card.querySelector('.article-card-image img')) || (body.parentElement && body.parentElement.querySelector('img')),
      href: (body.closest('a') && body.closest('a').getAttribute('href')) || '',
    };
  });

  if (!items.length) {
    // Fallback: card wrappers without the inner body class
    items = Array.from(element.querySelectorAll(':scope > a, :scope > .article-card')).map((card) => ({
      body: card,
      image: card.querySelector('img'),
      href: card.getAttribute('href') || '',
    }));
  }

  const cells = [];
  items.forEach(({ body, image, href }) => {
    const textCell = [];
    const tag = body.querySelector('.tag');
    const metaSpans = Array.from(body.querySelectorAll('.article-card-meta span'));
    const date = metaSpans.find((s) => s !== tag && s.textContent.trim());

    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.push(p);
    }
    if (date) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }

    const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h3 = document.createElement('h3');
      const title = heading.textContent.trim();
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h3.append(a);
      } else {
        h3.textContent = title;
      }
      textCell.push(h3);
    }

    if (!image && !textCell.length) return;
    cells.push([image || '', textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
