/**
 * featured — featured story split: image | breadcrumbs, headline, byline.
 * Decode tier: template-slotted. Media → left column; a link paragraph before
 * the heading → breadcrumbs; paragraphs after it → byline (<strong> = author).
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

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  const media = [];
  const crumbs = [];
  const head = [];
  const byline = [];
  let seenHeading = false;
  nodes.forEach((el) => {
    if (isMedia(el) && !el.textContent.trim()) media.push(mediaOf(el));
    else if (isHeading(el)) {
      seenHeading = true;
      head.push(el);
    } else if (!seenHeading && el.tagName === 'P' && hasLink(el)) crumbs.push(el);
    else if (seenHeading) byline.push(el);
    else head.push(el);
  });
  const text = document.createElement('div');
  text.className = 'copy';
  if (crumbs.length) text.append(wrapNodes('breadcrumbs', crumbs));
  text.append(...head);
  if (byline.length) text.append(wrapNodes('byline', byline));
  const split = document.createElement('div');
  split.className = 'split';
  if (media.length) split.append(wrapNodes('media', media));
  split.append(text);
  block.replaceChildren(split);
}
