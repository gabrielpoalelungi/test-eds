/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroFeatureParser from './parsers/hero-feature.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialsParser from './parsers/tabs-testimonials.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-feature': heroFeatureParser,
  'columns-feature': columnsFeatureParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonials': tabsTestimonialsParser,
  'cards-articles': cardsArticlesParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters homepage with hero, featured story, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner',
  urls: [
    'https://www.wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'hero-feature',
      instances: ['#main-content > header.section.secondary-section'],
    },
    {
      name: 'columns-feature',
      instances: ['#main-content > section.section:nth-of-type(1)'],
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonials',
      instances: ['#main-content > section.section:nth-of-type(3) .tabs-wrapper'],
    },
    {
      name: 'cards-articles',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(5) .faq-list'],
    },
    {
      name: 'hero-banner',
      instances: ['#main-content > section.section.inverse-section'],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'hero',
      selector: '#main-content > header.section.secondary-section',
      style: null,
      blocks: ['hero-feature'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'featured-story',
      selector: '#main-content > section.section:nth-of-type(1)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'rc4',
      name: 'image-gallery',
      selector: '#main-content > section.section.secondary-section:nth-of-type(2)',
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: [
        '#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > h2.h2-heading',
        '#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > p.paragraph-lg',
      ],
    },
    {
      id: 'rc5',
      name: 'testimonials-tabs',
      selector: '#main-content > section.section:nth-of-type(3)',
      style: null,
      blocks: ['tabs-testimonials'],
      defaultContent: [],
    },
    {
      id: 'rc6',
      name: 'latest-articles',
      selector: '#main-content > section.section.secondary-section:nth-of-type(4)',
      style: 'secondary',
      blocks: ['cards-articles'],
      defaultContent: [
        '#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center > h2.h2-heading',
        '#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center > p.paragraph-lg',
      ],
    },
    {
      id: 'rc7',
      name: 'faq-accordion',
      selector: '#main-content > section.section:nth-of-type(5)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        '#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout > div > h2.h2-heading',
        '#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout > div > p.subheading',
      ],
    },
    {
      id: 'rc8',
      name: 'cta-banner',
      selector: '#main-content > section.section.inverse-section',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, section transformer runs after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
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
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (root URL "/" maps to "/index")
    const rawPath = new URL(params.originalURL).pathname.replace(/\.html$/, '').replace(/\/$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

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
