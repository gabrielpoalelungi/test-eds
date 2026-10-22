const BLOCK = 'columns-heritage';

const hasOnlyMedia = (col) => col.querySelector('picture') && !col.textContent.trim();

/**
 * Turns the authored CTA link into a KFC red pill button with a trailing arrow.
 * @param {Element} col The content column
 */
function decorateCta(col) {
  const link = [...col.querySelectorAll('a[href]')].pop();
  if (!link) return;
  const wrapper = link.closest('p');
  if (wrapper && wrapper.textContent.trim() === link.textContent.trim()) {
    wrapper.classList.add(`${BLOCK}-cta`);
  }
  link.classList.remove('button');
  link.classList.add('kfc-button', 'is-red');
  if (!link.querySelector('img')) {
    const label = document.createElement('span');
    label.append(...link.childNodes);
    const icon = document.createElement('img');
    icon.src = `${window.hlx?.codeBasePath || ''}/blocks/${BLOCK}/arrow-right.svg`;
    icon.alt = '';
    icon.width = 21;
    icon.height = 21;
    icon.loading = 'lazy';
    icon.setAttribute('aria-hidden', 'true');
    link.append(label, icon);
  }
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add(`${BLOCK}-row`);
    const cols = [...row.children];
    row.classList.add(`${BLOCK}-${cols.length}-cols`);

    const mediaCols = [];
    cols.forEach((col) => {
      if (hasOnlyMedia(col)) {
        col.classList.add(`${BLOCK}-media`);
        mediaCols.push(col);
        // a second image in a media column is the signature
        const pictures = [...col.querySelectorAll('picture')];
        pictures.forEach((pic, i) => {
          const item = pic.closest('p') || pic;
          item.classList.add(i === 0 ? `${BLOCK}-image` : `${BLOCK}-signature`);
        });
      } else {
        col.classList.add(`${BLOCK}-content`);
        decorateCta(col);
      }
    });

    if (mediaCols.length) {
      mediaCols[0].classList.add(`${BLOCK}-media-left`);
      if (mediaCols.length > 1) mediaCols[mediaCols.length - 1].classList.add(`${BLOCK}-media-right`);
    }
  });
}
