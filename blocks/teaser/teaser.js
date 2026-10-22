/**
 * Stage teaser (live .cmp-backgroundmedia--v2): full-bleed art-directed image with
 * a gradient copy overlay (heading, text, optional price, CTAs), followed by its
 * WLTP disclaimers / footnotes. Template-slotted: authored nodes are MOVED into
 * empty slot containers. Rows are classified by content, never by position:
 * - pictures: 1 = every width; 2 = small + 768 up; 3 = small, medium, large (1024 up)
 * - copy: the row holding the heading (text, CTAs)
 * - price: a row of 3 cells (amount, VAT note, tooltip)
 * - disclaimer: text cell + optional tooltip cell
 * Variant `oblique`: wide copy column, diagonal shade.
 * @param {Element} block The teaser block element
 */

// glyphs lifted from the prototype sprite (scripts/icons.js holds the shared set;
// inlined here so the block stays self-contained)
const GLYPHS = {
  info: ['0 0 24 24', '<circle cx="12" cy="12" r="10.5"/><path d="M12 10.5v7"/><circle cx="12" cy="7" r=".6" fill="currentColor"/>'],
  close: ['0 0 24 24', '<path d="M5 5l14 14M19 5L5 19"/>'],
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

function closeTips(except) {
  document.querySelectorAll('.infoi.is-open').forEach((tip) => {
    if (tip === except) return;
    tip.classList.remove('is-open');
    tip.querySelector('.infoi-btn')?.setAttribute('aria-expanded', 'false');
  });
}

function buildInfoi(cell) {
  const infoi = el('div', 'infoi');
  const btn = el('button', 'infoi-btn');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Information');
  btn.setAttribute('aria-expanded', 'false');
  btn.append(ico('info'));
  const tip = el('div', 'infoi-tip');
  tip.setAttribute('role', 'tooltip');
  const close = el('button', 'infoi-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.append(ico('close'));
  tip.append(close, ...cell.children);
  infoi.append(btn, tip);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !infoi.classList.contains('is-open');
    closeTips(infoi);
    infoi.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
  close.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTips();
  });
  tip.addEventListener('click', (e) => e.stopPropagation());
  return infoi;
}

function buildDisclaimer(cells) {
  const disclaimer = el('div', 'disclaimer teaser-disclaimer');
  const [text, tip] = cells;
  disclaimer.append(...text.children);
  if (tip && tip.textContent.trim()) disclaimer.append(buildInfoi(tip));
  return disclaimer;
}

function buildPrice(cells) {
  const price = el('div', 'teaser-price');
  const amount = el('div', 'teaser-price-amount');
  const vat = el('div', 'teaser-price-vat');
  const [first, second, tip] = cells;
  amount.append(...first.children);
  vat.append(...second.children);
  if (tip && tip.textContent.trim()) vat.append(buildInfoi(tip));
  price.append(amount, vat);
  return price;
}

const SIZES = {
  1: ['all'],
  2: ['sm', 'up'],
  3: ['sm', 'md', 'lg'],
};

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-stage')) return;

  const stage = el('div', 'teaser-stage');
  const media = el('div', 'teaser-media');
  const overlay = el('div', 'teaser-overlay');
  const content = el('div', 'teaser-content');
  const title = el('div', 'teaser-title');
  const body = el('div', 'teaser-body');
  const buttons = el('div', 'teaser-buttons');
  const pictures = [];
  const extras = [];
  const disclaimers = [];
  let price;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('h1, h2, h3, h4, h5, h6')) {
      cells.forEach((cell) => {
        [...cell.children].forEach((child) => {
          if (/^H[1-6]$/.test(child.tagName)) title.append(child);
          else if (isCta(child)) buttons.append(child);
          else if (child.querySelector('picture')) pictures.push(child.querySelector('picture'));
          else body.append(child);
        });
      });
    } else if (row.querySelector('picture')) {
      row.querySelectorAll('picture').forEach((pic) => pictures.push(pic));
      cells.forEach((cell) => {
        [...cell.children].forEach((child) => {
          if (child.tagName !== 'PICTURE' && !child.querySelector('picture') && child.textContent.trim()) {
            extras.push(child);
          }
        });
      });
    } else if (cells.length >= 3) {
      price = buildPrice(cells);
    } else if (row.textContent.trim()) {
      disclaimers.push(buildDisclaimer(cells));
    }
    row.remove();
  });

  const sizes = SIZES[Math.min(pictures.length, 3)] || [];
  pictures.forEach((pic, i) => {
    const size = sizes[i] || 'extra';
    const wrap = el('div', `teaser-image teaser-image-${size}`);
    wrap.append(pic);
    media.append(wrap);
  });
  body.append(...extras);
  [title, body].forEach((slot) => {
    if (slot.children.length) content.append(slot);
  });
  if (price) content.append(price);
  if (buttons.children.length) content.append(buttons);
  overlay.append(content);
  stage.append(media, overlay);
  block.append(stage, ...disclaimers);

  if (!window.teaserTipsBound) {
    window.teaserTipsBound = true;
    document.addEventListener('click', () => closeTips());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTips();
    });
  }
}
