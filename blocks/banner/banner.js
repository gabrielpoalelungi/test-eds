/**
 * banner — closing photo card: full-bleed image under a dark gradient, with
 * headline, lede and CTA anchored bottom-left.
 * Decode tier: template-slotted. Media → card background; heading → title;
 * link paragraphs → buttons; other paragraphs → lede.
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
const hasLink = (el) => el.matches('a') || !!el.querySelector('a');

function wrapNodes(className, nodes, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  let media = null;
  const copy = [];
  const ledes = [];
  const ctas = [];
  nodes.forEach((el) => {
    if (!media && isMedia(el) && !el.textContent.trim()) media = mediaOf(el);
    else if (el.tagName === 'P' && hasLink(el)) ctas.push(el);
    else if (el.tagName === 'P') ledes.push(el);
    else copy.push(el);
  });
  const text = wrapNodes('copy', copy);
  if (ledes.length) text.append(wrapNodes('lede', ledes));
  if (ctas.length) text.append(wrapNodes('buttons', ctas));
  const card = document.createElement('div');
  card.className = 'card';
  if (media) card.append(wrapNodes('bg', [media]));
  card.append(text);
  block.replaceChildren(card);
}
