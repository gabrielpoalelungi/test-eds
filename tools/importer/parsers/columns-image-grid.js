/* eslint-disable */
/* global WebImporter */
/** Parser for columns-image-grid. Base: columns. Source: https://www.wknd-trendsetters.site/. Generated: 2026-07-14 */
export default function parse(element, { document }) {
  // This is a 2-column layout with text content on left and image grid on right
  // Look for the main grid container
  const mainGrid = element.querySelector('.grid-layout.tablet-1-column');

  if (!mainGrid) {
    return;
  }

  // Check for presence of button group and multiple images (image grid pattern)
  const hasButtonGroup = element.querySelector('.button-group');
  const images = element.querySelectorAll('img.cover-image, img[alt]');

  if (!hasButtonGroup || images.length < 2) {
    // Not an image grid hero section
    return;
  }

  const cells = [];

  // Column 1: Text content
  const textCell = [];

  // Extract heading
  const heading = element.querySelector('h1, h2, [class*="h1-heading"]');
  if (heading) {
    textCell.push(heading.cloneNode(true));
  }

  // Extract subheading/description
  const subheading = element.querySelector('.subheading, p.subheading');
  if (subheading) {
    textCell.push(subheading.cloneNode(true));
  }

  // Extract buttons
  const buttonGroup = element.querySelector('.button-group');
  if (buttonGroup) {
    const buttons = Array.from(buttonGroup.querySelectorAll('a.button'));
    buttons.forEach((btn) => {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = btn.href;
      link.textContent = btn.textContent.trim();
      p.appendChild(link);
      textCell.push(p);
    });
  }

  // Column 2: Image grid
  const imageCell = [];

  // Find the image grid container (second child of main grid)
  const imageGrid = mainGrid.querySelector(':scope > div:last-child .grid-layout, :scope > div:last-child');
  if (imageGrid) {
    const gridImages = Array.from(imageGrid.querySelectorAll('img.cover-image, img[alt]'));
    gridImages.forEach((img) => {
      imageCell.push(img.cloneNode(true));
    });
  }

  // Build the 2-column row
  if (textCell.length > 0 && imageCell.length > 0) {
    cells.push([textCell, imageCell]);
  } else if (textCell.length > 0) {
    // If no images found, still create with empty second cell
    cells.push([textCell, '']);
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-image-grid', cells });
    element.replaceWith(block);
  }
}
