/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: accordion-faq
 * Base block: accordion
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-07-17
 *
 * Library convention: Accordion is a 2-column block. Each subsequent row is an item:
 *   Cell 1: Title (the clickable question)
 *   Cell 2: Content (the answer body)
 *
 * Source: .faq-list > details.faq-item, each with a summary.faq-question
 * (question text in a <span>, plus a decorative SVG icon) and a .faq-answer div.
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details> element.
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, details.faq-item, details'));

  // Empty-block guard.
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- BUILD CELLS (2 columns) ---
  const cells = [];
  items.forEach((item) => {
    // Question: prefer the text span inside the summary to exclude the SVG icon.
    const questionSpan = item.querySelector('.faq-question span, summary span');
    const summary = item.querySelector('.faq-question, summary');
    const titleCell = questionSpan || (summary ? summary.textContent.trim() : '');

    // Answer body.
    const answer = item.querySelector('.faq-answer');
    const contentCell = answer || '';

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
