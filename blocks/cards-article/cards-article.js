import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the text cell of a card: groups meta (tag, date) before the title.
 * @param {Element} body The card body element
 * @param {Element} li The card list item
 */
function decorateBody(body, li) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('cards-article-title');
    const meta = [];
    let el = heading.previousElementSibling;
    while (el) {
      meta.unshift(el);
      el = el.previousElementSibling;
    }
    if (meta.length) {
      const wrapper = document.createElement('div');
      wrapper.className = 'cards-article-meta';
      heading.before(wrapper);
      wrapper.append(...meta);
    }
  }

  // make the whole card clickable via the title (or first) link
  const link = (heading && heading.querySelector('a[href]')) || body.querySelector('a[href]');
  if (link) {
    link.classList.add('cards-article-link');
    li.classList.add('cards-article-linked');
  }
}

/**
 * loads and decorates the cards-article block
 * Content contract: one row per article, two cells -
 * [image] | [tag, date, heading linked to the article].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture && !cell.textContent.trim()) {
        cell.className = 'cards-article-image';
        const img = picture.querySelector('img');
        if (img) {
          picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
        }
      } else {
        cell.className = 'cards-article-body';
        decorateBody(cell, li);
      }
    });

    if (li.children.length) ul.append(li);
  });

  block.replaceChildren(ul);
}
