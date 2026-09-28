/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * All selectors verified in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // <a href="#main-content" class="skip-link"> - accessibility shell link, not authorable
    // Breadcrumbs in the featured-article section are kept: they are part of the
    // columns-article content model (image | breadcrumbs, heading, byline)
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global header (<div class="navbar">) and footer (<footer class="footer inverse-footer">)
    // are migrated separately. NOTE: do not remove bare `header` - the hero is
    // <header class="section secondary-section"> inside #main-content.
    WebImporter.DOMUtils.remove(element, [
      'div.navbar',
      'footer.footer.inverse-footer',
      'noscript',
      'link',
    ]);

    // Astro scoping attributes (e.g. data-astro-cid-37fxchfa on <body>)
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes]
        .filter((attr) => attr.name.startsWith('data-astro-cid'))
        .forEach((attr) => el.removeAttribute(attr.name));
    });
  }
}
