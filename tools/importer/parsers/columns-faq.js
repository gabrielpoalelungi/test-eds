/* eslint-disable */
/* global WebImporter */
/** Parser for columns-faq. Base: columns. Source: https://www.wknd-trendsetters.site/. Generated: 2026-07-14 */
export default function parse(element, { document }) {
  // This is a 2-column layout with FAQ intro on left and FAQ items on right
  // Look for FAQ indicators
  const hasFaqList = element.querySelector('.faq-list, details.faq-item, [class*="faq"]');

  if (!hasFaqList) {
    // Not an FAQ section
    return;
  }

  const cells = [];

  // Column 1: Heading and intro text
  const introCell = [];

  // Find the intro section (usually in the first child of grid-layout)
  const gridLayout = element.querySelector('.grid-layout');
  if (gridLayout) {
    const introSection = gridLayout.querySelector(':scope > div:first-child');
    if (introSection) {
      // Extract heading
      const heading = introSection.querySelector('h2, h1, [class*="heading"]');
      if (heading) {
        introCell.push(heading.cloneNode(true));
      }

      // Extract description
      const description = introSection.querySelector('p, .subheading, [class*="subtitle"]');
      if (description) {
        introCell.push(description.cloneNode(true));
      }
    }
  }

  // Column 2: FAQ items
  const faqCell = [];

  // Extract all FAQ details elements
  const faqItems = Array.from(element.querySelectorAll('details.faq-item, details'));

  faqItems.forEach((details) => {
    // Extract question from summary
    const summary = details.querySelector('summary');
    if (summary) {
      const questionText = summary.querySelector('span')?.textContent.trim() || summary.textContent.trim();
      const question = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = questionText;
      question.appendChild(strong);
      faqCell.push(question);
    }

    // Extract answer
    const answer = details.querySelector('.faq-answer, .faq-answer p');
    if (answer) {
      const answerP = document.createElement('p');
      answerP.textContent = answer.textContent.trim();
      faqCell.push(answerP);
    }
  });

  // Build the 2-column row
  if (introCell.length > 0 && faqCell.length > 0) {
    cells.push([introCell, faqCell]);
  } else if (faqCell.length > 0) {
    // If no intro, still create columns with empty first cell
    cells.push(['', faqCell]);
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-faq', cells });
    element.replaceWith(block);
  }
}
