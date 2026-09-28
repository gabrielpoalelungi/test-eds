import { createOptimizedPicture } from '../../scripts/aem.js';

let instanceCount = 0;

/**
 * Replaces an authored picture with an optimized one.
 * @param {Element} picture The picture element
 * @param {string} width Target width
 * @returns {Element} The optimized picture
 */
function optimize(picture, width) {
  const img = picture.querySelector('img');
  if (!img) return picture;
  const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width }]);
  picture.replaceWith(optimized);
  return optimized;
}

/**
 * Builds the tab button content: avatar + text lines (phrasing content only).
 * @param {Element} labelCell The authored tab label cell
 * @param {number} index Tab index (fallback label)
 * @param {number} [maxLines] Maximum number of text lines to copy
 * @returns {DocumentFragment}
 */
function buildTabContent(labelCell, index, maxLines = Infinity) {
  const fragment = document.createDocumentFragment();
  const picture = labelCell && labelCell.querySelector('picture');
  if (picture) {
    const avatar = document.createElement('span');
    avatar.className = 'tabs-testimonial-avatar';
    avatar.append(optimize(picture, '96'));
    fragment.append(avatar);
  }
  const text = document.createElement('span');
  text.className = 'tabs-testimonial-tab-text';
  const lines = labelCell
    ? [...labelCell.children].filter((el) => el.textContent.trim())
    : [];
  if (!lines.length && labelCell && labelCell.textContent.trim()) {
    lines.push(labelCell);
  }
  lines.slice(0, maxLines).forEach((line) => {
    const span = document.createElement('span');
    span.className = 'tabs-testimonial-tab-line';
    span.innerHTML = line === labelCell ? line.textContent.trim() : line.innerHTML;
    span.querySelectorAll('picture').forEach((p) => p.remove());
    text.append(span);
  });
  if (!text.children.length) text.textContent = `Tab ${index + 1}`;
  fragment.append(text);
  return fragment;
}

/**
 * Structures a panel cell into image + body.
 * @param {Element} panel The panel element
 */
function decoratePanel(panel) {
  const picture = panel.querySelector('picture');
  const body = document.createElement('div');
  body.className = 'tabs-testimonial-pane-body';
  if (picture) {
    const media = document.createElement('div');
    media.className = 'tabs-testimonial-pane-image';
    const parent = picture.parentElement;
    media.append(optimize(picture, '750'));
    if (parent !== panel && !parent.textContent.trim() && !parent.children.length) {
      parent.remove();
    }
    body.append(...panel.childNodes);
    panel.replaceChildren(media, body);
    panel.classList.add('tabs-testimonial-pane-has-image');
  } else {
    body.append(...panel.childNodes);
    panel.replaceChildren(body);
  }
}

/**
 * loads and decorates the tabs-testimonial block
 * Content contract: one row per testimonial, two cells -
 * [tab label: avatar, name, role] | [panel: image, name, role, quote].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  instanceCount += 1;
  const prefix = `tabs-testimonial-${instanceCount}`;

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panes';
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const buttons = [];
  const tabpanels = [];

  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells.length > 1 ? cells[0] : null;
    const panelCell = cells.length > 1 ? cells[1] : cells[0];
    if (!panelCell) return;

    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-pane';
    panel.id = `${prefix}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${prefix}-tab-${i}`);
    panel.append(...panelCell.childNodes);
    decoratePanel(panel);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-testimonial-tab';
    button.id = `${prefix}-tab-${i}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    // fall back to the panel's first line when no label cell was authored
    if (labelCell) {
      button.append(buildTabContent(labelCell, i));
    } else {
      button.append(buildTabContent(panel.querySelector('.tabs-testimonial-pane-body'), i, 2));
    }

    panels.append(panel);
    tablist.append(button);
    buttons.push(button);
    tabpanels.push(panel);
  });

  const activate = (index) => {
    buttons.forEach((btn, j) => {
      const selected = j === index;
      btn.setAttribute('aria-selected', selected);
      btn.tabIndex = selected ? 0 : -1;
      tabpanels[j].hidden = !selected;
    });
  };

  buttons.forEach((btn, i) => btn.addEventListener('click', () => activate(i)));

  tablist.addEventListener('keydown', (e) => {
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    const last = buttons.length - 1;
    const keys = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    activate(keys[e.key]);
    buttons[keys[e.key]].focus();
  });

  if (buttons.length) activate(0);
  block.replaceChildren(panels, tablist);
}
