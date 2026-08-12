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

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, [class*="MuiTypography-h1"]');
    const subheading = element.querySelector('h6, [class*="MuiTypography-h6"]');
    const caption = element.querySelector('p, [class*="body2"]');
    const ctaButtons = Array.from(element.querySelectorAll("button"));
    const cells = [];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctaButtons.forEach((btn) => {
      const label = (btn.textContent || "").trim();
      if (!label) return;
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = label;
      p.appendChild(strong);
      contentCell.push(p);
    });
    if (caption) contentCell.push(caption);
    if (contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-tracks.js
  function parse2(element, { document }) {
    const tabButtons = Array.from(
      element.querySelectorAll(".MuiTabs-list .MuiTab-root, .MuiTabs-list button")
    );
    const trackCards = Array.from(element.querySelectorAll(".MuiCard-root"));
    const cells = [];
    tabButtons.forEach((btn, index) => {
      const label = (btn.textContent || "").trim();
      if (!label) return;
      const labelCell = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = label;
      labelCell.appendChild(strong);
      let contentCell = "";
      if (index === 0 && trackCards.length) {
        const list = document.createElement("ul");
        trackCards.forEach((card) => {
          const trackLabel = card.querySelector(".MuiTypography-body1, p");
          const text = trackLabel ? (trackLabel.textContent || "").trim() : "";
          if (!text) return;
          const li = document.createElement("li");
          li.textContent = text;
          list.appendChild(li);
        });
        if (list.children.length) contentCell = list;
      }
      cells.push([labelCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-tracks", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-testimonial.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".masonry-item .MuiCard-root, .MuiCard-root"));
    const cells = [];
    cards.forEach((card) => {
      const contentCell = [];
      const eyebrow = card.querySelector(".MuiTypography-caption");
      const eyebrowText = eyebrow ? (eyebrow.textContent || "").trim() : "";
      const quote = card.querySelector('p.mui-dw53iu, p[class*="body1"]');
      const bodyParas = Array.from(card.querySelectorAll('p[class*="body1"]'));
      const company = bodyParas.find((p) => p !== quote);
      const captions = Array.from(card.querySelectorAll(".MuiTypography-caption"));
      const readMore = captions.find((c) => c !== eyebrow);
      if (eyebrowText) {
        const h = document.createElement("h3");
        h.textContent = eyebrowText;
        contentCell.push(h);
      }
      if (quote) {
        const p = document.createElement("p");
        p.textContent = (quote.textContent || "").trim();
        contentCell.push(p);
      }
      if (company) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = (company.textContent || "").trim();
        p.appendChild(strong);
        contentCell.push(p);
      }
      if (readMore) {
        const text = (readMore.textContent || "").trim();
        if (text) {
          const p = document.createElement("p");
          const em = document.createElement("em");
          em.textContent = text;
          p.appendChild(em);
          contentCell.push(p);
        }
      }
      if (contentCell.length) cells.push([contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pricing.js
  function parse4(element, { document }) {
    const grid = element.querySelector('[class*="grid-cols-3"]');
    let tierCards = [];
    if (grid) {
      tierCards = Array.from(grid.children);
    }
    if (!tierCards.length) {
      tierCards = Array.from(element.querySelectorAll('h5.MuiTypography-h5, h5[class*="h5"]')).map((h) => h.closest("div")).filter(Boolean);
    }
    const cells = [];
    tierCards.forEach((card) => {
      const contentCell = [];
      const chip = card.querySelector(".MuiChip-label");
      if (chip && (chip.textContent || "").trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = (chip.textContent || "").trim();
        p.appendChild(em);
        contentCell.push(p);
      }
      const title = card.querySelector('h5.MuiTypography-h5, h5[class*="h5"], h5');
      if (title) {
        const h = document.createElement("h3");
        h.textContent = (title.textContent || "").trim();
        contentCell.push(h);
      }
      const price = card.querySelector('h2.MuiTypography-h2, h2[class*="h2"], h2');
      const originalPrice = card.querySelector('h6.MuiTypography-h6, h6[class*="h6"], h6');
      if (price) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = (price.textContent || "").trim();
        p.appendChild(strong);
        if (originalPrice && (originalPrice.textContent || "").trim()) {
          p.appendChild(document.createTextNode(" "));
          const del = document.createElement("del");
          del.textContent = (originalPrice.textContent || "").trim();
          p.appendChild(del);
        }
        contentCell.push(p);
      }
      const features = Array.from(card.querySelectorAll("p.mui-1dcyak8, p.mui-eqdl97"));
      if (features.length) {
        const ul = document.createElement("ul");
        features.forEach((f) => {
          const li = document.createElement("li");
          Array.from(f.childNodes).forEach((n) => li.appendChild(n.cloneNode(true)));
          ul.appendChild(li);
        });
        if (ul.children.length) contentCell.push(ul);
      }
      const cta = card.querySelector('a[href*="checkout"], a.MuiButton-root');
      if (cta) contentCell.push(cta);
      if (contentCell.length) cells.push([contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const items = Array.from(element.querySelectorAll(".MuiAccordion-root"));
    const cells = [];
    items.forEach((item) => {
      const title = item.querySelector(
        '.MuiAccordionSummary-content h6, .MuiAccordionSummary-content, h6[class*="h6"]'
      );
      const details = item.querySelector('.MuiAccordionDetails-root, [class*="AccordionDetails"]');
      const titleText = title ? (title.textContent || "").trim() : "";
      if (!titleText && !details) return;
      const titleCell = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = titleText;
      titleCell.appendChild(strong);
      let contentCell = "";
      if (details) {
        const frag = document.createElement("div");
        Array.from(details.childNodes).forEach((n) => frag.appendChild(n.cloneNode(true)));
        contentCell = frag;
      }
      cells.push([titleCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hellointerview-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      element.querySelectorAll("span > span:only-child").forEach((span) => {
        span.replaceWith(span.textContent);
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.relative.z-20.w-full",
        "header",
        ".footer",
        "next-route-announcer",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/hellointerview-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const doc = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;
      const target = element.querySelector(section.selector);
      if (!target) continue;
      if (section.style) {
        const meta = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        target.after(meta);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        target.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Hello Interview homepage with hero, learning tracks tabs, success stories, pricing tiers, and FAQ",
    urls: [
      "https://www.hellointerview.com/"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: [
          "div.min-h-screen div.relative.pt-16.animate-fadein",
          ".animate-fadein"
        ]
      },
      {
        name: "tabs-tracks",
        instances: [
          "div.min-h-screen section:nth-of-type(1)"
        ]
      },
      {
        name: "cards-testimonial",
        instances: [
          "div.min-h-screen section:nth-of-type(2)"
        ]
      },
      {
        name: "cards-pricing",
        instances: [
          "div.min-h-screen section:nth-of-type(3)"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "div.min-h-screen div.flex.flex-col.max-w-7xl.mx-auto:has(> .MuiAccordion-root)"
        ]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: "div.min-h-screen div.relative.pt-16.animate-fadein",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-learning-tracks",
        name: "Learning Tracks",
        selector: "div.min-h-screen section:nth-of-type(1)",
        style: null,
        blocks: ["tabs-tracks"],
        defaultContent: ["div.min-h-screen section:nth-of-type(1) h3"]
      },
      {
        id: "section-success-stories",
        name: "Success Stories",
        selector: "div.min-h-screen section:nth-of-type(2)",
        style: null,
        blocks: ["cards-testimonial"],
        defaultContent: ["div.min-h-screen section:nth-of-type(2) h3"]
      },
      {
        id: "section-pricing",
        name: "Pricing",
        selector: "div.min-h-screen section:nth-of-type(3)",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: ["div.min-h-screen section:nth-of-type(3) h3"]
      },
      {
        id: "section-faq",
        name: "FAQ",
        selector: "div.min-h-screen div.flex.flex-col.max-w-7xl.mx-auto:has(> .MuiAccordion-root)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-landing": parse,
    "tabs-tracks": parse2,
    "cards-testimonial": parse3,
    "cards-pricing": parse4,
    "accordion-faq": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
    const seen = /* @__PURE__ */ new Set();
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
          if (seen.has(element)) return;
          seen.add(element);
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
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
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
