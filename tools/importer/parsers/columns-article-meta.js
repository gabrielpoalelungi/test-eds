/* eslint-disable */
/* global WebImporter */
/** Parser for columns-article-meta. Base: columns. Source: https://www.wknd-trendsetters.site/. Generated: 2026-07-14 */
export default function parse(element, { document }) {
  // This is a 2-column layout with image on left and article metadata on right
  // Look for the grid container
  const gridContainer = element.querySelector('.grid-layout.tablet-1-column, .grid-layout');

  if (!gridContainer) {
    return;
  }

  // Check if this contains article metadata (breadcrumbs, author, date)
  const hasBreadcrumbs = element.querySelector('.breadcrumbs');
  const hasAuthor = element.textContent.includes('By') || element.querySelector('[class*="author"]');

  if (!hasBreadcrumbs && !hasAuthor) {
    // Not an article metadata section
    return;
  }

  const cells = [];

  // Column 1: Featured image
  const featuredImage = element.querySelector('img.cover-image, img[class*="aspect"]');

  // Column 2: Metadata content
  const metadataCell = [];

  // Extract breadcrumbs
  const breadcrumbs = element.querySelector('.breadcrumbs');
  if (breadcrumbs) {
    const breadcrumbLinks = Array.from(breadcrumbs.querySelectorAll('a'));
    breadcrumbLinks.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      metadataCell.push(p);
    });
  }

  // Extract heading
  const heading = element.querySelector('h2, h1, [class*="heading"]');
  if (heading) {
    metadataCell.push(heading.cloneNode(true));
  }

  // Extract author information
  const authorContainer = element.querySelector('.flex-horizontal, [class*="author"]');
  if (authorContainer) {
    // Look for "By [Author Name]" pattern
    const textContent = authorContainer.textContent;
    if (textContent.includes('By')) {
      const p = document.createElement('p');
      p.textContent = textContent.replace(/\s+/g, ' ').trim();
      metadataCell.push(p);
    }
  }

  // Extract date and read time
  const dateContainer = element.querySelectorAll('.flex-horizontal')[1] || element.querySelector('[class*="date"]');
  if (dateContainer) {
    const p = document.createElement('p');
    p.textContent = dateContainer.textContent.replace(/\s+/g, ' ').trim();
    metadataCell.push(p);
  }

  // Build the 2-column row
  if (featuredImage && metadataCell.length > 0) {
    cells.push([featuredImage.cloneNode(true), metadataCell]);
  } else if (metadataCell.length > 0) {
    // If no image, still create a 2-column layout with empty first cell
    cells.push(['', metadataCell]);
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article-meta', cells });
    element.replaceWith(block);
  }
}
