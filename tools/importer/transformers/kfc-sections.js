/* eslint-disable */
/* global WebImporter */

/**
 * KFC Romania (kfc.ro) sections transformer.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on
 * payload.template.sections from tools/importer/page-templates.json.
 */

const MARKER_ATTR = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector, try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const document = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    // Reverse order so insertions don't affect lookup of earlier sections.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(element, section);
      if (!el) continue;

      // First section only gets a temporary marker <hr> when it is styled.
      if (i === 0 && !section.style) continue;

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER_ATTR, section.id);
      if (i === 0) hr.setAttribute('data-excat-first-section', 'true');
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`hr[${MARKER_ATTR}="${section.id}"]`);
      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Place Section Metadata at the end of the section: right before the
      // next section break, or at the end of the container for the last one.
      let anchor = null;
      if (marker) {
        let node = marker.nextSibling;
        while (node && !(node.nodeType === 1 && node.tagName === 'HR')) {
          node = node.nextSibling;
        }
        anchor = node;
        if (anchor) {
          anchor.parentNode.insertBefore(metaBlock, anchor);
        } else {
          marker.parentNode.appendChild(metaBlock);
        }
      } else {
        const el = findSectionElement(element, section);
        if (el) el.after(metaBlock);
      }

      if (marker) {
        if (marker.hasAttribute('data-excat-first-section')) {
          marker.remove();
        } else {
          marker.removeAttribute(MARKER_ATTR);
        }
      }
    }
  }
}
