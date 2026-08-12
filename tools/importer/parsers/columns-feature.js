/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-feature
 * Base block: columns
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Columns is a flexible multi-column block.
 *   Row 1: block name (added by createBlock)
 *   Row 2+: one cell per visual column.
 * Source has a single .grid-layout row with two direct children: an image
 * column and a content column (breadcrumbs, heading, author meta).
 */
export default function parse(element, { document }) {
  // The columns live as direct children of the grid-layout container.
  const grid = element.querySelector('.grid-layout') || element.querySelector(':scope > div');
  const columnSource = grid || element;

  // Each direct child div is one column.
  const columns = Array.from(columnSource.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS ---
  // Single content row; one cell per column, preserving each column's content.
  const cells = [];
  cells.push(columns.map((col) => col));

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
