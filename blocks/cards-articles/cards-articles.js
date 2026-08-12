import { createOptimizedPicture } from '../../scripts/aem.js';

const DATE_RE = /\s((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,\s*\d{4})?)$/;

/**
 * Split a meta paragraph like "Casual Cool May 12" into a category pill and a date.
 * @param {Element} p the meta paragraph
 */
function decorateMeta(p) {
  const raw = p.textContent.trim();
  const match = raw.match(DATE_RE);
  p.textContent = '';
  p.classList.add('cards-articles-card-meta');

  let category = raw;
  let date = '';
  if (match) {
    [, date] = match;
    category = raw.slice(0, match.index).trim();
  }

  if (category) {
    const tag = document.createElement('span');
    tag.className = 'cards-articles-card-tag';
    tag.textContent = category;
    p.append(tag);
  }
  if (date) {
    const time = document.createElement('span');
    time.className = 'cards-articles-card-date';
    time.textContent = date;
    p.append(time);
  }
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-articles-card-image';
      } else {
        div.className = 'cards-articles-card-body';
        const meta = div.querySelector('p');
        if (meta) decorateMeta(meta);
        // The trailing link duplicates the title; make the whole card clickable instead.
        const link = div.querySelector('p:last-of-type > a');
        if (link) {
          const href = link.getAttribute('href');
          const anchor = document.createElement('a');
          anchor.href = href;
          anchor.setAttribute('aria-label', link.textContent.trim());
          link.closest('p').remove();
          while (li.firstChild) anchor.append(li.firstChild);
          li.append(anchor);
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
