import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — template-slotted chrome (prototype `.site-header`).
 * The /nav document has three sections: brand link, nav list, tools (CTA).
 * Authored nodes are MOVED into the prototype's slots, never re-created from text.
 * Nav list model: a top-level item with a nested list opens a panel; when that
 * panel's items carry their own lists it is the mega menu (columns + a promo item),
 * otherwise a dropdown. Mega links: [icon] link, line break, description.
 */

const CARET = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const MENU = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g stroke-linecap="square" stroke-linejoin="miter" stroke-width="1.5" fill="none" stroke="currentColor" stroke-miterlimit="10"><line x1="1" y1="12" x2="23" y2="12"></line><line x1="1" y1="5" x2="23" y2="5"></line><line x1="1" y1="19" x2="23" y2="19"></line></g></svg>';
const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function decorative(className, markup) {
  const span = el('span', className);
  span.innerHTML = markup;
  return span;
}

/**
 * Splits an element's children into lines: a <br> or a block child (<p>) ends a line.
 * Nested lists are skipped (handled by the caller).
 * @returns {Node[][]} the nodes of each non-empty line, in order
 */
function lines(container) {
  const out = [[]];
  [...container.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') {
      node.remove();
      out.push([]);
    } else if (node.nodeName === 'P') {
      out.push([]);
      [...node.childNodes].forEach((child) => {
        if (child.nodeName === 'BR') out.push([]);
        else out[out.length - 1].push(child);
      });
      out.push([]);
      node.remove();
    } else if (!['UL', 'OL'].includes(node.nodeName)) {
      out[out.length - 1].push(node);
    }
  });
  return out.filter((line) => line.some((n) => n.nodeType === 1 || n.textContent.trim()));
}

/**
 * Brand link: icon into `.brand-icon`, the label text into `.brand-name`.
 * @param {Element} a the authored brand anchor
 */
function decorateBrand(a) {
  a.classList.add('brand');
  const icon = el('span', 'brand-icon');
  const name = el('span', 'brand-name');
  [...a.childNodes].forEach((node) => {
    if (node.nodeType === 1 && node.classList.contains('icon')) icon.append(node);
    else name.append(node);
  });
  a.append(icon, name);
  return a;
}

function decorateMegaLink(li) {
  const [first = [], second = []] = lines(li);
  const a = first.find((n) => n.nodeName === 'A');
  if (!a) return;
  const icon = first.find((n) => n.nodeType === 1 && n.classList.contains('icon'))
    || a.querySelector('.icon');
  a.classList.add('mega-link');
  const text = el('span', 'mega-text');
  const title = el('strong');
  [...a.childNodes].forEach((n) => { if (n !== icon) title.append(n); });
  const desc = el('small');
  second.forEach((n) => desc.append(n));
  text.append(title, desc);
  if (icon) a.append(icon);
  a.append(text);
  li.append(a);
}

function decoratePromo(li) {
  const [first = [], second = [], third = []] = lines(li);
  const a = first.find((n) => n.nodeName === 'A');
  if (!a) return;
  li.classList.add('mega-promo');
  const title = el('strong');
  [...a.childNodes].forEach((n) => title.append(n));
  a.append(title);
  if (second.length) {
    const p = el('p');
    second.forEach((n) => p.append(n));
    a.append(p);
  }
  if (third.length) {
    const cta = el('span', 'mega-cta');
    third.forEach((n) => cta.append(n));
    cta.append(decorative('mega-arrow', ARROW));
    a.append(cta);
  }
  li.append(a);
}

function decorateMegaColumn(li, list) {
  li.classList.add('mega-column');
  const [label = []] = lines(li);
  const heading = el('div', 'mega-heading', { role: 'heading', 'aria-level': '3' });
  label.forEach((n) => heading.append(n));
  li.prepend(heading);
  [...list.children].forEach(decorateMegaLink);
}

function decoratePanel(li, list) {
  const items = [...list.children];
  const mega = items.some((item) => item.querySelector(':scope > ul'));
  const panel = el('div', mega ? 'mega-menu' : 'dropdown');
  li.append(panel);
  panel.append(list);
  if (!mega) return;
  items.forEach((item) => {
    const sub = item.querySelector(':scope > ul');
    if (sub) decorateMegaColumn(item, sub);
    else decoratePromo(item);
  });
}

function decorateNavItem(li) {
  const list = li.querySelector(':scope > ul');
  if (!list) {
    const p = li.querySelector(':scope > p');
    if (p) p.replaceWith(...p.childNodes);
    const a = li.querySelector(':scope > a');
    if (a) a.classList.add('nav-link');
    return;
  }
  const trigger = el('a', 'nav-link', { tabindex: '0', 'aria-haspopup': 'true' });
  const [label = []] = lines(li);
  label.forEach((n) => trigger.append(n));
  trigger.append(decorative('nav-caret', CARET));
  li.prepend(trigger);
  decoratePanel(li, list);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const [brandSection, navSection, toolsSection] = fragment.querySelectorAll(':scope > .section');

  const root = el('div', 'site-header');
  const bar = el('div', 'container bar');
  root.append(bar);

  const brandLink = brandSection && brandSection.querySelector('a');
  if (brandLink) bar.append(decorateBrand(brandLink));

  const nav = el('nav', 'site-nav', { id: 'site-nav', 'aria-label': 'Main navigation' });
  const list = navSection && navSection.querySelector('ul');
  if (list) {
    nav.append(list);
    [...list.children].forEach(decorateNavItem);
  }
  bar.append(nav);

  const tools = el('div', 'bar-tools');
  const toolsContent = toolsSection && toolsSection.querySelector('.default-content-wrapper');
  if (toolsContent) tools.append(...toolsContent.childNodes);
  bar.append(tools);

  const toggle = el('button', 'menu-toggle', {
    type: 'button',
    'aria-label': 'Toggle navigation',
    'aria-expanded': 'false',
    'aria-controls': 'site-nav',
  });
  toggle.innerHTML = MENU;
  bar.append(toggle);

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape' || !nav.classList.contains('is-open')) return;
    setOpen(false);
    toggle.focus();
  });
  nav.querySelectorAll('.nav-link[tabindex]').forEach((trigger) => {
    trigger.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') trigger.blur();
    });
  });

  block.textContent = '';
  block.append(root);
}
