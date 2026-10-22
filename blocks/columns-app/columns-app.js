const BLOCK = 'columns-app';

const isImageOnly = (el) => el.querySelector('picture, img') && !el.textContent.trim();

/**
 * Tags the text column: leading logo, icon + text feature items, CTA link.
 * @param {Element} col The text column
 * @returns {Element|null} the logo paragraph, if authored
 */
function decorateTextColumn(col) {
  let logo = null;
  const first = col.firstElementChild;
  if (first && first.tagName === 'P' && isImageOnly(first)) {
    first.classList.add(`${BLOCK}-logo`);
    logo = first;
  }

  col.querySelectorAll(':scope > p').forEach((p) => {
    if (p === logo) return;

    // a paragraph holding only a link is the call to action
    const link = p.querySelector('a[href]');
    if (link && !link.querySelector('img') && p.textContent.trim() === link.textContent.trim()) {
      p.className = `${BLOCK}-cta`;
      link.className = 'kfc-button is-red';
      return;
    }

    // paragraphs that start with an icon image followed by text are feature items
    const lead = p.firstElementChild;
    const startsWithIcon = lead && (lead.tagName === 'PICTURE' || lead.tagName === 'IMG' || lead.classList.contains('icon'))
      && !p.firstChild.textContent?.trim();
    if (startsWithIcon && p.textContent.trim()) {
      p.classList.add(`${BLOCK}-feature`);
      lead.classList.add(`${BLOCK}-feature-icon`);
    }
  });

  return logo;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  let logo = null;
  [...block.children].forEach((row) => {
    row.classList.add(`${BLOCK}-row`);
    [...row.children].forEach((col) => {
      if (isImageOnly(col)) {
        col.classList.add(`${BLOCK}-media`);
      } else {
        col.classList.add(`${BLOCK}-text`);
        logo = logo || decorateTextColumn(col);
      }
    });
  });

  // the app logo sits centred above both columns
  if (logo) block.prepend(logo);
}
