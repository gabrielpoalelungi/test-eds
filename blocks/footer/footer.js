import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import ico from '../../scripts/icons.js';

// BMW footer, rebuilt from /footer: an AI-notice section (icon + text), one section per
// link column (h3 + list pairs), a social section (image links) and a legal list.
// Sections are recognised by content, so authors can add or drop a column.

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  node.append(...children.filter(Boolean));
  return node;
}

function contentOf(section) {
  return section.querySelector('.default-content-wrapper') || section;
}

function buildAiNote(section) {
  const wrap = contentOf(section);
  const icon = wrap.querySelector('.icon img');
  const media = el('div', { class: 'ai-note-media' });
  if (icon) {
    icon.alt = icon.dataset.iconName || '';
    icon.width = 40;
    icon.height = 40;
    media.append(icon);
  }
  const text = el('div', { class: 'ai-note-text' });
  [...wrap.children].forEach((child) => {
    if (child.textContent.trim()) text.append(child);
  });
  return el('div', { class: 'ai-note' }, media, text);
}

/** live markup wraps every footer link label (and the copyright) in a <span> */
function wrapLabels(ul) {
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const target = li.querySelector('a') || li;
    if (target.querySelector('img, span')) return;
    const span = document.createElement('span');
    span.append(...target.childNodes);
    target.append(span);
  });
}

function buildColumn(section) {
  const col = el('div', { class: 'footer-col' });
  const wrap = contentOf(section);
  let flist = null;
  [...wrap.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName)) {
      const title = el('h3', { class: 'flist-title', tabindex: '0', 'aria-expanded': 'false' });
      title.append(...child.childNodes, ico('chevron-down'));
      flist = el('div', { class: 'flist' }, title);
      col.append(flist);
      const toggle = () => title.setAttribute(
        'aria-expanded',
        String(title.getAttribute('aria-expanded') !== 'true'),
      );
      title.addEventListener('click', toggle);
      title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    } else if (child.tagName === 'UL' && flist) {
      child.classList.add('flist-items');
      wrapLabels(child);
      flist.append(child);
    }
  });
  return col;
}

function buildSocial(section) {
  const ul = contentOf(section).querySelector('ul');
  ul.className = 'social';
  ul.querySelectorAll('a').forEach((a) => {
    const img = a.querySelector('img');
    if (!img) return;
    if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', `BMW ${img.alt}`.trim());
    img.width = 30;
    img.height = 30;
    img.loading = 'lazy';
  });
  return ul;
}

function buildLegal(section) {
  const ul = contentOf(section).querySelector('ul');
  ul.className = 'legal';
  wrapLabels(ul);
  return ul;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const sections = fragment ? [...fragment.querySelectorAll(':scope > .section')] : [];

  block.textContent = '';
  const panel = el('div', { class: 'footer-panel' });
  const cols = el('div', { class: 'footer-cols' });
  let ai = null;
  let social = null;
  let legal = null;
  sections.forEach((section) => {
    if (section.querySelector('.icon-ai-label')) ai = buildAiNote(section);
    else if (section.querySelector('h1, h2, h3, h4, h5, h6')) cols.append(buildColumn(section));
    else if (section.querySelector('ul a img')) social = buildSocial(section);
    else if (section.querySelector('ul')) legal = buildLegal(section);
  });
  panel.append(...[ai, cols, social, legal].filter(Boolean));
  block.append(panel, el('div', { class: 'footer-tail' }));
}
