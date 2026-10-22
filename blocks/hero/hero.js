/**
 * Hero stage (live .cmp-stage): poster + autoplay muted loop video, headline,
 * sub line, CTAs, then the WLTP disclaimer with its info-i tooltip.
 * Template-slotted: authored nodes are MOVED into empty slot containers.
 * Rows (by content, any order): media (picture + video links), copy (heading,
 * text, CTAs), disclaimer (text cell + optional tooltip cell).
 * @ew-exempt video source links (config: each authored scene7 URL becomes a
 * <source> of the stage video; the link text is never displayed)
 * @param {Element} block The hero block element
 */

// glyphs lifted from the prototype sprite (scripts/icons.js holds the shared set;
// inlined here so the block stays self-contained)
const GLYPHS = {
  info: ['0 0 24 24', '<circle cx="12" cy="12" r="10.5"/><path d="M12 10.5v7"/><circle cx="12" cy="7" r=".6" fill="currentColor"/>'],
  close: ['0 0 24 24', '<path d="M5 5l14 14M19 5L5 19"/>'],
  play: ['0 0 24 24', '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'],
  pause: ['0 0 24 24', '<path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor" stroke="none"/>'],
};

function ico(name, cls = '') {
  const [viewBox, body] = GLYPHS[name];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', cls ? `ico ${cls}` : 'ico');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = body;
  return svg;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isCta(node) {
  const a = node.querySelector('a[href]');
  return !!a && node.textContent.trim() === a.textContent.trim();
}

function closeTips(except) {
  document.querySelectorAll('.infoi.is-open').forEach((tip) => {
    if (tip === except) return;
    tip.classList.remove('is-open');
    tip.querySelector('.infoi-btn')?.setAttribute('aria-expanded', 'false');
  });
}

function buildInfoi(cell) {
  const infoi = el('div', 'infoi');
  const btn = el('button', 'infoi-btn');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Information');
  btn.setAttribute('aria-expanded', 'false');
  btn.append(ico('info'));
  const tip = el('div', 'infoi-tip');
  tip.setAttribute('role', 'tooltip');
  const close = el('button', 'infoi-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.append(ico('close'));
  tip.append(close, ...cell.children);
  infoi.append(btn, tip);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !infoi.classList.contains('is-open');
    closeTips(infoi);
    infoi.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
  close.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTips();
  });
  tip.addEventListener('click', (e) => e.stopPropagation());
  return infoi;
}

function buildDisclaimer(cells) {
  const disclaimer = el('div', 'disclaimer hero-disclaimer');
  const [text, tip] = cells;
  disclaimer.append(...text.children);
  if (tip && tip.textContent.trim()) disclaimer.append(buildInfoi(tip));
  return disclaimer;
}

function buildVideo(links, img) {
  const video = el('video', 'hero-video');
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'auto');
  if (img) {
    video.poster = img.currentSrc || img.src;
    if (img.alt) video.setAttribute('aria-label', img.alt);
  }
  links.forEach((a) => {
    const source = el('source');
    source.src = a.href;
    source.type = /\.m3u8(\?|$)/i.test(a.pathname) ? 'application/vnd.apple.mpegurl' : 'video/mp4';
    video.append(source);
  });
  return video;
}

function buildPlay(video) {
  const play = el('button', 'hero-play');
  play.type = 'button';
  play.setAttribute('aria-label', 'Buton redare');
  play.setAttribute('aria-pressed', 'false');
  const ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  ring.setAttribute('class', 'hero-ring');
  ring.setAttribute('viewBox', '0 0 36 36');
  ring.setAttribute('aria-hidden', 'true');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  [['cx', '18'], ['cy', '18'], ['r', '17'], ['fill', 'none'], ['stroke', '#fff'],
    ['stroke-opacity', '.3'], ['stroke-width', '2']].forEach(([k, v]) => circle.setAttribute(k, v));
  ring.append(circle);
  play.append(ico('play', 'hero-glyph hero-glyph-play'), ico('pause', 'hero-glyph hero-glyph-pause'), ring);
  play.addEventListener('click', () => {
    const paused = play.getAttribute('aria-pressed') === 'true';
    play.setAttribute('aria-pressed', String(!paused));
    if (paused) video.play().catch(() => {});
    else video.pause();
  });
  return play;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-stage')) return;

  const stage = el('div', 'hero-stage');
  const media = el('div', 'hero-media');
  const overlay = el('div', 'hero-overlay');
  const title = el('div', 'hero-title');
  const sub = el('div', 'hero-sub');
  const buttons = el('div', 'hero-buttons');
  const disclaimers = [];
  const videoLinks = [];
  let poster;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const hasHeading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const hasMedia = row.querySelector('picture, img')
      || [...row.querySelectorAll('a[href]')].some((a) => /\.(m3u8|mp4)|\/is\/content\//i.test(a.href));
    if (hasHeading) {
      cells.forEach((cell) => {
        [...cell.children].forEach((child) => {
          if (/^H[1-6]$/.test(child.tagName)) title.append(child);
          else if (isCta(child)) buttons.append(child);
          else sub.append(child);
        });
      });
    } else if (hasMedia) {
      cells.forEach((cell) => {
        [...cell.children].forEach((child) => {
          const pic = child.tagName === 'PICTURE' ? child : child.querySelector('picture');
          const link = child.tagName === 'A' ? child : child.querySelector('a[href]');
          if (pic && !poster) {
            poster = pic;
            media.append(pic);
          } else if (link) {
            videoLinks.push(link);
            child.remove();
          } else if (child.textContent.trim()) {
            sub.append(child);
          }
        });
      });
    } else if (row.textContent.trim()) {
      disclaimers.push(buildDisclaimer(cells));
    }
    row.remove();
  });

  if (videoLinks.length) {
    const video = buildVideo(videoLinks, poster?.querySelector('img'));
    media.append(video, buildPlay(video));
  }
  overlay.append(title);
  if (sub.children.length) overlay.append(sub);
  if (buttons.children.length) overlay.append(buttons);
  stage.append(media, overlay);
  block.append(stage, ...disclaimers);

  if (!window.heroTipsBound) {
    window.heroTipsBound = true;
    document.addEventListener('click', () => closeTips());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTips();
    });
  }
}
