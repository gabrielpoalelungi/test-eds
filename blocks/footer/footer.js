import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — template-slotted chrome (prototype `.site-footer`).
 * /footer document: section 1 = brand link + social link list (icon + label),
 * every further section = one link column (heading + list).
 * Authored nodes are MOVED into the slots, never re-created from text.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function decorateBrand(a) {
  a.classList.add('brand');
  const icon = el('span', 'brand-icon');
  const name = el('div', 'brand-name');
  [...a.childNodes].forEach((node) => {
    if (node.nodeType === 1 && node.classList.contains('icon')) icon.append(node);
    else name.append(node);
  });
  a.append(icon, name);
  return a;
}

/* the authored label text becomes the anchor's aria-label (icon-only link, as on the source) */
function decorateSocials(list) {
  list.classList.add('socials');
  list.setAttribute('aria-label', 'Social media links');
  list.querySelectorAll('a').forEach((a) => {
    const text = [...a.childNodes]
      .filter((node) => !(node.nodeType === 1 && node.classList.contains('icon')))
      .map((node) => node.textContent).join('').trim();
    if (text) a.setAttribute('aria-label', text);
    [...a.childNodes].forEach((node) => {
      if (!(node.nodeType === 1 && node.classList.contains('icon'))) node.remove();
    });
  });
}

/* swap the icon <img> for its inline SVG so the glyph paints in currentColor */
async function inlineIcons(root) {
  await Promise.all([...root.querySelectorAll('.icon img')].map(async (img) => {
    try {
      const resp = await fetch(img.src);
      if (!resp.ok) return;
      const tpl = document.createElement('template');
      tpl.innerHTML = (await resp.text()).trim();
      const svg = tpl.content.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      img.replaceWith(svg);
    } catch (e) {
      // keep the <img> fallback
    }
  }));
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const root = el('div', 'site-footer');
  const columns = el('div', 'container columns');
  root.append(columns);

  const [brandSection, ...linkSections] = fragment.querySelectorAll(':scope > .section');

  if (brandSection) {
    const col = el('div', 'brand-col');
    const brandLink = brandSection.querySelector('a');
    const socials = brandSection.querySelector('ul');
    const brandOutside = brandLink && !(socials && socials.contains(brandLink));
    if (brandOutside) col.append(decorateBrand(brandLink));
    if (socials) {
      decorateSocials(socials);
      col.append(socials);
    }
    columns.append(col);
  }

  linkSections.forEach((section) => {
    const content = section.querySelector('.default-content-wrapper');
    if (!content) return;
    const heading = content.querySelector('h2, h3, h4, p');
    const nav = el('nav', 'footer-links');
    if (heading) nav.setAttribute('aria-label', `${heading.textContent.trim()} links`);
    nav.append(...content.childNodes);
    // link text sits in a <div> inside the padded anchor, as on the source
    nav.querySelectorAll('a').forEach((a) => {
      const text = el('div');
      text.append(...a.childNodes);
      a.append(text);
    });
    columns.append(nav);
  });

  await inlineIcons(root);
  block.textContent = '';
  block.append(root);
}
