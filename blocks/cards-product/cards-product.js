import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'cards-product';

const isTitle = (el) => /^H[1-6]$/.test(el.tagName)
  || (el.tagName === 'P' && el.children.length === 1 && el.firstElementChild.tagName === 'STRONG'
    && el.textContent.trim() === el.firstElementChild.textContent.trim());

/**
 * Tags the parts of a product card body: badge, title, description, link.
 * @param {Element} body The card body cell
 */
function decorateBody(body) {
  const children = [...body.children];
  const titleIdx = children.findIndex(isTitle);
  if (titleIdx >= 0) {
    children[titleIdx].classList.add(`${BLOCK}-title`);
    // short plain paragraphs authored before the title are badges (e.g. "Nou")
    children.slice(0, titleIdx)
      .filter((el) => el.tagName === 'P' && !el.querySelector('a, picture'))
      .forEach((el) => el.classList.add(`${BLOCK}-badge`));
  }

  const linkHolder = children.findLast((el) => el.querySelector('a'));
  if (linkHolder && linkHolder !== children[titleIdx]) {
    linkHolder.classList.add(`${BLOCK}-cta`);
    linkHolder.querySelector('a').classList.add(`${BLOCK}-link`);
  } else {
    body.querySelector('a')?.classList.add(`${BLOCK}-link`);
  }

  children
    .filter((el) => el.tagName === 'P' && !el.className)
    .forEach((el) => el.classList.add(`${BLOCK}-description`));
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = `${BLOCK}-list`;

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    item.className = `${BLOCK}-item`;
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((cell) => {
      const isImage = cell.querySelector('picture') && !cell.textContent.trim();
      cell.className = isImage ? `${BLOCK}-image` : `${BLOCK}-body`;
      if (!isImage) decorateBody(cell);
    });
    list.append(item);
  });

  list.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });

  block.replaceChildren(list);
}
