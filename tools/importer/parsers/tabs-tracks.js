/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-tracks. Base block: tabs.
 * Source: https://www.hellointerview.com/
 * Generated: 2026-07-20
 *
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - One row per tab: [Tab Label] [Tab Content]
 *
 * Source specifics (validated against source.html):
 *  - Tab labels are <button class="MuiTab-root"> inside .MuiTabs-list
 *    ("Learning Tracks", "Company Guides").
 *  - Only the active tab panel is present in the DOM (MUI renders panels on
 *    demand). The active panel is a grid of track cards, each an
 *    img[alt] + <p class="MuiTypography-body1"> label + chevron icon.
 *  - The section <h3> heading is default content handled outside this block.
 *  - There is a mobile duplicate tab switcher (.MuiButtonGroup-root); we scope
 *    tab labels to .MuiTabs-list to avoid double-selection.
 */
export default function parse(element, { document }) {
  // Tab labels from the primary (desktop) tab list only.
  const tabButtons = Array.from(
    element.querySelectorAll('.MuiTabs-list .MuiTab-root, .MuiTabs-list button'),
  );

  // The rendered tab panel: grid of track cards.
  const trackCards = Array.from(element.querySelectorAll('.MuiCard-root'));

  const cells = [];

  tabButtons.forEach((btn, index) => {
    const label = (btn.textContent || '').trim();
    if (!label) return;

    const labelCell = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label;
    labelCell.appendChild(strong);

    // Only the first (active) tab has its content rendered in the DOM.
    let contentCell = '';
    if (index === 0 && trackCards.length) {
      const list = document.createElement('ul');
      trackCards.forEach((card) => {
        const trackLabel = card.querySelector('.MuiTypography-body1, p');
        const text = trackLabel ? (trackLabel.textContent || '').trim() : '';
        if (!text) return;
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
      if (list.children.length) contentCell = list;
    }

    cells.push([labelCell, contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-tracks', cells });
  element.replaceWith(block);
}
