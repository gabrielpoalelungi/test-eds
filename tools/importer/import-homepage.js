/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLandingParser from './parsers/hero-landing.js';
import tabsTracksParser from './parsers/tabs-tracks.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/hellointerview-cleanup.js';
import sectionsTransformer from './transformers/hellointerview-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Hello Interview homepage with hero, learning tracks tabs, success stories, pricing tiers, and FAQ',
  urls: [
    'https://www.hellointerview.com/',
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: [
        'div.min-h-screen div.relative.pt-16.animate-fadein',
        '.animate-fadein',
      ],
    },
    {
      name: 'tabs-tracks',
      instances: [
        'div.min-h-screen section:nth-of-type(1)',
      ],
    },
    {
      name: 'cards-testimonial',
      instances: [
        'div.min-h-screen section:nth-of-type(2)',
      ],
    },
    {
      name: 'cards-pricing',
      instances: [
        'div.min-h-screen section:nth-of-type(3)',
      ],
    },
    {
      name: 'accordion-faq',
      instances: [
        'div.min-h-screen div.flex.flex-col.max-w-7xl.mx-auto:has(> .MuiAccordion-root)',
      ],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: 'div.min-h-screen div.relative.pt-16.animate-fadein',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: [],
    },
    {
      id: 'section-learning-tracks',
      name: 'Learning Tracks',
      selector: 'div.min-h-screen section:nth-of-type(1)',
      style: null,
      blocks: ['tabs-tracks'],
      defaultContent: ['div.min-h-screen section:nth-of-type(1) h3'],
    },
    {
      id: 'section-success-stories',
      name: 'Success Stories',
      selector: 'div.min-h-screen section:nth-of-type(2)',
      style: null,
      blocks: ['cards-testimonial'],
      defaultContent: ['div.min-h-screen section:nth-of-type(2) h3'],
    },
    {
      id: 'section-pricing',
      name: 'Pricing',
      selector: 'div.min-h-screen section:nth-of-type(3)',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: ['div.min-h-screen section:nth-of-type(3) h3'],
    },
    {
      id: 'section-faq',
      name: 'FAQ',
      selector: 'div.min-h-screen div.flex.flex-col.max-w-7xl.mx-auto:has(> .MuiAccordion-root)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-landing': heroLandingParser,
  'tabs-tracks': tabsTracksParser,
  'cards-testimonial': cardsTestimonialParser,
  'cards-pricing': cardsPricingParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for "${blockDef.name}": ${selector}`);
        return;
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return; // dedupe across fallback selectors
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
