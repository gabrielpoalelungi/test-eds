/* eslint-disable */
/* global WebImporter */

/**
 * Import script: global navigation (header) fragment.
 * Converts the source site's div.navbar into the flat nav fragment consumed by
 * blocks/header/header.js (sections: brand | menu | tools). Output path: /nav
 *
 * Inline SVG icons on the source were extracted to content/images/ as
 * nav-logo.svg and nav-icon-<label>.svg / nav-arrow-right.svg.
 */

const slug = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function img(document, name) {
  const el = document.createElement('img');
  el.src = `images/${name}`;
  el.alt = '';
  return el;
}

function p(document, ...children) {
  const el = document.createElement('p');
  children.forEach((c) => el.append(c));
  return el;
}

function link(document, href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function buildBrand(document, navbar) {
  const logo = navbar.querySelector('a.logo');
  const a = document.createElement('a');
  a.href = logo.getAttribute('href') || '/';
  a.append(img(document, 'nav-logo.svg'), logo.textContent.trim());
  return [p(document, a)];
}

function buildMegaMenu(document, mega) {
  const ul = document.createElement('ul');
  mega.querySelectorAll(':scope .mega-menu-grid > li').forEach((col) => {
    const li = document.createElement('li');
    const heading = col.querySelector('h3');
    if (heading) {
      li.append(p(document, heading.textContent.trim()));
      const items = document.createElement('ul');
      col.querySelectorAll('.mega-nav-link-item').forEach((item) => {
        const title = item.querySelector('strong').textContent.trim();
        const desc = item.querySelector('.paragraph-sm');
        const itemLi = document.createElement('li');
        itemLi.append(
          p(document, img(document, `nav-icon-${slug(title)}.svg`)),
          p(document, link(document, item.getAttribute('href'), title)),
        );
        if (desc) itemLi.append(p(document, desc.textContent.trim()));
        items.append(itemLi);
      });
      li.append(items);
    } else {
      // promo card
      const card = col.querySelector('a');
      // bold paragraph rather than a heading: headings get generated ids in the fragment
      const strong = document.createElement('strong');
      strong.textContent = card.querySelector('.h3-heading').textContent.trim();
      li.append(p(document, strong));
      const text = card.querySelector('p');
      if (text) li.append(p(document, text.textContent.trim()));
      const cta = card.querySelector('.text-button');
      li.append(p(document, link(document, card.getAttribute('href'), cta.textContent.trim()), img(document, 'nav-arrow-right.svg')));
    }
    ul.append(li);
  });
  return ul;
}

function buildMenu(document, navbar) {
  const ul = document.createElement('ul');
  navbar.querySelectorAll('.nav-menu-list > .nav-menu-list-item').forEach((item) => {
    const li = document.createElement('li');
    const trigger = item.querySelector(':scope > .nav-link, :scope > .nav-menu-dropdown > .nav-link');
    const label = trigger.textContent.trim();
    const mega = item.querySelector('.mega-menu');
    const dropdown = item.querySelector('.nav-menu-dropdown-list');
    if (mega) {
      li.append(p(document, label), buildMegaMenu(document, mega));
    } else if (dropdown) {
      const sub = document.createElement('ul');
      dropdown.querySelectorAll('a').forEach((a) => {
        const subLi = document.createElement('li');
        subLi.append(link(document, a.getAttribute('href'), a.textContent.trim()));
        sub.append(subLi);
      });
      li.append(p(document, label), sub);
    } else {
      li.append(p(document, link(document, trigger.getAttribute('href'), label)));
    }
    ul.append(li);
  });
  return [ul];
}

function buildTools(document, navbar) {
  return [...navbar.querySelectorAll('.nav-right a.button')].map((a) => {
    const strong = document.createElement('strong');
    strong.append(link(document, a.getAttribute('href'), a.textContent.trim()));
    return p(document, strong);
  });
}

export default {
  transform: ({ document }) => {
    const navbar = document.querySelector('.navbar');
    const main = document.createElement('div');
    const sections = [buildBrand, buildMenu, buildTools].map((fn) => fn(document, navbar));
    sections.forEach((nodes, i) => {
      if (i > 0) main.append(document.createElement('hr'));
      nodes.forEach((n) => main.append(n));
    });
    document.body.innerHTML = '';
    document.body.append(main);

    return [{
      element: document.body,
      path: '/nav',
      report: { title: 'nav', template: 'nav' },
    }];
  },
};
