/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import columnsImageGridParser from './parsers/columns-image-grid.js';
import columnsArticleMetaParser from './parsers/columns-article-meta.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsFaqParser from './parsers/columns-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import wkndTrendsettersCleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import wkndTrendsettersSectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-image-grid': columnsImageGridParser,
  'columns-article-meta': columnsArticleMetaParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'columns-faq': columnsFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  wkndTrendsettersCleanupTransformer,
  wkndTrendsettersSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template for WKND Trendsetters fashion blog',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'columns-image-grid',
      instances: [
        'header.section.secondary-section'
      ]
    },
    {
      name: 'columns-article-meta',
      instances: [
        'section.section:nth-of-type(1)'
      ]
    },
    {
      name: 'tabs-testimonial',
      instances: [
        'section.section:nth-of-type(2)'
      ]
    },
    {
      name: 'cards-article',
      instances: [
        'section.section.secondary-section:nth-of-type(2)'
      ]
    },
    {
      name: 'columns-faq',
      instances: [
        'section.section:nth-of-type(3)'
      ]
    },
    {
      name: 'hero-overlay',
      instances: [
        'section.section.inverse-section'
      ]
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Section 1',
      selector: 'header.section.secondary-section',
      style: 'light-grey',
      blocks: [
        'columns-image-grid'
      ],
      defaultContent: [
        'header.section.secondary-section'
      ]
    },
    {
      id: 'section-2',
      name: 'Section 2',
      selector: 'section.section:nth-of-type(1)',
      style: null,
      blocks: [
        'columns-article-meta'
      ],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Section 3',
      selector: 'section.section.secondary-section:nth-of-type(1)',
      style: 'light-grey',
      blocks: [],
      defaultContent: [
        'section.section.secondary-section:nth-of-type(1)'
      ]
    },
    {
      id: 'section-4',
      name: 'Section 4',
      selector: 'section.section:nth-of-type(2)',
      style: null,
      blocks: [
        'tabs-testimonial'
      ],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Section 5',
      selector: 'section.section.secondary-section:nth-of-type(2)',
      style: 'light-grey',
      blocks: [
        'cards-article'
      ],
      defaultContent: [
        'section.section.secondary-section:nth-of-type(2)'
      ]
    },
    {
      id: 'section-6',
      name: 'Section 6',
      selector: 'section.section:nth-of-type(3)',
      style: null,
      blocks: [
        'columns-faq'
      ],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Section 7',
      selector: 'section.section.inverse-section',
      style: 'dark',
      blocks: [
        'hero-overlay'
      ],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform (typically document.body or main)
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  // Pass PAGE_TEMPLATE to transformers so they can access section information
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
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

  // Find all block instances defined in the template
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   * See references/helix-importer-guidelines.md for transform() pattern
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    // Skip elements already replaced by a prior parser (detached from DOM)
    pageBlocks.forEach(block => {
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    // Add horizontal rule to separate metadata section
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
    let path = new URL(params.originalURL).pathname;
    // Remove trailing slash and .html extension
    path = path.replace(/\/$/, '').replace(/\.html$/, '');
    // Default to /index for homepage
    if (!path || path === '') {
      path = '/index';
    }

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
