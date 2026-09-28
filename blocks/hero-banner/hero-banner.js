import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Turns standalone CTA links in the content into buttons and groups them.
 * @param {Element} content The content container
 */
function decorateActions(content) {
  const wrappers = [...content.querySelectorAll(':scope > p')].filter((p) => {
    const links = p.querySelectorAll('a');
    return links.length === 1 && p.textContent.trim() === links[0].textContent.trim();
  });
  if (!wrappers.length) return;

  const actions = document.createElement('div');
  actions.className = 'hero-banner-actions';
  wrappers[0].before(actions);
  wrappers.forEach((p) => {
    p.classList.add('button-wrapper');
    p.querySelector('a').classList.add('button');
    actions.append(p);
  });
}

/**
 * loads and decorates the hero-banner block
 * Content contract: row 1 - [background image]; row 2 - [heading, text, CTA link].
 * Tolerates image and text authored in the same cell or in any order.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const background = document.createElement('div');
  background.className = 'hero-banner-background';
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture && !background.children.length) {
        const parent = picture.parentElement;
        const img = picture.querySelector('img');
        background.append(img
          ? createOptimizedPicture(img.src, img.alt, false, [
            { media: '(min-width: 900px)', width: '2000' },
            { width: '750' },
          ])
          : picture);
        if (picture.isConnected) picture.remove();
        const emptyParent = !parent.textContent.trim() && !parent.children.length;
        if (parent !== cell && emptyParent) parent.remove();
      }
      [...cell.children].forEach((el) => {
        if (el.textContent.trim() || el.querySelector('a, img')) content.append(el);
      });
    });
  });

  decorateActions(content);

  const children = [];
  if (background.children.length) {
    children.push(background);
    block.classList.add('hero-banner-has-background');
  }
  if (content.children.length) children.push(content);
  block.replaceChildren(...children);
}
