/**
 * hero — lead split: headline, lede, CTA pair, three-image collage.
 * Decode tier: template-slotted. One cell or several, any order: the heading
 * is the page <h1>; link paragraphs are CTAs (**primary** / *secondary*);
 * media fill the collage; other paragraphs form the lede.
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
  const copy = [];
  const ledes = [];
  const ctas = [];
  const media = [];
  nodes.forEach((el) => {
    if (isMedia(el) && !el.textContent.trim()) media.push(mediaOf(el));
    else if (isHeading(el)) copy.push(el);
    else if (el.tagName === 'P' && hasLink(el)) ctas.push(el);
    else if (el.tagName === 'P') ledes.push(el);
    else copy.push(el);
  });
  const text = wrapNodes('copy', copy);
  if (ledes.length) text.append(wrapNodes('lede', ledes));
  if (ctas.length) text.append(wrapNodes('buttons', ctas));
  const split = wrapNodes('split', [text]);
  if (media.length) split.append(wrapNodes('collage', media));
  // The collage sits in the first viewport: load it eagerly (LCP candidate at narrow widths).
  split.querySelectorAll('.collage img').forEach((img) => { img.loading = 'eager'; });
  block.replaceChildren(split);
}
