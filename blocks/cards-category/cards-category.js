import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'cards-category';

// chevron used by the source slider arrows (points right; rotated for "prev")
const CHEVRON = '<svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>';

// categories that get the "Nou" badge when no badge cell is authored
const NEW_SLUGS = ['noutati'];

function normalizePath(path) {
  return path.replace(/\/+$/, '') || '/';
}

function updateScrollButtons(block) {
  const list = block.querySelector(`.${BLOCK}-list`);
  const maxScroll = list.scrollWidth - list.clientWidth;
  block.querySelector(`.${BLOCK}-prev`).disabled = list.scrollLeft <= 1;
  block.querySelector(`.${BLOCK}-next`).disabled = list.scrollLeft >= maxScroll - 1;
  block.classList.toggle(`${BLOCK}-overflowing`, maxScroll > 1);
}

function createBadge(text) {
  const badge = document.createElement('span');
  badge.className = `${BLOCK}-badge`;
  badge.setAttribute('aria-hidden', 'true');
  badge.textContent = text;
  return badge;
}

function createArrow(dir) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${BLOCK}-${dir}`;
  button.setAttribute('aria-label', dir === 'prev' ? 'Scroll categories left' : 'Scroll categories right');
  button.innerHTML = CHEVRON;
  return button;
}

/**
 * Toggles the compact "stuck" state while the bar is pinned under the header.
 * @param {Element} block The block element
 */
function watchStuck(block) {
  const wrapper = block.parentElement;
  let ticking = false;
  const check = () => {
    ticking = false;
    const stickyTop = parseFloat(getComputedStyle(wrapper).top);
    if (Number.isNaN(stickyTop)) return;
    const { top } = wrapper.getBoundingClientRect();
    const stuck = window.scrollY > 0 && top <= stickyTop + 0.5;
    block.classList.toggle(`${BLOCK}-stuck`, stuck);
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(check);
    }
  }, { passive: true });
  check();
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = `${BLOCK}-list`;
  const currentPath = normalizePath(window.location.pathname);

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    item.className = `${BLOCK}-item`;
    const cells = [...row.children];
    let badgeText = '';
    cells.forEach((cell) => {
      if (cell.querySelector('picture') && !cell.textContent.trim()) {
        cell.className = `${BLOCK}-icon`;
        item.append(cell);
      } else if (cell.querySelector('a')) {
        cell.className = `${BLOCK}-label`;
        item.append(cell);
      } else if (cell.textContent.trim()) {
        // optional extra cell: badge text (e.g. "Nou")
        badgeText = cell.textContent.trim();
      }
    });

    const link = item.querySelector('a');
    if (link) {
      link.classList.remove('button', 'primary', 'secondary');
      link.closest('.button-container')?.classList.remove('button-container');
      link.closest('.button-wrapper')?.classList.remove('button-wrapper');
      link.classList.add(`${BLOCK}-link`);
      try {
        const url = new URL(link.href, window.location.href);
        const slug = normalizePath(url.pathname).split('/').pop();
        if (!badgeText && NEW_SLUGS.includes(slug)) badgeText = 'Nou';
        if (url.origin === window.location.origin
          && normalizePath(url.pathname) === currentPath) {
          link.setAttribute('aria-current', 'page');
          item.classList.add(`${BLOCK}-item-active`);
        }
      } catch {
        // ignore malformed hrefs
      }
    }
    if (badgeText) item.prepend(createBadge(badgeText));
    list.append(item);
  });

  // like the source category bar, the first category is selected by default
  if (!list.querySelector(`.${BLOCK}-item-active`)) {
    list.firstElementChild?.classList.add(`${BLOCK}-item-active`);
  }

  list.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });

  const prev = createArrow('prev');
  const next = createArrow('next');

  // move one category per click, like the source slider
  const scroll = (dir) => {
    const item = list.querySelector(`.${BLOCK}-item`);
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = item ? item.offsetWidth + gap : list.clientWidth * 0.8;
    list.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scroll(-1));
  next.addEventListener('click', () => scroll(1));

  block.replaceChildren(prev, list, next);

  list.addEventListener('scroll', () => updateScrollButtons(block), { passive: true });
  new ResizeObserver(() => updateScrollButtons(block)).observe(list);
  watchStuck(block);
}
