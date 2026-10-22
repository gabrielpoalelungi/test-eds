import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'carousel-hero';
const AUTOPLAY_DELAY = 10000;
let instanceId = 0;

function updateActiveSlide(block, slideIndex) {
  block.dataset.activeSlide = slideIndex;
  block.querySelectorAll(`.${BLOCK}-slide`).forEach((slide, idx) => {
    const active = idx === slideIndex;
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
  let index = slideIndex;
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  const track = block.querySelector(`.${BLOCK}-track`);
  track.scrollTo({ top: 0, left: slides[index].offsetLeft, behavior: 'smooth' });
}

/**
 * Creates a decorative icon image shipped with the block.
 * @param {string} name icon file name (without extension)
 * @param {string} position left|right
 */
function createIcon(name, position) {
  const img = document.createElement('img');
  img.src = `${window.hlx?.codeBasePath || ''}/blocks/${BLOCK}/${name}.svg`;
  img.alt = '';
  img.width = 21;
  img.height = 21;
  img.loading = 'lazy';
  img.setAttribute('aria-hidden', 'true');
  img.className = `${BLOCK}-icon-${position}`;
  return img;
}

/**
 * Turns an authored CTA link into the white KFC pill with a leading
 * storefront icon and a trailing arrow.
 * @param {HTMLAnchorElement} a
 */
function decorateCta(a) {
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  a.classList.add('kfc-button', 'is-white', `${BLOCK}-button`);
  const label = document.createElement('span');
  label.className = `${BLOCK}-label`;
  label.textContent = a.textContent.trim();
  a.replaceChildren(createIcon('storefront', 'left'), label, createIcon('arrow-right', 'right'));
}

/**
 * Groups the slide copy: heading/text/CTA go into a vertically centred text
 * block, small-print paragraphs after the CTA go into a legal block pinned to
 * the bottom of the slide.
 * @param {Element} content The slide content cell
 */
function decorateContent(content) {
  const children = [...content.children];
  const isCta = (el) => el.tagName === 'P' && el.querySelector('a')
    && el.textContent.trim() === [...el.querySelectorAll('a')].map((a) => a.textContent).join('').trim();
  const lastCtaIdx = children.findLastIndex(isCta);

  const text = document.createElement('div');
  text.className = `${BLOCK}-slide-text`;
  const legal = document.createElement('div');
  legal.className = `${BLOCK}-legal`;

  children.forEach((el, idx) => {
    if (lastCtaIdx >= 0 && idx > lastCtaIdx && el.tagName === 'P' && !el.querySelector('a, picture')) {
      el.classList.add(`${BLOCK}-disclaimer`);
      legal.append(el);
      return;
    }
    if (isCta(el)) {
      el.classList.remove('button-container', 'button-wrapper');
      el.classList.add(`${BLOCK}-cta`);
      el.querySelectorAll('a').forEach(decorateCta);
    }
    text.append(el);
  });

  const body = document.createElement('div');
  body.className = `${BLOCK}-slide-body`;
  body.append(text);
  if (legal.children.length) body.append(legal);
  content.replaceChildren(body);
}

function createSlide(row, idx, id) {
  const slide = document.createElement('li');
  slide.className = `${BLOCK}-slide`;
  slide.id = `${BLOCK}-${id}-slide-${idx}`;
  slide.dataset.slideIndex = idx;

  [...row.children].forEach((cell, cellIdx) => {
    const isImage = cell.querySelector('picture') && !cell.textContent.trim();
    cell.className = isImage || (cellIdx === 0 && cell.querySelector('picture'))
      ? `${BLOCK}-slide-image`
      : `${BLOCK}-slide-content`;
    if (cell.classList.contains(`${BLOCK}-slide-content`)) decorateContent(cell);
    slide.append(cell);
  });

  slide.querySelectorAll(`.${BLOCK}-slide-image picture > img`).forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, idx === 0, [
        { media: '(min-width: 900px)', width: '1200' },
        { width: '750' },
      ]),
    );
  });

  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading?.id) slide.setAttribute('aria-labelledby', heading.id);
  return slide;
}

/**
 * Source parity: the slider advances every 10s and wraps to the first slide;
 * autoplay stops for good once the user interacts with the carousel.
 * @param {Element} block
 */
function startAutoplay(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const timer = setInterval(() => {
    if (document.hidden) return;
    showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
  }, AUTOPLAY_DELAY);
  const stop = () => clearInterval(timer);
  ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach((type) => {
    block.addEventListener(type, stop, { once: true, passive: true });
  });
}

function bindEvents(block) {
  block.querySelector(`.${BLOCK}-indicators`).addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const idx = [...block.querySelectorAll(`.${BLOCK}-indicator button`)].indexOf(button);
    if (idx >= 0) showSlide(block, idx);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveSlide(block, parseInt(entry.target.dataset.slideIndex, 10));
      }
    });
  }, { root: block.querySelector(`.${BLOCK}-track`), threshold: 0.5 });
  block.querySelectorAll(`.${BLOCK}-slide`).forEach((slide) => observer.observe(slide));
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
    block.append(nav);
    bindEvents(block);
    startAutoplay(block);
  }
  updateActiveSlide(block, 0);
}
