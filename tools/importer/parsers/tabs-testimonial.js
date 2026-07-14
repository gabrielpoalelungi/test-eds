/* eslint-disable */
/* global WebImporter */
/** Parser for tabs-testimonial. Base: tabs. Source: https://www.wknd-trendsetters.site/. Generated: 2026-07-14 */
export default function parse(element, { document }) {
  // Tabs block has 2 columns: tab label and tab content
  // Check for tabs structure
  const hasTabsWrapper = element.querySelector('.tabs-wrapper, [class*="tabs"]');
  const hasTabPanes = element.querySelector('.tab-pane, [id*="tabpanel"]');

  if (!hasTabsWrapper || !hasTabPanes) {
    // Not a tabs section
    return;
  }

  const cells = [];

  // Extract tab panels (content)
  const tabPanes = Array.from(element.querySelectorAll('.tab-pane, [id*="tabpanel"]'));

  // Extract tab menu items (labels)
  const tabMenuItems = Array.from(element.querySelectorAll('.tab-menu-link, button[id*="tab-"]'));

  // Match each tab panel with its corresponding menu item
  tabPanes.forEach((pane, index) => {
    // Column 1: Tab label (from menu button)
    let tabLabel = '';
    if (tabMenuItems[index]) {
      const menuItem = tabMenuItems[index];
      const name = menuItem.querySelector('strong, [class*="paragraph"]');
      if (name) {
        tabLabel = name.textContent.trim();
      } else {
        tabLabel = menuItem.textContent.trim().split('\n')[0].trim();
      }
    }

    // Column 2: Tab content (testimonial)
    const tabContent = [];

    // Extract featured image from tab pane
    const image = pane.querySelector('img.cover-image, img');
    if (image) {
      tabContent.push(image.cloneNode(true));
    }

    // Extract name
    const nameElement = pane.querySelector('strong, .paragraph-xl strong');
    if (nameElement) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameElement.textContent.trim();
      p.appendChild(strong);
      tabContent.push(p);
    }

    // Extract role/title (text after name but before quote)
    const roleElements = pane.querySelectorAll('div > div');
    for (const div of roleElements) {
      const text = div.textContent.trim();
      // Skip if it's the name (has strong tag) or empty
      if (text && !div.querySelector('strong') && !text.startsWith('"')) {
        const p = document.createElement('p');
        p.textContent = text;
        tabContent.push(p);
        break;
      }
    }

    // Extract testimonial quote
    const quote = pane.querySelector('p.paragraph-xl, p');
    if (quote && quote.textContent.includes('"')) {
      const p = document.createElement('p');
      p.textContent = quote.textContent.trim();
      tabContent.push(p);
    }

    // Add row if we have both label and content
    if (tabLabel && tabContent.length > 0) {
      cells.push([tabLabel, tabContent]);
    }
  });

  // Create block if we have tabs
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
    element.replaceWith(block);
  }
}
