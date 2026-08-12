export default function decorate(block) {
  const rows = [...block.children];

  // First row cell holds the background image.
  const imageCell = block.querySelector(':scope > div:first-child > div');
  if (imageCell && imageCell.querySelector('picture')) {
    imageCell.classList.add('hero-banner-image');
  } else {
    block.classList.add('no-image');
  }

  // Last row cell holds the overlaid content (heading, subheading, CTA).
  const contentCell = rows[rows.length - 1]?.querySelector(':scope > div');
  if (contentCell) {
    contentCell.classList.add('hero-banner-content');

    // Render the CTA link as an inverse (white) pill button.
    const cta = contentCell.querySelector('p:last-child > a');
    if (cta) {
      cta.classList.add('button', 'inverse');
      cta.parentElement.classList.add('button-container');
    }
  }
}
