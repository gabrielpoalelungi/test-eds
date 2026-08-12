/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters sections
 * Adds section breaks (<hr>) and Section Metadata blocks from template sections.
 * Runs in afterTransform only.
 * Selectors from page-templates.json sections array.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;

    // Only process if template has sections defined
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    // Collect all section elements in DOM order
    // Based on cleaned.html structure: header.section then multiple section.section elements
    const allSectionElements = [];

    // First, add the header.section if it exists
    const headerSection = element.querySelector('header.section');
    if (headerSection) {
      allSectionElements.push(headerSection);
    }

    // Then add all section.section elements in order
    const sectionElements = element.querySelectorAll('section.section');
    sectionElements.forEach((sec) => allSectionElements.push(sec));

    // Match template sections to DOM elements by position
    // Template sections are in the order they appear on the page
    template.sections.forEach((section, index) => {
      const sectionElement = allSectionElements[index];

      if (!sectionElement) {
        // No matching DOM element for this template section
        return;
      }

      const isFirstSection = index === 0;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(element.ownerDocument, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });

        // Insert Section Metadata block at the end of the section
        sectionElement.appendChild(sectionMetadata);
      }

      // Add section break (<hr>) before this section (except for first section)
      if (!isFirstSection) {
        const hr = element.ownerDocument.createElement('hr');
        sectionElement.parentNode.insertBefore(hr, sectionElement);
      }
    });
  }
}
