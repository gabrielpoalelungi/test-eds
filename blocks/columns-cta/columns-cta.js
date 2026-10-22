const BLOCK = 'columns-cta';

/**
 * A column is an action column when every authored element in it holds a link
 * and it carries no other text.
 * @param {Element} col
 */
function isActionColumn(col) {
  const links = [...col.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText === col.textContent.replace(/\s+/g, '');
}

/**
 * Creates a decorative icon image shipped with the block.
 * @param {string} name icon file name (without extension)
 * @param {string} position left|right
 */
function createIcon(name, position) {
  const img = document.createElement('img');
  img.src = `${window.hlx?.codeBasePath || ''}/blocks/${BLOCK}/${name}.svg`;
  img.alt = '';
  img.width = 21;
  img.height = 21;
  img.loading = 'lazy';
  img.setAttribute('aria-hidden', 'true');
  img.className = `${BLOCK}-icon-${position}`;
  return img;
}

/**
 * Turns the authored CTA link into the KFC red outline pill with
 * a leading "order" icon and a trailing arrow.
 * @param {HTMLAnchorElement} a
 */
function decorateCta(a) {
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  a.classList.add('kfc-button', 'is-red-outline', `${BLOCK}-button`);
  const label = document.createElement('span');
  label.className = `${BLOCK}-label`;
  label.textContent = a.textContent.trim();
  a.replaceChildren(createIcon('sign-out', 'left'), label, createIcon('arrow-right', 'right'));
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add(`${BLOCK}-row`);
    [...row.children].forEach((col) => {
      const isAction = isActionColumn(col);
      col.classList.add(isAction ? `${BLOCK}-action` : `${BLOCK}-text`);
      if (isAction) col.querySelectorAll('a').forEach(decorateCta);
    });
  });
}
