import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'carousel-offers';

const ARROW_SVG = '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false"><path d="M12.0524 7.71741L8.28595 11.4839C8.20742 11.5624 8.10091 11.6066 7.98986 11.6066C7.8788 11.6066 7.7723 11.5624 7.69377 11.4839C7.61524 11.4054 7.57113 11.2989 7.57113 11.1878C7.57113 11.0768 7.61524 10.9703 7.69377 10.8917L10.7462 7.83982H2.54936C2.43837 7.83982 2.33192 7.79573 2.25344 7.71724C2.17495 7.63876 2.13086 7.53231 2.13086 7.42132C2.13086 7.31032 2.17495 7.20388 2.25344 7.12539C2.33192 7.04691 2.43837 7.00282 2.54936 7.00282H10.7462L7.69377 3.95091C7.61524 3.87238 7.57113 3.76587 7.57113 3.65482C7.57113 3.54376 7.61524 3.43726 7.69377 3.35873C7.7723 3.2802 7.8788 3.23608 7.98986 3.23608C8.10091 3.23608 8.20742 3.2802 8.28595 3.35873L12.0524 7.12523C12.0914 7.1641 12.1222 7.21025 12.1433 7.26106C12.1643 7.31186 12.1752 7.36632 12.1752 7.42132C12.1752 7.47631 12.1643 7.53077 12.1433 7.58158C12.1222 7.63238 12.0914 7.67854 12.0524 7.71741Z"/></svg>';

function decorateContent(content) {
  const link = content.querySelector('a');
  if (link) {
    link.classList.add(`${BLOCK}-link`);
    const holder = link.closest('h1, h2, h3, h4, h5, h6, p');
    if (holder) holder.classList.add(`${BLOCK}-title`);
  }
  // any remaining plain paragraph (e.g. availability note) is rendered as a badge
  content.querySelectorAll(':scope > p').forEach((p) => {
    if (!p.querySelector('a') && p.textContent.trim()) p.classList.add(`${BLOCK}-badge`);
  });
  // decorative round arrow button next to the title
  const arrow = document.createElement('span');
  arrow.className = `${BLOCK}-arrow`;
  arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = ARROW_SVG;
  content.append(arrow);
}

function createSlide(row, idx) {
  const slide = document.createElement('li');
  slide.className = `${BLOCK}-slide`;
  slide.dataset.slideIndex = idx;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  // availability strip above the card (always present to keep cards aligned)
  const availability = document.createElement('div');
  availability.className = `${BLOCK}-availability`;
  const card = document.createElement('div');
  card.className = `${BLOCK}-card`;

  [...row.children].forEach((cell) => {
    const isImage = cell.querySelector('picture') && !cell.textContent.trim();
    cell.className = isImage ? `${BLOCK}-slide-image` : `${BLOCK}-slide-content`;
    if (!isImage) decorateContent(cell);
    card.append(cell);
  });

  card.querySelectorAll(`.${BLOCK}-slide-image picture > img`).forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  const badge = card.querySelector(`.${BLOCK}-badge`);
  if (badge) {
    slide.classList.add(`${BLOCK}-slide-selected`);
    const icon = document.createElement('img');
    icon.className = `${BLOCK}-badge-icon`;
    icon.src = `${window.hlx?.codeBasePath || ''}/blocks/${BLOCK}/selected-locations.svg`;
    icon.alt = '';
    icon.width = 59;
    icon.height = 56;
    icon.loading = 'lazy';
    availability.append(badge, icon);
  }

  // "see all offers" card: outlined, transparent content area
  const title = card.querySelector(`.${BLOCK}-title`);
  const image = card.querySelector(`.${BLOCK}-slide-image img`);
  if ((title && /^vezi\s+toate/i.test(title.textContent.trim()))
    || (image && image.alt === 'see-more')) {
    slide.classList.add(`${BLOCK}-slide-see-more`);
  }

  slide.append(availability, card);
  return slide;
}

function updateButtons(block) {
  const track = block.querySelector(`.${BLOCK}-track`);
  const prev = block.querySelector(`.${BLOCK}-prev`);
  const next = block.querySelector(`.${BLOCK}-next`);
  if (!prev || !next) return;
  const maxScroll = track.scrollWidth - track.clientWidth;
  prev.disabled = track.scrollLeft <= 1;
  next.disabled = track.scrollLeft >= maxScroll - 1;
  block.classList.toggle(`${BLOCK}-static`, maxScroll <= 1);
}

function scrollByCard(block, direction) {
  const track = block.querySelector(`.${BLOCK}-track`);
  const slide = track.querySelector(`.${BLOCK}-slide`);
  if (!slide) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  track.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: 'smooth' });
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');

  const track = document.createElement('ul');
  track.className = `${BLOCK}-track`;
  rows.forEach((row, idx) => track.append(createSlide(row, idx)));

  const stage = document.createElement('div');
  stage.className = `${BLOCK}-stage`;
  stage.append(track);
  block.replaceChildren(stage);

  if (rows.length > 1) {
    const controls = document.createElement('div');
    controls.className = `${BLOCK}-controls`;
    [['prev', 'Previous slide', -1], ['next', 'Next slide', 1]].forEach(([name, label, dir]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `${BLOCK}-${name}`;
      button.setAttribute('aria-label', label);
      button.addEventListener('click', () => scrollByCard(block, dir));
      controls.append(button);
    });
    stage.append(controls);

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateButtons(block);
        ticking = false;
      });
    }, { passive: true });
    new ResizeObserver(() => updateButtons(block)).observe(track);
  }
}
