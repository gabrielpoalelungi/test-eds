/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome (skip link, header/nav, footer, breadcrumbs)
 * and leftover non-authorable elements. All selectors are taken from the captured
 * DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No modals/overlays/cookie banners present in captured DOM that block parsing.
    // Nothing to remove before block parsing.
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome — from captured DOM:
    //   <a href="#main-content" class="skip-link">  (skip link)
    //   <div class="navbar"> ... <nav class="nav-menu"> (site header / mega menu)
    //   <footer class="footer inverse-footer"> (site footer)
    //   <div class="breadcrumbs"> (breadcrumbs inside featured-story section)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'header.section .breadcrumbs',
      'section .breadcrumbs',
      '.breadcrumbs',
      'nav.nav-menu',
      'footer.footer',
      'footer',
    ]);
  }
}
