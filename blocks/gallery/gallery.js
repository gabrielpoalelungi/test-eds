/**
 * gallery — centred section head + square image grid.
 * Decode tier: reconstructive (repeat group = image). Every media element
 * becomes one grid tile; heading + paragraphs form the section head.
 */
// Authored nodes of every cell, in order (EW1: existing elements, moved later, never copied).
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    // #104 — wrapTextNodes may fold a media-led cell into ONE <p>; expand it back.
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')
      && (kids[0].children.length > 1 || kids[0].textContent.trim())) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text node → moved into a fresh <p>
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const MEDIA = 'picture, img';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);
const mediaOf = (el) => {
  if (el.matches('picture')) return el;
  return el.querySelector('picture') || (el.matches('img') ? el : el.querySelector('img'));
};
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function wrapNodes(className, nodes, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  const head = [];
  const ledes = [];
  const items = [];
  nodes.forEach((el) => {
    if (isMedia(el) && !el.textContent.trim()) {
      const pics = el.matches(MEDIA) ? [] : [...el.querySelectorAll('picture')];
      if (pics.length > 1) items.push(...pics);
      else items.push(mediaOf(el));
    } else if (isHeading(el) || el.tagName !== 'P') head.push(el);
    else ledes.push(el);
  });
  const out = [];
  if (head.length || ledes.length) {
    const sh = wrapNodes('section-head', head);
    if (ledes.length) sh.append(wrapNodes('lede', ledes));
    out.push(sh);
  }
  const grid = document.createElement('ul');
  grid.className = 'grid';
  items.forEach((m) => grid.append(wrapNodes('tile', [m], 'li')));
  out.push(grid);
  block.replaceChildren(...out);
}
