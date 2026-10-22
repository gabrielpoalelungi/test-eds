import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'carousel-campaigns';
let instanceId = 0;

function updateActiveSlide(block, slideIndex) {
  if (block.dataset.activeSlide === String(slideIndex)) return;
  block.dataset.activeSlide = slideIndex;
  block.querySelectorAll(`.${BLOCK}-slide`).forEach((slide, idx) => {
    const active = idx === slideIndex;
    slide.classList.toggle(`${BLOCK}-slide-active`, active);
    slide.setAttribute('aria-hidden', !active);
    slide.querySelectorAll('a').forEach((link) => {
      if (active) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', '-1');
    });
  });
  block.querySelectorAll(`.${BLOCK}-indicator button`).forEach((button, idx) => {
    if (idx === slideIndex) {
      button.setAttribute('disabled', '');
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    }
  });
}

function showSlide(block, slideIndex) {
  const slides = block.querySelectorAll(`.${BLOCK}-slide`);
  const slide = slides[Math.max(0, Math.min(slideIndex, slides.length - 1))];
  const track = block.querySelector(`.${BLOCK}-track`);
  // slides snap to the centre so the neighbours peek in on both sides
  const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  track.scrollTo({ top: 0, left, behavior: 'smooth' });
}

/** index of the slide whose centre is closest to the centre of the track */
function getCentredSlide(block) {
  const track = block.querySelector(`.${BLOCK}-track`);
  const centre = track.scrollLeft + track.clientWidth / 2;
  let closest = 0;
  let distance = Infinity;
  block.querySelectorAll(`.${BLOCK}-slide`).forEach((slide, idx) => {
    const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre);
    if (d < distance) {
      distance = d;
      closest = idx;
    }
  });
  return closest;
}

function createIcon() {
  const img = document.createElement('img');
  img.src = `${window.hlx?.codeBasePath || ''}/blocks/${BLOCK}/arrow-right.svg`;
  img.alt = '';
  img.width = 16;
  img.height = 16;
  img.loading = 'lazy';
  img.setAttribute('aria-hidden', 'true');
  img.className = `${BLOCK}-cta-icon`;
  return img;
}

/**
 * Turns the authored CTA link into the KFC white outline pill with a trailing arrow.
 * @param {HTMLAnchorElement} a
 */
function decorateCta(a) {
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  a.classList.add('kfc-button', 'is-white-outline', 'is-medium', `${BLOCK}-cta-link`);
  const label = document.createElement('span');
  label.textContent = a.textContent.trim();
  a.replaceChildren(label, createIcon());
}

/** a paragraph is a CTA when it holds only a link */
function isCtaParagraph(el) {
  const link = el.querySelector('a');
  return link && el.textContent.trim() === link.textContent.trim();
}

function createSlide(row, idx, id) {
  const slide = document.createElement('li');
  slide.className = `${BLOCK}-slide`;
  slide.id = `${BLOCK}-${id}-slide-${idx}`;
  slide.dataset.slideIndex = idx;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  const card = document.createElement('div');
  card.className = `${BLOCK}-card`;

  const body = document.createElement('div');
  body.className = `${BLOCK}-body`;
  const cta = document.createElement('div');
  cta.className = `${BLOCK}-cta`;
  let heading = null;
  let image = null;

  [...row.children].forEach((cell) => {
    const isImage = cell.querySelector('picture') && !cell.textContent.trim();
    if (isImage) {
      cell.className = `${BLOCK}-image`;
      image = cell;
      return;
    }
    [...cell.children].forEach((el) => {
      if (!heading && /^H[1-6]$/.test(el.tagName)) {
        heading = el;
        el.classList.add(`${BLOCK}-headline`);
      } else if (isCtaParagraph(el)) {
        el.querySelectorAll('a').forEach(decorateCta);
        cta.append(el);
      } else {
        body.append(el);
      }
    });
  });

  if (heading) card.append(heading);
  if (body.children.length) card.append(body);
  if (cta.children.length) card.append(cta);
  if (image) {
    image.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    });
    card.append(image);
  } else {
    card.classList.add(`${BLOCK}-card-no-image`);
  }

  slide.append(card);
  if (heading?.id) slide.setAttribute('aria-labelledby', heading.id);
  return slide;
}

function bindEvents(block) {
  const track = block.querySelector(`.${BLOCK}-track`);
  block.querySelectorAll(`.${BLOCK}-indicator button`).forEach((button, idx) => {
    button.addEventListener('click', () => showSlide(block, idx));
  });

  // clicking a peeking neighbour brings it to the centre
  block.querySelectorAll(`.${BLOCK}-slide`).forEach((slide, idx) => {
    slide.addEventListener('click', (e) => {
      if (slide.classList.contains(`${BLOCK}-slide-active`)) return;
      e.preventDefault();
      showSlide(block, idx);
    });
  });

  let frame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => updateActiveSlide(block, getCentredSlide(block)));
  }, { passive: true });
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  instanceId += 1;
  const rows = [...block.children];
  if (!rows.length) return;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');

  const track = document.createElement('ul');
  track.className = `${BLOCK}-track`;
  rows.forEach((row, idx) => track.append(createSlide(row, idx, instanceId)));

  const stage = document.createElement('div');
  stage.className = `${BLOCK}-stage`;
  stage.append(track);
  block.replaceChildren(stage);

  if (rows.length > 1) {
    const nav = document.createElement('nav');
    nav.className = `${BLOCK}-nav`;
    nav.setAttribute('aria-label', 'Carousel slide controls');
    const indicators = document.createElement('ol');
    indicators.className = `${BLOCK}-indicators`;
    rows.forEach((_, idx) => {
      const li = document.createElement('li');
      li.className = `${BLOCK}-indicator`;
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Show slide ${idx + 1} of ${rows.length}`);
      button.setAttribute('aria-controls', `${BLOCK}-${instanceId}-slide-${idx}`);
      li.append(button);
      indicators.append(li);
    });
    nav.append(indicators);
    stage.append(nav);
    bindEvents(block);
  }
  updateActiveSlide(block, 0);
}
