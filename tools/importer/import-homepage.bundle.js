/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns-image-grid.js
  function parse(element, { document }) {
    const mainGrid = element.querySelector(".grid-layout.tablet-1-column");
    if (!mainGrid) {
      return;
    }
    const hasButtonGroup = element.querySelector(".button-group");
    const images = element.querySelectorAll("img.cover-image, img[alt]");
    if (!hasButtonGroup || images.length < 2) {
      return;
    }
    const cells = [];
    const textCell = [];
    const heading = element.querySelector('h1, h2, [class*="h1-heading"]');
    if (heading) {
      textCell.push(heading.cloneNode(true));
    }
    const subheading = element.querySelector(".subheading, p.subheading");
    if (subheading) {
      textCell.push(subheading.cloneNode(true));
    }
    const buttonGroup = element.querySelector(".button-group");
    if (buttonGroup) {
      const buttons = Array.from(buttonGroup.querySelectorAll("a.button"));
      buttons.forEach((btn) => {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = btn.href;
        link.textContent = btn.textContent.trim();
        p.appendChild(link);
        textCell.push(p);
      });
    }
    const imageCell = [];
    const imageGrid = mainGrid.querySelector(":scope > div:last-child .grid-layout, :scope > div:last-child");
    if (imageGrid) {
      const gridImages = Array.from(imageGrid.querySelectorAll("img.cover-image, img[alt]"));
      gridImages.forEach((img) => {
        imageCell.push(img.cloneNode(true));
      });
    }
    if (textCell.length > 0 && imageCell.length > 0) {
      cells.push([textCell, imageCell]);
    } else if (textCell.length > 0) {
      cells.push([textCell, ""]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "columns-image-grid", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-article-meta.js
  function parse2(element, { document }) {
    const gridContainer = element.querySelector(".grid-layout.tablet-1-column, .grid-layout");
    if (!gridContainer) {
      return;
    }
    const hasBreadcrumbs = element.querySelector(".breadcrumbs");
    const hasAuthor = element.textContent.includes("By") || element.querySelector('[class*="author"]');
    if (!hasBreadcrumbs && !hasAuthor) {
      return;
    }
    const cells = [];
    const featuredImage = element.querySelector('img.cover-image, img[class*="aspect"]');
    const metadataCell = [];
    const breadcrumbs = element.querySelector(".breadcrumbs");
    if (breadcrumbs) {
      const breadcrumbLinks = Array.from(breadcrumbs.querySelectorAll("a"));
      breadcrumbLinks.forEach((link) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        metadataCell.push(p);
      });
    }
    const heading = element.querySelector('h2, h1, [class*="heading"]');
    if (heading) {
      metadataCell.push(heading.cloneNode(true));
    }
    const authorContainer = element.querySelector('.flex-horizontal, [class*="author"]');
    if (authorContainer) {
      const textContent = authorContainer.textContent;
      if (textContent.includes("By")) {
        const p = document.createElement("p");
        p.textContent = textContent.replace(/\s+/g, " ").trim();
        metadataCell.push(p);
      }
    }
    const dateContainer = element.querySelectorAll(".flex-horizontal")[1] || element.querySelector('[class*="date"]');
    if (dateContainer) {
      const p = document.createElement("p");
      p.textContent = dateContainer.textContent.replace(/\s+/g, " ").trim();
      metadataCell.push(p);
    }
    if (featuredImage && metadataCell.length > 0) {
      cells.push([featuredImage.cloneNode(true), metadataCell]);
    } else if (metadataCell.length > 0) {
      cells.push(["", metadataCell]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "columns-article-meta", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse3(element, { document }) {
    const hasTabsWrapper = element.querySelector('.tabs-wrapper, [class*="tabs"]');
    const hasTabPanes = element.querySelector('.tab-pane, [id*="tabpanel"]');
    if (!hasTabsWrapper || !hasTabPanes) {
      return;
    }
    const cells = [];
    const tabPanes = Array.from(element.querySelectorAll('.tab-pane, [id*="tabpanel"]'));
    const tabMenuItems = Array.from(element.querySelectorAll('.tab-menu-link, button[id*="tab-"]'));
    tabPanes.forEach((pane, index) => {
      let tabLabel = "";
      if (tabMenuItems[index]) {
        const menuItem = tabMenuItems[index];
        const name = menuItem.querySelector('strong, [class*="paragraph"]');
        if (name) {
          tabLabel = name.textContent.trim();
        } else {
          tabLabel = menuItem.textContent.trim().split("\n")[0].trim();
        }
      }
      const tabContent = [];
      const image = pane.querySelector("img.cover-image, img");
      if (image) {
        tabContent.push(image.cloneNode(true));
      }
      const nameElement = pane.querySelector("strong, .paragraph-xl strong");
      if (nameElement) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = nameElement.textContent.trim();
        p.appendChild(strong);
        tabContent.push(p);
      }
      const roleElements = pane.querySelectorAll("div > div");
      for (const div of roleElements) {
        const text = div.textContent.trim();
        if (text && !div.querySelector("strong") && !text.startsWith('"')) {
          const p = document.createElement("p");
          p.textContent = text;
          tabContent.push(p);
          break;
        }
      }
      const quote = pane.querySelector("p.paragraph-xl, p");
      if (quote && quote.textContent.includes('"')) {
        const p = document.createElement("p");
        p.textContent = quote.textContent.trim();
        tabContent.push(p);
      }
      if (tabLabel && tabContent.length > 0) {
        cells.push([tabLabel, tabContent]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const hasArticleCards = element.querySelector(".article-card-body, .article-card-meta");
    if (!hasArticleCards) {
      return;
    }
    const cardElements = Array.from(element.querySelectorAll("a.article-card, a.card-link")).filter((card) => {
      return card.querySelector(".article-card-meta") && card.querySelector(".article-card-body");
    });
    if (!cardElements.length) {
      return;
    }
    const cells = [];
    cardElements.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img.cover-image, img");
      if (!img) {
        return;
      }
      const textCell = [];
      const tag = card.querySelector(".article-card-meta .tag, .tag");
      if (tag) {
        const p = document.createElement("p");
        p.textContent = tag.textContent.trim();
        textCell.push(p);
      }
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span.utility-text-secondary");
      if (date) {
        const p = document.createElement("p");
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }
      const heading = card.querySelector(".article-card-body h3, h3.h4-heading, h3, h4");
      if (heading && card.href) {
        const h3 = document.createElement("h3");
        const link = document.createElement("a");
        link.href = card.href;
        link.textContent = heading.textContent.trim();
        h3.appendChild(link);
        textCell.push(h3);
      }
      if (textCell.length > 0) {
        cells.push([img.cloneNode(true), textCell]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-faq.js
  function parse5(element, { document }) {
    const hasFaqList = element.querySelector('.faq-list, details.faq-item, [class*="faq"]');
    if (!hasFaqList) {
      return;
    }
    const cells = [];
    const introCell = [];
    const gridLayout = element.querySelector(".grid-layout");
    if (gridLayout) {
      const introSection = gridLayout.querySelector(":scope > div:first-child");
      if (introSection) {
        const heading = introSection.querySelector('h2, h1, [class*="heading"]');
        if (heading) {
          introCell.push(heading.cloneNode(true));
        }
        const description = introSection.querySelector('p, .subheading, [class*="subtitle"]');
        if (description) {
          introCell.push(description.cloneNode(true));
        }
      }
    }
    const faqCell = [];
    const faqItems = Array.from(element.querySelectorAll("details.faq-item, details"));
    faqItems.forEach((details) => {
      var _a;
      const summary = details.querySelector("summary");
      if (summary) {
        const questionText = ((_a = summary.querySelector("span")) == null ? void 0 : _a.textContent.trim()) || summary.textContent.trim();
        const question = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = questionText;
        question.appendChild(strong);
        faqCell.push(question);
      }
      const answer = details.querySelector(".faq-answer, .faq-answer p");
      if (answer) {
        const answerP = document.createElement("p");
        answerP.textContent = answer.textContent.trim();
        faqCell.push(answerP);
      }
    });
    if (introCell.length > 0 && faqCell.length > 0) {
      cells.push([introCell, faqCell]);
    } else if (faqCell.length > 0) {
      cells.push(["", faqCell]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "columns-faq", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document }) {
    const hasOverlay = element.querySelector('.overlay, [class*="overlay"]');
    const hasCardBody = element.querySelector('.card-body, [class*="card-body"]');
    if (!hasOverlay && !hasCardBody) {
      return;
    }
    const cells = [];
    const bgImage = element.querySelector('img.cover-image, img.utility-overlay, img[class*="overlay"]');
    if (bgImage) {
      cells.push([[bgImage.cloneNode(true)]]);
    }
    const contentCell = [];
    const textContainer = element.querySelector('.card-body, [class*="text-on-overlay"]');
    if (textContainer) {
      const heading = textContainer.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');
      if (heading) {
        contentCell.push(heading.cloneNode(true));
      }
      const subheading = textContainer.querySelector(".subheading, p.subheading, p");
      if (subheading) {
        contentCell.push(subheading.cloneNode(true));
      }
      const buttonGroup = textContainer.querySelector(".button-group");
      if (buttonGroup) {
        const buttons = Array.from(buttonGroup.querySelectorAll("a.button, a"));
        buttons.forEach((btn) => {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = btn.href;
          link.textContent = btn.textContent.trim();
          p.appendChild(link);
          contentCell.push(p);
        });
      }
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const nestedSpans = element.querySelectorAll("span > span:only-child");
      nestedSpans.forEach((span) => {
        if (span.parentNode) {
          span.parentNode.replaceWith(span.textContent);
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".navbar"]);
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer", "footer.inverse-footer"]);
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
      WebImporter.DOMUtils.remove(element, ["link", "iframe", "noscript"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
        el.removeAttribute("data-astro-cid-rbygaycu");
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const allSectionElements = [];
      const headerSection = element.querySelector("header.section");
      if (headerSection) {
        allSectionElements.push(headerSection);
      }
      const sectionElements = element.querySelectorAll("section.section");
      sectionElements.forEach((sec) => allSectionElements.push(sec));
      template.sections.forEach((section, index) => {
        const sectionElement = allSectionElements[index];
        if (!sectionElement) {
          return;
        }
        const isFirstSection = index === 0;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(element.ownerDocument, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionElement.appendChild(sectionMetadata);
        }
        if (!isFirstSection) {
          const hr = element.ownerDocument.createElement("hr");
          sectionElement.parentNode.insertBefore(hr, sectionElement);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-image-grid": parse,
    "columns-article-meta": parse2,
    "tabs-testimonial": parse3,
    "cards-article": parse4,
    "columns-faq": parse5,
    "hero-overlay": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template for WKND Trendsetters fashion blog",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-image-grid",
        instances: [
          "header.section.secondary-section"
        ]
      },
      {
        name: "columns-article-meta",
        instances: [
          "section.section:nth-of-type(1)"
        ]
      },
      {
        name: "tabs-testimonial",
        instances: [
          "section.section:nth-of-type(2)"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "section.section.secondary-section:nth-of-type(2)"
        ]
      },
      {
        name: "columns-faq",
        instances: [
          "section.section:nth-of-type(3)"
        ]
      },
      {
        name: "hero-overlay",
        instances: [
          "section.section.inverse-section"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Section 1",
        selector: "header.section.secondary-section",
        style: "light-grey",
        blocks: [
          "columns-image-grid"
        ],
        defaultContent: [
          "header.section.secondary-section"
        ]
      },
      {
        id: "section-2",
        name: "Section 2",
        selector: "section.section:nth-of-type(1)",
        style: null,
        blocks: [
          "columns-article-meta"
        ],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Section 3",
        selector: "section.section.secondary-section:nth-of-type(1)",
        style: "light-grey",
        blocks: [],
        defaultContent: [
          "section.section.secondary-section:nth-of-type(1)"
        ]
      },
      {
        id: "section-4",
        name: "Section 4",
        selector: "section.section:nth-of-type(2)",
        style: null,
        blocks: [
          "tabs-testimonial"
        ],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Section 5",
        selector: "section.section.secondary-section:nth-of-type(2)",
        style: "light-grey",
        blocks: [
          "cards-article"
        ],
        defaultContent: [
          "section.section.secondary-section:nth-of-type(2)"
        ]
      },
      {
        id: "section-6",
        name: "Section 6",
        selector: "section.section:nth-of-type(3)",
        style: null,
        blocks: [
          "columns-faq"
        ],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Section 7",
        selector: "section.section.inverse-section",
        style: "dark",
        blocks: [
          "hero-overlay"
        ],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    /**
     * Main transformation function
     * See references/helix-importer-guidelines.md for transform() pattern
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let path = new URL(params.originalURL).pathname;
      path = path.replace(/\/$/, "").replace(/\.html$/, "");
      if (!path || path === "") {
        path = "/index";
      }
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
