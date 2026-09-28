import { createOptimizedPicture } from '../../scripts/aem.js';

const SEPARATOR = /^[/>|\u203a\u00bb\u2022-]$/;

/**
 * wraps plain-text breadcrumb separators (e.g. " / ") in a styling hook
 * @param {Element} container element holding the breadcrumb links
 */
function decorateSeparators(container) {
  [...container.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE && SEPARATOR.test(node.textContent.trim()))
    .forEach((node) => {
      const sep = document.createElement('span');
      sep.className = 'columns-article-separator';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = node.textContent.trim();
      node.replaceWith(sep);
    });
}

/**
 * wraps a leading "By" in the byline in a styling hook
 * @param {Element} p byline paragraph
 */
function decorateByline(p) {
  const first = p.firstChild;
  if (!first || first.nodeType !== Node.TEXT_NODE) return;
  const match = first.textContent.match(/^(\s*by)(\s+)/i);
  if (!match) return;
  const prefix = document.createElement('span');
  prefix.className = 'columns-article-byline-prefix';
  prefix.textContent = match[1].trim();
  first.textContent = first.textContent.slice(match[1].length);
  p.prepend(prefix);
  p.classList.add('columns-article-byline');
}

/**
 * loads and decorates the columns-article block
 * Content contract: one row, two cells - [image] | [breadcrumb links, heading, byline, date].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);

  cells.forEach((cell) => {
    const picture = cell.querySelector('picture');
    const hasText = cell.textContent.trim().length > 0;

    if (picture && !hasText) {
      cell.className = 'columns-article-image';
      const img = picture.querySelector('img');
      if (img) {
        picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [
          { media: '(min-width: 900px)', width: '900' },
          { width: '750' },
        ]));
      }
      return;
    }

    cell.className = 'columns-article-body';
    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) return;

    // paragraphs of links before the heading are breadcrumbs
    const before = [];
    let el = heading.previousElementSibling;
    while (el) {
      before.unshift(el);
      el = el.previousElementSibling;
    }
    const crumbs = before.filter((node) => node.querySelector('a'));
    if (crumbs.length) {
      const nav = document.createElement('nav');
      nav.className = 'columns-article-breadcrumbs';
      nav.setAttribute('aria-label', 'Breadcrumb');
      crumbs[0].before(nav);
      nav.append(...crumbs);
      crumbs.forEach(decorateSeparators);
    }

    // paragraphs after the heading form the byline / meta
    const after = [];
    el = heading.nextElementSibling;
    while (el) {
      after.push(el);
      el = el.nextElementSibling;
    }
    if (after.length) {
      const meta = document.createElement('div');
      meta.className = 'columns-article-meta';
      heading.after(meta);
      meta.append(...after);
      decorateByline(after[0]);
    }
  });

  if (cells.some((cell) => cell.classList.contains('columns-article-image'))) {
    block.classList.add('columns-article-has-image');
  }
}
