/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs-testimonials
 * Base block: tabs
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Tabs is a 2-column block. Each subsequent row is one tab:
 *   Cell 1: Tab Label (mandatory)
 *   Cell 2: Tab Content (mandatory)
 *
 * Source structure: a .tabs-content container holds the .tab-pane panels
 * (content) and a separate .tab-menu container holds the .tab-menu-link
 * buttons (labels). They are paired by index (data-tab-index / data-tab-target).
 */
export default function parse(element, { document }) {
  // Tab labels (the menu buttons) and tab content panels.
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));
  const panels = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));

  // Empty-block guard.
  if (labels.length === 0 && panels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS (2 columns) ---
  const cells = [];
  const count = Math.max(labels.length, panels.length);
  for (let i = 0; i < count; i += 1) {
    const label = labels[i];
    const panel = panels[i];
    // Use the label's inner content (avatar + name + role) as the tab label.
    // Fall back to an empty cell if a pair is incomplete so rows stay 2-wide.
    const labelCell = label ? Array.from(label.childNodes) : '';
    const contentCell = panel ? panel : '';
    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonials', cells });
  element.replaceWith(block);
}
