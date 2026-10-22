/*
 * Inline SVG icons (stroke glyphs) replacing the licensed bmw_next_icons font.
 * Shared by the header, footer and page blocks: ico(name) returns a fresh <svg class='ico'>.
 */
const ICONS = {
  'chevron-down': ['0 0 24 24', '<path d="M5.5 9l6.5 6.5L18.5 9"/>'],
  'chevron-left': ['0 0 24 24', '<path d="M15 5.5L8.5 12l6.5 6.5"/>'],
  'chevron-right': ['0 0 24 24', '<path d="M9 5.5l6.5 6.5L9 18.5"/>'],
  info: ['0 0 24 24', '<circle cx="12" cy="12" r="10.5"/><path d="M12 10.5v7"/><circle cx="12" cy="7" r=".6" fill="currentColor"/>'],
  close: ['0 0 24 24', '<path d="M5 5l14 14M19 5L5 19"/>'],
  person: ['0 0 24 24', '<circle cx="12" cy="8" r="4.5"/><path d="M3.5 21.5c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8"/>'],
  cart: ['0 0 24 24', '<path d="M1.5 3.5h3.2l2.6 12h12.2l2.6-9H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>'],
  heart: ['0 0 24 24', '<path d="M12 20.5s-8.5-5.2-9.6-10.6C1.7 6.4 4 3.5 7.2 3.5c2.2 0 3.8 1.3 4.8 3 1-1.7 2.6-3 4.8-3 3.2 0 5.5 2.9 4.8 6.4C20.5 15.3 12 20.5 12 20.5z"/>'],
  pin: ['0 0 24 24', '<path d="M12 22s-7.5-7-7.5-12.5a7.5 7.5 0 0 1 15 0C19.5 15 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.7"/>'],
  menu: ['0 0 24 24', '<path d="M3 6h18M3 12h18M3 18h18"/>'],
  bubbles: ['0 0 24 24', '<path d="M3 4.5h12.5v8.5H8.5L5 16v-3H3z"/><path d="M17.5 8.5H21V17h-2v3l-3.5-3H10v-2"/>'],
  'car-double': ['0 0 64 64', '<path d="M14 30l4-10c.6-1.5 2-2.5 3.6-2.5h20.8c1.6 0 3 1 3.6 2.5l4 10"/><path d="M10 30h44c1.7 0 3 1.3 3 3v12H7V33c0-1.7 1.3-3 3-3z"/><path d="M11 45v5h7v-5M46 45v5h7v-5"/><circle cx="16" cy="37.5" r="2.5"/><circle cx="48" cy="37.5" r="2.5"/><path d="M26 39h12"/><path d="M20 14l2.5-5c.5-1 1.6-1.5 2.7-1.5h20.6c1.6 0 3 1 3.6 2.5L53 20h3c1.7 0 3 1.3 3 3v12h-2"/>'],
  'car-search': ['0 0 64 64', '<path d="M10 31l4-10c.6-1.5 2-2.5 3.6-2.5h18"/><path d="M6 31h22M6 31c-1.7 0-3 1.3-3 3v12h30"/><path d="M7 46v5h7v-5"/><circle cx="12" cy="38.5" r="2.5"/><circle cx="46" cy="24" r="11"/><path d="M54 32l8 8"/>'],
  'car-add': ['0 0 64 64', '<path d="M12 32l4-10c.6-1.5 2-2.5 3.6-2.5h16"/><path d="M8 32h28M8 32c-1.7 0-3 1.3-3 3v12h34"/><path d="M9 47v5h7v-5"/><circle cx="14" cy="39.5" r="2.5"/><circle cx="48" cy="22" r="11"/><path d="M48 16v12M42 22h12"/>'],
  play: ['0 0 24 24', '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'],
  pause: ['0 0 24 24', '<path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor" stroke="none"/>'],
};

/**
 * Creates an inline SVG icon.
 * @param {string} name icon name (e.g. 'chevron-down')
 * @param {string} [cls] extra class names
 * @returns {SVGElement}
 */
export default function ico(name, cls = '') {
  const [viewBox, body] = ICONS[name] || ICONS.close;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `ico${cls ? ` ${cls}` : ''}`);
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = body;
  return svg;
}
