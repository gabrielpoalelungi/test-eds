// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

const LABEL_OPEN = 'Deschide meniu website';
const LABEL_CLOSE = 'Închide meniu website';
const LABEL_SEARCH_CLOSE = 'Închide căutarea';

/**
 * Fetches the nav fragment: /content first (local preview), then site root (DA/EDS).
 * @returns {Promise<Element|null>} container holding the nav sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  // images in the fragment are relative to the fragment location
  const base = new URL(resp.url);
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), base).href;
    img.loading = 'eager';
  });
  return container;
}

/**
 * Wraps the direct text nodes of an element in a span so they can be styled.
 * @param {Element} el element whose text should be wrapped
 * @param {string} className class for the span
 */
function wrapText(el, className) {
  [...el.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = node.textContent.trim();
      node.replaceWith(span);
    }
  });
}

function setPanelOpen(nav, open) {
  const button = nav.querySelector('.nav-hamburger');
  const panel = nav.querySelector('.nav-panel');
  if (!button || !panel) return;
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-label', open ? LABEL_CLOSE : LABEL_OPEN);
  panel.hidden = !open;
  document.body.classList.toggle('nav-open', open);
  if (!open) {
    panel.querySelectorAll('.nav-drop > button[aria-expanded="true"]').forEach((b) => {
      b.setAttribute('aria-expanded', 'false');
    });
  }
}

function setSearchOpen(nav, open) {
  const search = nav.querySelector('.nav-search');
  if (!search) return;
  search.classList.toggle('is-open', open);
  search.querySelector('.nav-search-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) search.querySelector('input').focus();
}

/**
 * Builds the brand group (logo, separator, location link) from the first section.
 * @param {Element} section first nav section
 */
function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const links = [...section.querySelectorAll('a')];
  links.forEach((a, i) => {
    a.closest('p')?.replaceWith(a);
    if (i === 0) {
      a.className = 'nav-logo';
      a.setAttribute('aria-label', a.querySelector('img')?.alt || 'Home');
      const wrap = document.createElement('div');
      wrap.className = 'nav-logo-wrap';
      wrap.append(a);
      brand.append(wrap);
      return;
    }
    a.className = 'nav-location';
    wrapText(a, 'nav-location-label');
    const imgs = a.querySelectorAll('img');
    imgs[0]?.classList.add('nav-location-pin');
    if (imgs.length > 1) imgs[imgs.length - 1].classList.add('nav-location-arrow');
    const separator = document.createElement('span');
    separator.className = 'nav-separator';
    separator.setAttribute('aria-hidden', 'true');
    brand.append(separator, a);
  });
  return brand;
}

/**
 * Builds the tools group (expandable search, links) from the second section.
 * @param {Element} section second nav section
 * @param {Element} nav nav element
 */
function buildTools(section, nav) {
  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  [...section.children].forEach((p) => {
    const link = p.querySelector('a');
    const icon = p.querySelector('img');
    if (link) {
      link.className = 'nav-tool-link';
      tools.append(link);
    } else if (icon) {
      // search: icon alt is the button label, paragraph text is the placeholder
      const placeholder = p.textContent.trim();
      const search = document.createElement('form');
      search.className = 'nav-search';
      search.setAttribute('role', 'search');
      const firstLink = section.querySelector('a');
      if (firstLink) search.action = firstLink.href;
      const field = document.createElement('div');
      field.className = 'nav-search-field';
      const input = document.createElement('input');
      input.type = 'search';
      input.name = 'q';
      input.placeholder = placeholder;
      input.setAttribute('aria-label', placeholder);
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'nav-search-close';
      close.setAttribute('aria-label', LABEL_SEARCH_CLOSE);
      close.addEventListener('click', () => {
        input.value = '';
        setSearchOpen(nav, false);
      });
      field.append(input, close);
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-search-toggle';
      toggle.setAttribute('aria-label', icon.alt);
      toggle.setAttribute('aria-expanded', 'false');
      icon.alt = '';
      toggle.append(icon);
      toggle.addEventListener('click', () => {
        const isOpen = search.classList.contains('is-open');
        if (isOpen && input.value.trim()) search.requestSubmit();
        else setSearchOpen(nav, !isOpen);
      });
      search.append(field, toggle);
      tools.append(search);
    }
  });

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav-panel');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', LABEL_OPEN);
  hamburger.innerHTML = '<span class="nav-hamburger-line" aria-hidden="true"></span><span class="nav-hamburger-line" aria-hidden="true"></span>';
  hamburger.addEventListener('click', () => {
    setPanelOpen(nav, nav.getAttribute('aria-expanded') !== 'true');
  });
  tools.append(hamburger);
  return tools;
}

/**
 * Turns the pill link list into pills; items with a nested list become dropdown toggles.
 * @param {Element} list pill list
 */
function decoratePills(list) {
  list.className = 'nav-pills';
  [...list.children].forEach((li) => {
    li.className = 'nav-pill';
    const link = li.querySelector(':scope > a');
    const icon = li.querySelector(':scope > img, :scope > a > img');
    const sub = li.querySelector(':scope > ul');
    if (!link) return;
    if (icon) {
      icon.classList.add('nav-pill-icon');
      link.prepend(icon);
    }
    wrapText(link, 'nav-pill-label');
    if (link.hostname && link.hostname !== window.location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    if (sub) {
      li.classList.add('nav-drop');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-pill-link';
      button.setAttribute('aria-expanded', 'false');
      button.append(...link.childNodes);
      const chevron = li.querySelector(':scope > img');
      if (chevron) {
        chevron.className = 'nav-pill-chevron';
        button.append(chevron);
      }
      link.replaceWith(button);
      sub.className = 'nav-drop-list';
      sub.setAttribute('aria-label', `Submeniu ${button.textContent.trim()}`);
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        list.querySelectorAll('.nav-drop > button').forEach((b) => b.setAttribute('aria-expanded', 'false'));
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    } else {
      link.className = 'nav-pill-link';
    }
  });
}

/**
 * Builds the full-screen menu panel from the remaining sections.
 * @param {Element[]} sections pill section, category section, promo section
 */
function buildPanel([pillSection, listSection, promoSection]) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.id = 'nav-panel';
  panel.hidden = true;
  const inner = document.createElement('div');
  inner.className = 'nav-panel-inner';
  panel.append(inner);

  const pills = pillSection?.querySelector('ul');
  if (pills) {
    decoratePills(pills);
    inner.append(pills);
  }

  const body = document.createElement('div');
  body.className = 'nav-panel-body';
  const categories = listSection?.querySelector('ul');
  if (categories) {
    categories.className = 'nav-categories';
    categories.querySelectorAll('a').forEach((a) => {
      a.className = 'nav-category';
      a.querySelector('img')?.classList.add('nav-category-icon');
      wrapText(a, 'nav-category-label');
    });
    body.append(categories);
  }

  let version;
  if (promoSection) {
    // each promo starts with an image paragraph; one promo is shown at random
    const promos = [];
    [...promoSection.children].forEach((el) => {
      if (el.querySelector('em') && !el.querySelector('a, img')) {
        version = el;
        version.className = 'nav-version';
        return;
      }
      if (el.querySelector('img') && !el.querySelector('a')) {
        const promo = document.createElement('div');
        promo.className = 'nav-promo';
        const footer = document.createElement('div');
        footer.className = 'nav-promo-footer';
        el.className = 'nav-promo-image';
        promo.append(el, footer);
        promos.push(promo);
        return;
      }
      const footer = promos.at(-1)?.querySelector('.nav-promo-footer');
      if (!footer) return;
      if (el.querySelector('a')) {
        el.className = 'nav-promo-cta';
        const icons = el.querySelectorAll('a img');
        icons[0]?.classList.add('nav-promo-cta-icon');
        if (icons.length > 1) icons[icons.length - 1].classList.add('nav-promo-cta-arrow');
      } else {
        el.classList.add('nav-promo-title');
      }
      footer.append(el);
    });
    const shown = Math.floor(Math.random() * promos.length);
    promos.forEach((promo, i) => {
      promo.hidden = i !== shown;
      body.append(promo);
    });
  }
  inner.append(body);
  if (version) inner.append(version);
  return panel;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.children].filter((el) => el.tagName === 'DIV');
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Navigare principală');
  nav.setAttribute('aria-expanded', 'false');

  const bar = document.createElement('div');
  bar.className = 'nav-bar';
  if (sections[0]) bar.append(buildBrand(sections[0]));
  if (sections[1]) bar.append(buildTools(sections[1], nav));
  nav.append(bar);
  nav.append(buildPanel(sections.slice(2)));

  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (nav.querySelector('.nav-search.is-open')) setSearchOpen(nav, false);
    else if (nav.getAttribute('aria-expanded') === 'true') {
      setPanelOpen(nav, false);
      nav.querySelector('.nav-hamburger').focus();
    }
  });

  // reset open states when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    setPanelOpen(nav, false);
    setSearchOpen(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
