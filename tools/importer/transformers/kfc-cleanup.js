/* eslint-disable */
/* global WebImporter */

/**
 * KFC Romania (kfc.ro) cleanup transformer.
 * Removes non-authorable site chrome so only main#main-content sections remain.
 * Selectors are taken from migration-work/cleaned.html.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Cookiebot consent banner (blocks block matching / pollutes content)
    WebImporter.DOMUtils.remove(element, [
      '#CybotCookiebotDialog',
      '[id^="CybotCookiebot"]',
      'iframe.CybotCookiebotHiddenIframe',
      'iframe.CybotCookiebotOffscreenIframe',
    ]);

    // Modals / dialogs: location select, menu promo dialogs (svelte-1r5sxm2),
    // newsletter modal (svelte-1af6gkq, "Abonează-te la newsletter-ul KFC")
    WebImporter.DOMUtils.remove(element, [
      'dialog#location_select_modal',
      'dialog.svelte-1af6gkq',
      'dialog.svelte-1r5sxm2',
      'dialog',
    ]);

    // Off-canvas menu panel (part of global header navigation)
    WebImporter.DOMUtils.remove(element, ['nav#menu-panel']);

    // "Mergi sus" back-to-top button
    WebImporter.DOMUtils.remove(element, ['button.got-to-top-btn']);

    // Svelte live-region announcer
    WebImporter.DOMUtils.remove(element, ['#svelte-announcer']);

    // "Sari la conținut" skip link (site chrome) and decorative heritage stripes
    WebImporter.DOMUtils.remove(element, ['a.skip-to-main', 'section.heritage img.stripes']);

    // "Oferte #pebune" section title is a styled div on the source; author it as a heading
    element.querySelectorAll('.featured-offers .section-title').forEach((title) => {
      const h2 = element.ownerDocument.createElement('h2');
      h2.textContent = title.textContent.replace(/\s+/g, ' ').trim();
      title.replaceWith(h2);
    });
  }

  if (hookName === 'afterTransform') {
    // Global header and footer (migrated separately as nav/footer fragments)
    WebImporter.DOMUtils.remove(element, [
      'header.svelte-h4y2dc',
      'header',
      'footer.svelte-13uj0x1',
      'footer',
    ]);

    // Non-authorable technical elements
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'noscript',
      'link',
      'iframe',
      'object',
      'embed',
      'form#close_modal',
    ]);

    // Tracking pixels (1x1 images)
    element.querySelectorAll('img').forEach((img) => {
      const w = img.getAttribute('width');
      const h = img.getAttribute('height');
      if ((w === '1' || w === '0') && (h === '1' || h === '0')) img.remove();
    });

    // Tracking / framework attributes
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (
          n.startsWith('data-gtm')
          || n.startsWith('data-track')
          || n.startsWith('data-analytics')
          || n === 'onclick'
          || n === 'onload'
        ) {
          el.removeAttribute(n);
        }
      });
    });
  }
}
