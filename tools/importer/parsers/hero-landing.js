/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-landing. Base block: hero.
 * Source: https://www.hellointerview.com/
 * Generated: 2026-07-20
 *
 * Structure (from library-description.txt): 1 column, 3 rows.
 *  - Row 1: block name (added by createBlock)
 *  - Row 2: background image (optional)
 *  - Row 3: single content cell holding Title (h1), Subheading (h6),
 *           Call-to-Action buttons, and caption.
 *
 * Source specifics (validated against source.html):
 *  - Headline is <h1 class="MuiTypography-h1">
 *  - Subheading is <h6 class="MuiTypography-h6">
 *  - Two CTAs are <button> elements (no href) -> converted to text links / paragraphs
 *  - Caption is <p class="MuiTypography-body2">
 *  - Surrounding company logos are decorative <img> in .hidden.xl:flex containers -> omitted
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, [class*="MuiTypography-h1"]');
  const subheading = element.querySelector('h6, [class*="MuiTypography-h6"]');
  const caption = element.querySelector('p, [class*="body2"]');

  // CTAs are rendered as <button> elements. Preserve their label text as
  // strong-emphasized paragraphs so authors can attach the correct links.
  const ctaButtons = Array.from(element.querySelectorAll('button'));

  const cells = [];

  // Row 2: background image (optional). No dedicated hero background image in
  // source (only decorative company logos), so this row is omitted.

  // Row 3: single content cell holding all hero content.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);

  ctaButtons.forEach((btn) => {
    const label = (btn.textContent || '').trim();
    if (!label) return;
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label;
    p.appendChild(strong);
    contentCell.push(p);
  });

  if (caption) contentCell.push(caption);

  // Empty-block guard.
  if (contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
