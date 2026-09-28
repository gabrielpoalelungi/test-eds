import { decorateIcons } from '../../scripts/aem.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Fetches the nav fragment: /content first (local preview), then site root (DA/EDS).
 * @returns {Promise<Element|null>} container holding the fragment sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  // relative image paths are relative to the fragment, not to the current page
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return container;
}

function createIcon(name) {
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  return span;
}

/**
 * Returns the text of an element's own label (first paragraph or direct text),
 * ignoring nested lists.
 */
function getLabel(li) {
  const p = li.querySelector(':scope > p');
  if (p) return p.textContent.trim();
  return [...li.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent.trim())
    .join(' ')
    .trim();
}

/**
 * Keeps an open panel inside the viewport by shifting it horizontally.
 * @param {Element} panel the dropdown panel
 */
function keepInViewport(panel) {
  panel.style.removeProperty('--nav-panel-shift');
  if (!isDesktop.matches) return;
  const gutter = 16;
  const rect = panel.getBoundingClientRect();
  const viewport = document.documentElement.clientWidth;
  let shift = 0;
  if (rect.left < gutter) shift = gutter - rect.left;
  else if (rect.right > viewport - gutter) shift = viewport - gutter - rect.right;
  if (shift) panel.style.setProperty('--nav-panel-shift', `${Math.round(shift)}px`);
}

function closeAllPanels(nav, except) {
  nav.querySelectorAll('.nav-item[aria-expanded="true"]').forEach((item) => {
    if (item === except) return;
    item.setAttribute('aria-expanded', 'false');
    item.querySelector(':scope > .nav-trigger').setAttribute('aria-expanded', 'false');
  });
}

function setPanelOpen(nav, item, open) {
  if (open) closeAllPanels(nav, item);
  item.setAttribute('aria-expanded', open ? 'true' : 'false');
  item.querySelector(':scope > .nav-trigger').setAttribute('aria-expanded', open ? 'true' : 'false');
  const panel = item.querySelector(':scope > .nav-panel');
  if (open && panel) keepInViewport(panel);
}

/**
 * Builds a mega menu item link: icon, title and description.
 * @param {Element} li source list item (img, link, description paragraphs)
 */
function buildMegaItem(li) {
  const source = li.querySelector('a');
  const a = document.createElement('a');
  a.className = 'nav-megamenu-item';
  a.href = source.href;
  const icon = li.querySelector('img');
  if (icon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'nav-megamenu-item-icon';
    iconWrap.append(icon);
    a.append(iconWrap);
  }
  const text = document.createElement('span');
  text.className = 'nav-megamenu-item-text';
  const title = document.createElement('span');
  title.className = 'nav-megamenu-item-title';
  title.textContent = source.textContent.trim();
  text.append(title);
  const desc = [...li.querySelectorAll(':scope > p')]
    .find((p) => !p.querySelector('a, img') && p.textContent.trim());
  if (desc) {
    const descEl = document.createElement('span');
    descEl.className = 'nav-megamenu-item-desc';
    descEl.textContent = desc.textContent.trim();
    // keep a space so title and description read as separate words
    text.append(' ', descEl);
  }
  a.append(text);
  return a;
}

/**
 * Builds a promo card from a list item without nested list:
 * bold title, text and a call-to-action link (optionally followed by an icon).
 */
function buildPromo(li) {
  const cta = li.querySelector('a');
  const card = document.createElement('a');
  card.className = 'nav-promo';
  if (cta) card.href = cta.href;
  li.querySelectorAll(':scope > p, :scope > h2, :scope > h3, :scope > h4').forEach((el) => {
    if (card.childNodes.length) card.append(' ');
    if (el.contains(cta)) {
      const action = document.createElement('span');
      action.className = 'nav-promo-cta';
      const label = document.createElement('span');
      label.textContent = cta.textContent.trim();
      action.append(label);
      const icon = el.querySelector('img');
      if (icon) action.append(icon);
      card.append(action);
    } else if (el.querySelector('strong') || /^H\d$/.test(el.tagName)) {
      const title = document.createElement('span');
      title.className = 'nav-promo-title';
      title.textContent = el.textContent.trim();
      card.append(title);
    } else {
      const text = document.createElement('span');
      text.className = 'nav-promo-text';
      text.textContent = el.textContent.trim();
      card.append(text);
    }
  });
  return card;
}

/**
 * Builds the panel for a nav item with a nested list.
 * Columns (items that themselves contain lists) produce a mega menu,
 * otherwise a simple dropdown list.
 */
function buildPanel(subList) {
  const entries = [...subList.children];
  const isMega = entries.some((li) => li.querySelector(':scope > ul'));
  const panel = document.createElement('div');
  panel.className = `nav-panel ${isMega ? 'nav-megamenu' : 'nav-dropdown'}`;

  if (!isMega) {
    const ul = document.createElement('ul');
    entries.forEach((li) => {
      const source = li.querySelector('a');
      if (!source) return;
      const item = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'nav-dropdown-link';
      a.href = source.href;
      a.textContent = source.textContent.trim();
      item.append(a);
      ul.append(item);
    });
    panel.append(ul);
    return panel;
  }

  const grid = document.createElement('ul');
  grid.className = 'nav-megamenu-grid';
  entries.forEach((li) => {
    const column = document.createElement('li');
    const nested = li.querySelector(':scope > ul');
    if (nested) {
      column.className = 'nav-megamenu-column';
      const heading = document.createElement('p');
      heading.className = 'nav-megamenu-heading';
      heading.textContent = getLabel(li);
      const items = document.createElement('ul');
      [...nested.children].forEach((itemLi) => {
        if (!itemLi.querySelector('a')) return;
        const item = document.createElement('li');
        item.append(buildMegaItem(itemLi));
        items.append(item);
      });
      column.append(heading, items);
    } else {
      column.className = 'nav-megamenu-promo';
      column.append(buildPromo(li));
    }
    grid.append(column);
  });
  panel.append(grid);
  return panel;
}

function buildNavItem(nav, li) {
  const item = document.createElement('li');
  item.className = 'nav-item';
  const subList = li.querySelector(':scope > ul');
  if (!subList) {
    const source = li.querySelector('a');
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = source.href;
    a.textContent = source.textContent.trim();
    item.append(a);
    return item;
  }

  item.classList.add('nav-drop');
  item.setAttribute('aria-expanded', 'false');
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav-link nav-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'true');
  const label = document.createElement('span');
  label.textContent = getLabel(li);
  trigger.append(label, createIcon('nav-caret'));
  item.append(trigger, buildPanel(subList));

  trigger.addEventListener('click', () => {
    // on desktop a click keeps the hovered panel open (like the source); on mobile it toggles
    const open = item.getAttribute('aria-expanded') === 'true';
    setPanelOpen(nav, item, isDesktop.matches ? true : !open);
  });
  item.addEventListener('mouseenter', () => {
    if (isDesktop.matches) setPanelOpen(nav, item, true);
  });
  item.addEventListener('mouseleave', () => {
    if (isDesktop.matches) setPanelOpen(nav, item, false);
  });
  return item;
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') !== 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  document.body.style.overflowY = expanded && !isDesktop.matches ? 'hidden' : '';
  if (!expanded) closeAllPanels(nav);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  if (!fragment) return;
  const [brandSection, menuSection, toolsSection] = fragment.querySelectorAll(':scope > div');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.setAttribute('aria-expanded', 'false');

  // brand
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const brandLink = brandSection && brandSection.querySelector('a');
  if (brandLink) {
    const a = document.createElement('a');
    a.href = brandLink.href;
    const logo = brandLink.querySelector('img');
    if (logo) {
      logo.alt = '';
      a.append(logo);
    }
    const name = document.createElement('span');
    name.className = 'nav-brand-name';
    name.textContent = brandLink.textContent.trim();
    a.append(name);
    brand.append(a);
  }

  // sections
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  sections.id = 'nav-sections';
  const list = document.createElement('ul');
  list.className = 'nav-list';
  const menu = menuSection && menuSection.querySelector('ul');
  if (menu) [...menu.children].forEach((li) => list.append(buildNavItem(nav, li)));
  sections.append(list);

  // tools (call-to-action buttons)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (toolsSection) {
    toolsSection.querySelectorAll('a').forEach((source) => {
      const a = document.createElement('a');
      a.href = source.getAttribute('href');
      a.textContent = source.textContent.trim();
      const secondary = source.closest('em') && !source.closest('strong');
      a.className = `button ${secondary ? 'secondary' : 'primary'}`;
      tools.append(a);
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav-sections" aria-expanded="false" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => toggleMenu(nav));

  nav.append(brand, sections, tools, hamburger);

  // close panels on escape / focus leaving the nav
  nav.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const open = nav.querySelector('.nav-item[aria-expanded="true"]');
    if (open) {
      setPanelOpen(nav, open, false);
      open.querySelector(':scope > .nav-trigger').focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, false);
      hamburger.querySelector('button').focus();
    }
  });
  nav.addEventListener('focusout', (e) => {
    if (!isDesktop.matches) return;
    const open = nav.querySelector('.nav-item[aria-expanded="true"]');
    if (open && !open.contains(e.relatedTarget)) setPanelOpen(nav, open, false);
  });

  // reset state when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
    toggleMenu(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.textContent = '';
  block.append(navWrapper);
  decorateIcons(nav);
}
