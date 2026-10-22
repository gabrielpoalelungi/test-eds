/**
 * Wallbox (live .cmp-container--layout-flex): image left (7/12), copy right
 * (5/12) — heading, text, text link with chevron. Template-slotted: authored
 * nodes are MOVED into empty slot containers, classified by content.
 * @param {Element} block The wallbox block element
 */

// glyphs lifted from the prototype sprite (scripts/icons.js holds the shared set;
// inlined here so the block stays self-contained)
const GLYPHS = {
  'chevron-right': ['0 0 24 24', '<path d="M9 5.5l6.5 6.5L9 18.5"/>'],
};

function ico(name, cls = '') {
  const [viewBox, body] = GLYPHS[name];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', cls ? `ico ${cls}` : 'ico');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = body;
  return svg;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isCta(node) {
  const a = node.querySelector('a[href]');
  return !!a && node.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .wallbox-media, :scope > .wallbox-text')) return;

  const media = el('div', 'wallbox-media');
  const text = el('div', 'wallbox-text');
  const title = el('div', 'wallbox-title');
  const body = el('div', 'wallbox-body');
  const link = el('div', 'wallbox-link');

  [...block.children].flatMap((row) => [...row.children]).forEach((cell) => {
    [...cell.children].forEach((node) => {
      if (node.tagName === 'PICTURE' || (node.querySelector('picture, img') && !node.textContent.trim())) {
        media.append(node);
      } else if (/^H[1-6]$/.test(node.tagName)) {
        title.append(node);
      } else if (isCta(node)) {
        const a = node.querySelector('a[href]');
        if (!a.querySelector('.ico')) a.append(ico('chevron-right'));
        link.append(node);
      } else if (node.textContent.trim()) {
        body.append(node);
      }
    });
  });

  [title, body, link].forEach((slot) => {
    if (slot.children.length) text.append(slot);
  });
  block.replaceChildren(...(media.children.length ? [media] : []), text);
}
