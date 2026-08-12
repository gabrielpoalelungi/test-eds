/**
 * loads and decorates the hero-feature block
 *
 * The project's buildHeroBlock() auto-blocking (scripts.js) steals the first
 * <h1> and the first <picture> out of this block into a synthetic `.hero`
 * block that it prepends to <main>. That breaks the intended two-column
 * layout (heading + copy + CTAs on the left, image grid on the right).
 *
 * This decorator reclaims the stolen heading/picture, unwraps the media,
 * and flattens the authored table (two rows, one cell each) into a single
 * two-column container so it renders as designed.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  // Authored: row 0 = media cell (images), row 1 = text cell (heading, copy, CTAs)
  const mediaCell = rows[0]?.querySelector(':scope > div');
  const textCell = rows[1]?.querySelector(':scope > div');
  if (!mediaCell || !textCell) return;

  // Reclaim heading + first picture stolen by buildHeroBlock().
  const main = block.closest('main');
  const autoHero = main?.querySelector('.hero');
  if (autoHero && autoHero !== block) {
    const stolenHeading = autoHero.querySelector('h1, h2, h3, h4, h5, h6');
    const stolenPicture = autoHero.querySelector('picture');

    if (stolenHeading && !textCell.querySelector('h1, h2, h3, h4, h5, h6')) {
      textCell.prepend(stolenHeading);
    }
    if (stolenPicture) {
      mediaCell.prepend(stolenPicture);
    }

    (autoHero.closest('.section') || autoHero).remove();
  }

  // Unwrap any <picture> the boilerplate wrapped in a <p> so they are
  // direct grid items in the media cell.
  mediaCell.querySelectorAll(':scope > p').forEach((p) => {
    const pics = [...p.querySelectorAll(':scope > picture')];
    if (pics.length && p.textContent.trim() === '') {
      pics.forEach((pic) => p.before(pic));
      p.remove();
    }
  });

  // Group the CTA paragraphs (a <p> whose only content is a single link)
  // into one flex row so the buttons sit side by side like the source.
  const ctaParas = [...textCell.querySelectorAll(':scope > p')].filter(
    (p) => p.children.length === 1
      && p.firstElementChild.tagName === 'A'
      && p.textContent.trim() === p.firstElementChild.textContent.trim(),
  );
  if (ctaParas.length) {
    const ctaGroup = document.createElement('div');
    ctaGroup.className = 'hero-feature-cta';
    ctaParas[0].before(ctaGroup);
    ctaParas.forEach((p) => {
      const link = p.firstElementChild;
      ctaGroup.append(link);
      p.remove();
    });
  }

  // Flatten: build one inner container holding the two cells side by side.
  mediaCell.classList.add('hero-feature-media');
  textCell.classList.add('hero-feature-content');

  const inner = document.createElement('div');
  inner.className = 'hero-feature-inner';
  inner.append(textCell, mediaCell);

  block.textContent = '';
  block.append(inner);
}
