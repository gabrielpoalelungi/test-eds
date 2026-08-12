/* eslint-disable */
/* global WebImporter */
/** Parser for cards-article. Base: cards. Source: https://www.wknd-trendsetters.site/. Generated: 2026-07-14 */
export default function parse(element, { document }) {
  // Only process if this section contains article cards (identified by article-card-body or article-card-meta)
  const hasArticleCards = element.querySelector('.article-card-body, .article-card-meta');
  if (!hasArticleCards) {
    // Not an article cards section, leave as is
    return;
  }

  // Extract all article cards - look for anchor elements with article-card structure
  const cardElements = Array.from(element.querySelectorAll('a.article-card, a.card-link')).filter((card) => {
    // Ensure it has the article card structure (metadata and body)
    return card.querySelector('.article-card-meta') && card.querySelector('.article-card-body');
  });

  if (!cardElements.length) {
    // No valid article cards found
    return;
  }

  const cells = [];

  // Process each card
  cardElements.forEach((card) => {
    // Extract image (first column)
    const img = card.querySelector('.article-card-image img, img.cover-image, img');

    if (!img) {
      return; // Skip cards without images for this variant
    }

    // Build text content cell (second column)
    const textCell = [];

    // Extract tag/category
    const tag = card.querySelector('.article-card-meta .tag, .tag');
    if (tag) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.push(p);
    }

    // Extract date
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span.utility-text-secondary');
    if (date) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }

    // Extract heading and wrap in link
    const heading = card.querySelector('.article-card-body h3, h3.h4-heading, h3, h4');
    if (heading && card.href) {
      const h3 = document.createElement('h3');
      const link = document.createElement('a');
      link.href = card.href;
      link.textContent = heading.textContent.trim();
      h3.appendChild(link);
      textCell.push(h3);
    }

    // Add row if we have content
    if (textCell.length > 0) {
      cells.push([img.cloneNode(true), textCell]);
    }
  });

  // Create block if we have cells
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
    element.replaceWith(block);
  }
}
