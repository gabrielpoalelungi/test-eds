/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup
 * Removes non-authorable content from the page before/after block parsing.
 * Selectors from captured DOM in migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function validateTransformerStructure(code) {
  // Requirement #1: Check function signature
  const hasSignature = /export\s+default\s+function\s+transform\s*\(\s*hookName\s*,\s*element\s*,\s*payload\s*\)/.test(code);
  if (!hasSignature) {
    throw new Error('CRITICAL: Transformer must use signature: export default function transform(hookName, element, payload)');
  }

  // Requirement #2: Check hook conditionals (at least one of beforeTransform / afterTransform)
  if (!code.includes('beforeTransform') && !code.includes('afterTransform')) {
    throw new Error('CRITICAL: Transformer must use beforeTransform and/or afterTransform hook conditionals');
  }

  // Requirement #3: No return of a value (in-place DOM only)
  if (code.match(/return\s+(element|payload|document|main)/)) {
    throw new Error('CRITICAL: Transformer must NOT return a value; modify DOM in place only');
  }
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Before block parsing: fix nested spans and any elements that could interfere with parsing
    // Found in captured DOM: nested spans in navigation and content areas
    const nestedSpans = element.querySelectorAll('span > span:only-child');
    nestedSpans.forEach((span) => {
      if (span.parentNode) {
        span.parentNode.replaceWith(span.textContent);
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // After block parsing: remove non-authorable content
    // Found in captured DOM at lines 1-47 (navigation), 38-45 (breadcrumbs), 98-178 (footer)

    // Remove navigation - found at .navbar (lines 1-47)
    WebImporter.DOMUtils.remove(element, ['.navbar']);

    // Remove skip link - found at .skip-link (line 1)
    WebImporter.DOMUtils.remove(element, ['.skip-link']);

    // Remove footer - found at footer.footer (lines 98-178)
    WebImporter.DOMUtils.remove(element, ['footer.footer', 'footer.inverse-footer']);

    // Remove breadcrumbs - found at .breadcrumbs (line 49)
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);

    // Clean up any leftover link elements, iframes, noscript
    WebImporter.DOMUtils.remove(element, ['link', 'iframe', 'noscript']);

    // Remove tracking and event handler attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
      el.removeAttribute('data-astro-cid-rbygaycu');
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
