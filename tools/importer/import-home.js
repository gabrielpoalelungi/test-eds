/* eslint-disable */
/* global WebImporter */

// Parsers
import carouselHeroParser from './parsers/carousel-hero.js';
import carouselOffersParser from './parsers/carousel-offers.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsAppParser from './parsers/columns-app.js';
import columnsCtaParser from './parsers/columns-cta.js';
import carouselCampaignsParser from './parsers/carousel-campaigns.js';
import searchRestaurantParser from './parsers/search-restaurant.js';
import columnsHeritageParser from './parsers/columns-heritage.js';

// Transformers
import kfcCleanupTransformer from './transformers/kfc-cleanup.js';
import kfcSectionsTransformer from './transformers/kfc-sections.js';

const PAGE_TEMPLATE = {
  "name": "home",
  "urls": [
    "https://kfc.ro/"
  ],
  "representativeUrl": "https://kfc.ro/",
  "description": "KFC Romania homepage: hero carousel, offers slider, product categories and cards, app promo, order CTA, campaigns slider, restaurant finder and heritage band",
  "blocks": [
    {
      "name": "carousel-hero",
      "instances": [
        "main#main-content div.hero",
        ".hero swiper-container"
      ]
    },
    {
      "name": "carousel-offers",
      "instances": [
        "swiper-container.featured-offers-swiper-container"
      ]
    },
    {
      "name": "cards-category",
      "instances": [
        "nav.product-categories"
      ]
    },
    {
      "name": "cards-product",
      "instances": [
        "div.products-container"
      ]
    },
    {
      "name": "columns-app",
      "instances": [
        "section.app-section > div.container"
      ]
    },
    {
      "name": "columns-cta",
      "instances": [
        ".comanda-section-inner"
      ]
    },
    {
      "name": "carousel-campaigns",
      "instances": [
        "swiper-container.campaigns-swiper"
      ]
    },
    {
      "name": "search-restaurant",
      "instances": [
        ".search-restaurant-input"
      ]
    },
    {
      "name": "columns-heritage",
      "instances": [
        ".heritage-inner"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Hero carousel",
      "selector": [
        "main#main-content div.hero",
        "div.hero"
      ],
      "style": null,
      "blocks": [
        "carousel-hero"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Oferte #pebune",
      "selector": [
        "main#main-content section.featured-offers",
        "section.featured-offers"
      ],
      "style": "dark",
      "blocks": [
        "carousel-offers"
      ],
      "defaultContent": [
        ".featured-offers .section-headline"
      ]
    },
    {
      "id": "section-3",
      "name": "Produsele noastre",
      "selector": [
        "main#main-content section.products",
        "section.products"
      ],
      "style": null,
      "blocks": [
        "cards-category",
        "cards-product"
      ],
      "defaultContent": [
        ".products .section-label",
        ".products .section-headline",
        ".products .button-container"
      ]
    },
    {
      "id": "section-4",
      "name": "KFC App",
      "selector": [
        "main#main-content section.app-section",
        "section#app"
      ],
      "style": "dark",
      "blocks": [
        "columns-app"
      ],
      "defaultContent": []
    },
    {
      "id": "section-5",
      "name": "Comanda online",
      "selector": [
        "main#main-content section.comanda-section",
        "section.comanda-section"
      ],
      "style": null,
      "blocks": [
        "columns-cta"
      ],
      "defaultContent": []
    },
    {
      "id": "section-6",
      "name": "Campanii",
      "selector": [
        "main#main-content section.campaigns-section",
        "section.campaigns-section"
      ],
      "style": "dark-red",
      "blocks": [
        "carousel-campaigns"
      ],
      "defaultContent": []
    },
    {
      "id": "section-7",
      "name": "Gaseste un restaurant",
      "selector": [
        "main#main-content section.search-restaurant",
        "section.search-restaurant"
      ],
      "style": "red",
      "blocks": [
        "search-restaurant"
      ],
      "defaultContent": []
    },
    {
      "id": "section-8",
      "name": "Heritage",
      "selector": [
        "main#main-content section.heritage",
        "section.heritage"
      ],
      "style": null,
      "blocks": [
        "columns-heritage"
      ],
      "defaultContent": []
    }
  ],
  "urlPattern": "/"
};

const parsers = {
  'carousel-hero': carouselHeroParser,
  'carousel-offers': carouselOffersParser,
  'cards-category': cardsCategoryParser,
  'cards-product': cardsProductParser,
  'columns-app': columnsAppParser,
  'columns-cta': columnsCtaParser,
  'carousel-campaigns': carouselCampaignsParser,
  'search-restaurant': searchRestaurantParser,
  'columns-heritage': columnsHeritageParser,
};

const transformers = [
  kfcCleanupTransformer,
  kfcSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      // skip elements already consumed by another instance selector of a parsed block
      if (!block.element.parentNode || !main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
