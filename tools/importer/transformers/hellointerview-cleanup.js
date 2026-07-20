/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: hellointerview site-wide cleanup.
 *
 * Removes non-authorable site chrome injected by the Next.js SPA shell so the
 * import contains only page-level authorable content (hero, learning tracks,
 * success stories, pricing, FAQ).
 *
 * All selectors below were verified against migration-work/cleaned.html:
 *   - div.relative.z-20.w-full  -> line 13, promo/notification bar
 *                                  ("Limited Time Offer" premium promo); unique.
 *   - header                    -> line 38, top navigation bar.
 *   - .footer (div.py-6.mt-8.w-full.footer) -> line 1005, site footer
 *                                  ("© 2026 Optick Labs Inc.").
 *   - next-route-announcer      -> line 1075, Next.js SPA routing artifact.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Collapse redundant single-child spans that the MUI/Next.js markup nests
    // heavily (e.g. <span class="font-bold"><span>...</span></span>), so they
    // don't interfere with block parsing. Verified present in cleaned.html
    // (e.g. line 18-21 promo bar, and throughout MuiTypography spans).
    element.querySelectorAll('span > span:only-child').forEach((span) => {
      span.replaceWith(span.textContent);
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (promo bar, header nav, footer) and the
    // Next.js SPA route announcer. Selectors from captured DOM (see header).
    WebImporter.DOMUtils.remove(element, [
      'div.relative.z-20.w-full',
      'header',
      '.footer',
      'next-route-announcer',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
