/* eslint-disable */
/* global WebImporter */
/** Parser for hero-overlay. Base: hero. Source: https://www.wknd-trendsetters.site/. Generated: 2026-07-14 */
export default function parse(element, { document }) {
  // Hero is a 1-column block with background image and text content
  // Check for hero/overlay pattern
  const hasOverlay = element.querySelector('.overlay, [class*="overlay"]');
  const hasCardBody = element.querySelector('.card-body, [class*="card-body"]');

  if (!hasOverlay && !hasCardBody) {
    // Not a hero overlay section
    return;
  }

  const cells = [];

  // Row 1: Background image (optional)
  const bgImage = element.querySelector('img.cover-image, img.utility-overlay, img[class*="overlay"]');
  if (bgImage) {
    cells.push([[bgImage.cloneNode(true)]]);
  }

  // Row 2: Text content
  const contentCell = [];

  // Find the text content container
  const textContainer = element.querySelector('.card-body, [class*="text-on-overlay"]');

  if (textContainer) {
    // Extract heading
    const heading = textContainer.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');
    if (heading) {
      contentCell.push(heading.cloneNode(true));
    }

    // Extract subheading/description
    const subheading = textContainer.querySelector('.subheading, p.subheading, p');
    if (subheading) {
      contentCell.push(subheading.cloneNode(true));
    }

    // Extract CTA buttons
    const buttonGroup = textContainer.querySelector('.button-group');
    if (buttonGroup) {
      const buttons = Array.from(buttonGroup.querySelectorAll('a.button, a'));
      buttons.forEach((btn) => {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = btn.href;
        link.textContent = btn.textContent.trim();
        p.appendChild(link);
        contentCell.push(p);
      });
    }
  }

  // Add content row if we have content
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
    element.replaceWith(block);
  }
}
