/**
 * articles — section head + grid of article cards (card-as-link).
 * Decode tier: reconstructive (repeat group = card). Content before the first
 * media is the section head (heading + lede). Each media opens a card (a second
 * heading also opens one); per card: media → thumb, first plain paragraph →
 * tag pill, further plain paragraphs → meta (date), heading → title. The card
 * link is read from the title's (or any) inner anchor, which is then unwrapped
 * (EW6) so the card has no nested anchors.
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
const hasLink = (el) => el.matches('a') || !!el.querySelector('a');

function wrapNodes(className, nodes, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(...nodes);
  return w;
}

function buildCard(nodes) {
  let media = null;
  let title = null;
  const plain = [];
  const rest = [];
  nodes.forEach((el) => {
    if (!media && isMedia(el) && !el.textContent.trim()) media = mediaOf(el);
    else if (!title && isHeading(el)) title = el;
    else if (el.tagName === 'P' && !hasLink(el)) plain.push(el);
    else rest.push(el);
  });
  const link = (title && title.querySelector('a')) || nodes.map((n) => (n.matches('a') ? n : n.querySelector('a'))).find(Boolean);
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'article-card';
  if (link) {
    card.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  if (media) card.append(wrapNodes('thumb', [media]));
  const body = document.createElement('div');
  body.className = 'body';
  if (plain.length) {
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.append(wrapNodes('tag', [plain.shift()]));
    meta.append(...plain);
    body.append(meta);
  }
  if (title) body.append(title);
  body.append(...rest.filter((el) => el.textContent.trim() || isMedia(el)));
  card.append(body);
  return card;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  const head = [];
  const ledes = [];
  const groups = [];
  let cur = null;
  nodes.forEach((el) => {
    const media = isMedia(el) && !el.textContent.trim();
    if (!cur && !media) {
      if (isHeading(el) || el.tagName !== 'P') head.push(el);
      else ledes.push(el);
      return;
    }
    const heads = cur && cur.some(isHeading);
    if (!cur || (media && cur.some((n) => isMedia(n) && !n.textContent.trim()))
      || (heads && isHeading(el))) {
      cur = [];
      groups.push(cur);
    }
    cur.push(el);
  });
  const out = [];
  if (head.length || ledes.length) {
    const sh = wrapNodes('section-head', head);
    if (ledes.length) sh.append(wrapNodes('lede', ledes));
    out.push(sh);
  }
  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.append(...groups.map(buildCard));
  out.push(grid);
  block.replaceChildren(...out);
}
