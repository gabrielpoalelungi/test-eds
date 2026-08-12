/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: hellointerview section breaks + section metadata.
 *
 * Runs in afterTransform only. Reads payload.template.sections and, for each
 * section, inserts a <hr> section break before every non-first section and a
 * Section Metadata block when the section defines a `style`.
 *
 * The homepage template defines 5 sections (all style: null), so 4 <hr>
 * breaks are expected and 0 Section Metadata blocks. Section selectors are
 * taken verbatim from tools/importer/page-templates.json (which were verified
 * against migration-work/cleaned.html):
 *   - section-hero            -> div.min-h-screen div.relative.pt-16.animate-fadein
 *   - section-learning-tracks -> div.min-h-screen section:nth-of-type(1)
 *   - section-success-stories -> div.min-h-screen section:nth-of-type(2)
 *   - section-pricing         -> div.min-h-screen section:nth-of-type(3)
 *   - section-faq             -> div.min-h-screen div.flex.flex-col.max-w-7xl.mx-auto
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Process in reverse so inserting/appending nodes for later sections does
  // not shift the elements we still need to locate for earlier sections.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section || !section.selector) continue;

    const target = element.querySelector(section.selector);
    if (!target) continue;

    // Section Metadata block when the section defines a style.
    if (section.style) {
      const meta = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      target.after(meta);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      target.before(hr);
    }
  }
}
