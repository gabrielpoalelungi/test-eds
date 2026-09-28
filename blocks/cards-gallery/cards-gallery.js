import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the cards-gallery block
 * Content contract: one row per gallery item, one cell containing an image.
 * An optional extra text cell is kept as a caption.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-gallery-item';
    [...row.children].forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const media = document.createElement('div');
        media.className = 'cards-gallery-image';
        media.append(img
          ? createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }])
          : picture);
        li.append(media);
      }
      const text = [...cell.children].filter((el) => el.tagName !== 'PICTURE'
        && !el.querySelector('picture') && el.textContent.trim());
      if (text.length) {
        const caption = document.createElement('div');
        caption.className = 'cards-gallery-caption';
        caption.append(...text);
        li.append(caption);
      }
    });
    if (li.children.length) ul.append(li);
  });

  block.replaceChildren(ul);
}
