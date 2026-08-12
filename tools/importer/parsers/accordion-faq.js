/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://www.hellointerview.com/
 * Generated: 2026-07-20
 *
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - One row per FAQ item: [Title cell] [Content cell].
 *
 * Source specifics (validated against source.html):
 *  - Each item is a .MuiAccordion-root.
 *  - Question title: <h6 class="MuiTypography-h6"> inside .MuiAccordionSummary-content.
 *  - Answer content: .MuiAccordionDetails-root (holds a <p> body that may
 *    contain inline links and <br>). Content is cloned to preserve links.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.MuiAccordion-root'));

  const cells = [];

  items.forEach((item) => {
    // Question title.
    const title = item.querySelector(
      '.MuiAccordionSummary-content h6, .MuiAccordionSummary-content, h6[class*="h6"]',
    );
    // Answer content container.
    const details = item.querySelector('.MuiAccordionDetails-root, [class*="AccordionDetails"]');

    const titleText = title ? (title.textContent || '').trim() : '';
    if (!titleText && !details) return;

    const titleCell = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = titleText;
    titleCell.appendChild(strong);

    // Content cell: preserve the answer markup (links, line breaks).
    let contentCell = '';
    if (details) {
      const frag = document.createElement('div');
      Array.from(details.childNodes).forEach((n) => frag.appendChild(n.cloneNode(true)));
      contentCell = frag;
    }

    cells.push([titleCell, contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
