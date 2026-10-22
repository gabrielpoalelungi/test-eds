/**
 * Fetches the footer fragment: /content first (local preview), then site root (DA/EDS).
 * @returns {Promise<Element|null>} container holding the footer sections
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  // images in the fragment are relative to the fragment location
  const base = new URL(resp.url);
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), base).href;
    img.loading = 'lazy';
  });
  return container;
}

/**
 * Opens off-site links in a new tab.
 * @param {Element} root element containing links
 */
function decorateLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.href, window.location.href);
    const external = url.hostname !== window.location.hostname && !url.hostname.endsWith('kfc.ro');
    if (external) a.target = '_blank';
    if (a.target === '_blank') a.rel = 'noopener';
  });
}

/**
 * Builds a link column from a section with a heading.
 * @param {Element} section footer section
 */
function buildColumn(section) {
  const column = document.createElement('nav');
  column.className = 'footer-column';
  const heading = section.querySelector('h2');
  if (heading) {
    heading.className = 'footer-column-title';
    column.setAttribute('aria-label', heading.textContent.trim());
  }
  const lists = section.querySelectorAll(':scope > ul');
  if (lists.length > 1) {
    const group = document.createElement('div');
    group.className = 'footer-link-columns';
    group.append(...lists);
    section.append(group);
  }
  // consecutive image-link paragraphs (badges) sit on one row
  let badges = null;
  [...section.children].forEach((el) => {
    const isBadge = el.tagName === 'P' && el.querySelector('a > img') && !el.textContent.trim();
    if (isBadge) {
      if (!badges) {
        badges = document.createElement('div');
        badges.className = 'footer-badges';
        el.before(badges);
      }
      badges.append(el);
    } else {
      badges = null;
    }
  });
  section.querySelectorAll(':scope > p').forEach((p) => p.classList.add('footer-text'));
  column.append(...section.childNodes);
  return column;
}

/**
 * Builds the bottom band: brand logo, brand marks and social icons.
 * @param {Element} section footer section
 */
function buildBottom(section) {
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const logo = document.createElement('div');
  logo.className = 'footer-logo';
  const marks = document.createElement('div');
  marks.className = 'footer-marks';
  [...section.children].forEach((el) => {
    if (el.tagName === 'UL') {
      el.className = 'footer-social';
      el.querySelectorAll('a').forEach((a) => a.setAttribute('aria-label', a.querySelector('img')?.alt || a.href));
    } else if (el.querySelector('a > img')) {
      logo.append(el);
    } else if (el.querySelector('img')) {
      el.className = 'footer-mark';
      marks.append(el);
    }
  });
  bottom.append(logo, marks, ...section.querySelectorAll('.footer-social'));
  return bottom;
}

/**
 * Builds the floating back-to-top button from a section holding a "#" link.
 * @param {Element} section footer section
 */
function buildBackToTop(section) {
  const link = section.querySelector('a');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'footer-back-to-top';
  button.setAttribute('aria-label', link.textContent.trim());
  const icon = link.querySelector('img');
  if (icon) button.append(icon);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const toggle = () => button.classList.toggle('is-visible', window.scrollY > 300);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  return button;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  const top = document.createElement('div');
  top.className = 'footer-top';
  let backToTop;

  [...fragment.children].filter((el) => el.tagName === 'DIV').forEach((section) => {
    const links = section.querySelectorAll('a');
    if (section.querySelector('h2')) {
      top.append(buildColumn(section));
    } else if (links.length === 1 && links[0].getAttribute('href') === '#') {
      backToTop = buildBackToTop(section);
    } else {
      inner.append(buildBottom(section));
    }
  });

  inner.prepend(top);
  decorateLinks(inner);
  block.append(inner);
  if (backToTop) block.append(backToTop);
}
