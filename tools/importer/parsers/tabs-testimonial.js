/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/tabs-testimonial): one row per testimonial, two cells -
 *   [tab label: avatar image, bold name, role] | [panel: image, bold name, role, quote paragraph].
 * Selectors validated against migration-work/block-context/tabs-testimonial/source.html:
 *   .tabs-content > .tab-pane (x4, id tabpanel-N), .tab-menu > button.tab-menu-link (x4, id tab-N),
 *   .avatar img, strong (name), role div, p.paragraph-xl (quote), img.cover-image (panel image)
 * Panels are paired with tab buttons by id suffix (tab-N <-> tabpanel-N), falling back to index.
 */

/** Build name (bold) + role paragraphs from a container holding <strong>name</strong> and a role line. */
function buildNameRole(container, document) {
  const out = [];
  if (!container) return out;
  const strong = container.querySelector('strong');
  const name = strong ? strong.textContent.trim() : '';
  if (name) {
    const p = document.createElement('p');
    const s = document.createElement('strong');
    s.textContent = name;
    p.append(s);
    out.push(p);
  }
  // Role: first leaf-level div/span whose text is not the name and has no <strong>
  const role = Array.from(container.querySelectorAll('div, span'))
    .find((el) => !el.querySelector('strong, img, div, p') && !el.closest('strong')
      && el.textContent.trim() && el.textContent.trim() !== name);
  if (role) {
    const p = document.createElement('p');
    p.textContent = role.textContent.trim();
    out.push(p);
  }
  return out;
}

export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane, .tabs-content > [role="tabpanel"]'));
  const tabs = Array.from(element.querySelectorAll('.tab-menu > .tab-menu-link, .tab-menu > [role="tab"]'));

  const tabForPane = (pane, i) => {
    const m = (pane.id || '').match(/(\d+)$/);
    if (m) {
      const byId = tabs.find((t) => (t.id || '').endsWith(`-${m[1]}`));
      if (byId) return byId;
    }
    return tabs[i] || null;
  };

  const cells = [];
  panes.forEach((pane, i) => {
    const tab = tabForPane(pane, i);

    // Label cell: avatar + name + role
    const labelCell = [];
    if (tab) {
      const avatar = tab.querySelector('.avatar img') || tab.querySelector('img');
      if (avatar) labelCell.push(avatar);
      const textWrap = (avatar && avatar.closest('.avatar') && avatar.closest('.avatar').nextElementSibling) || tab;
      labelCell.push(...buildNameRole(textWrap, document));
    }

    // Panel cell: image + name + role + quote
    const panelCell = [];
    const panelImg = pane.querySelector('img');
    if (panelImg) panelCell.push(panelImg);
    const quote = pane.querySelector('p.paragraph-xl') || pane.querySelector('p, blockquote');
    const nameWrap = (() => {
      const strong = pane.querySelector('strong');
      if (!strong) return null;
      // the div that holds both the name line and the role line
      const nameLine = strong.closest('div');
      return (nameLine && nameLine.parentElement) || nameLine;
    })();
    panelCell.push(...buildNameRole(nameWrap, document));
    if (quote) panelCell.push(quote);

    if (!labelCell.length) {
      // No tab button found: fall back to name text so the tab still has a label
      const strong = pane.querySelector('strong');
      if (strong) labelCell.push(strong.textContent.trim());
    }
    if (!panelCell.length) return;
    cells.push([labelCell.length ? labelCell : '', panelCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
