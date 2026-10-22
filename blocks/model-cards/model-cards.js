/**
 * Model choice (live .xftoggle): section heading + a row of entry cards, each
 * an icon, a title and one CTA. Reconstructive: every authored element is
 * classified by content and MOVED; cards are segmented on the most frequent
 * heading level (a card opens at an icon or at a heading once the current card
 * already has one). Anything unrecognised lands in the current card's body.
 * @param {Element} block The model-cards block element
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isCta(node) {
  const a = node.querySelector('a[href]');
  return !!a && node.textContent.trim() === a.textContent.trim();
}

function isIcon(node) {
  return !!node.querySelector('.icon, img, picture') && !node.textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .model-cards-list')) return;

  const elements = [...block.children].flatMap((row) => [...row.children])
    .flatMap((cell) => [...cell.children]);
  const headings = elements.filter((node) => /^H[1-6]$/.test(node.tagName));
  const counts = {};
  headings.forEach((h) => {
    counts[h.tagName] = (counts[h.tagName] || 0) + 1;
  });
  const cardTag = Object.keys(counts).sort((a, b) => counts[b] - counts[a]
    || b.localeCompare(a))[0];

  const head = el('div', 'model-cards-title');
  const list = el('ul', 'model-cards-list');
  let card = null;
  const slot = (name) => {
    let node = card.querySelector(`:scope > .model-card-${name}`);
    if (!node) {
      node = el('div', `model-card-${name}`);
      card.append(node);
    }
    return node;
  };
  const open = () => {
    card = el('li', 'model-card');
    list.append(card);
  };

  elements.forEach((node) => {
    const isCardHeading = node.tagName === cardTag;
    if (/^H[1-6]$/.test(node.tagName) && !isCardHeading && !card) {
      head.append(node);
      return;
    }
    if (isIcon(node)) {
      if (!card || card.querySelector('.model-card-title, .model-card-cta')) open();
      slot('icon').append(node);
    } else if (isCardHeading) {
      if (!card || card.querySelector('.model-card-title')) open();
      slot('title').append(node);
    } else if (!card) {
      head.append(node);
    } else if (isCta(node)) {
      slot('cta').append(node);
    } else if (node.textContent.trim()) {
      slot('body').append(node);
    }
  });

  block.replaceChildren(...(head.children.length ? [head] : []), list);
}
