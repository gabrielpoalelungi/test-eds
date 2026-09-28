import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Whether a paragraph contains nothing but links (CTA row).
 * @param {Element} p The paragraph
 * @returns {boolean}
 */
function isLinkOnly(p) {
  const links = [...p.querySelectorAll('a')];
  if (!links.length) return false;
  const strip = (text) => text.replace(/\s/g, '');
  return strip(links.map((a) => a.textContent).join('')) === strip(p.textContent);
}

/**
 * loads and decorates the hero-split block
 * Content contract: one cell with images (collage) and one cell with
 * heading, text and CTAs. Cell order does not matter.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-split-content';
  const media = document.createElement('div');
  media.className = 'hero-split-media';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      // collect images into the collage
      cell.querySelectorAll('picture').forEach((picture) => {
        const parent = picture.parentElement;
        const img = picture.querySelector('img');
        const item = document.createElement('div');
        item.className = 'hero-split-image';
        item.append(img
          ? createOptimizedPicture(img.src, img.alt, media.children.length === 0, [
            { media: '(min-width: 900px)', width: '750' },
            { width: '600' },
          ])
          : picture);
        media.append(item);
        if (picture.isConnected) picture.remove();
        const emptyParent = !parent.textContent.trim() && !parent.children.length;
        if (parent !== cell && emptyParent) parent.remove();
      });

      // everything else is text content
      [...cell.children].forEach((el) => {
        if (el.textContent.trim() || el.querySelector('img, a')) content.append(el);
      });
    });
  });

  // group CTA paragraphs into a single actions row
  const ctas = [...content.children].filter((el) => el.tagName === 'P' && isLinkOnly(el));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-split-actions';
    ctas[0].before(actions);
    actions.append(...ctas);
  }

  const children = [];
  if (content.children.length) children.push(content);
  if (media.children.length) {
    children.push(media);
    block.classList.add('hero-split-has-media');
  }
  block.replaceChildren(...children);
}
