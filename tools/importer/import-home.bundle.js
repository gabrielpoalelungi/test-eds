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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector("h1, .h1-heading, h2");
    const subheading = element.querySelector("p.subheading") || element.querySelector("p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a"));
    const fallbackLinks = ctaLinks.length ? ctaLinks : Array.from(element.querySelectorAll("a.button"));
    const images = Array.from(element.querySelectorAll("img"));
    if (!heading && !subheading && !images.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (images.length) cells.push([images]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    fallbackLinks.forEach((link) => {
      const p = document2.createElement("p");
      const isSecondary = link.classList.contains("secondary-button");
      const wrapper = document2.createElement(isSecondary ? "em" : "strong");
      wrapper.append(link);
      p.append(wrapper);
      contentCell.push(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const heading = element.querySelector("h1, h2, h3, h4");
    const imageCol = columns.find((col) => col.querySelector("img") && !col.querySelector("h1, h2, h3, h4"));
    const image = imageCol ? imageCol.querySelector("img") : null;
    const textCol = heading && heading.closest(".grid-layout > div") || columns.find((col) => col !== imageCol) || element;
    if (!heading && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    const crumbLinks = Array.from(textCol.querySelectorAll(".breadcrumbs a"));
    if (crumbLinks.length) {
      const p = document2.createElement("p");
      crumbLinks.forEach((a, i) => {
        if (i > 0) p.append(document2.createTextNode(" / "));
        p.append(a);
      });
      textCell.push(p);
    }
    if (heading) textCell.push(heading);
    const metaRows = Array.from(textCol.querySelectorAll(".flex-horizontal"));
    metaRows.forEach((row) => {
      const parts = Array.from(row.querySelectorAll("span")).map((s) => s.textContent.trim()).filter(Boolean);
      const text = parts.length ? parts.join(" ") : row.textContent.trim().replace(/\s+/g, " ");
      if (text) {
        const p = document2.createElement("p");
        p.textContent = text;
        textCell.push(p);
      }
    });
    if (!metaRows.length) {
      textCol.querySelectorAll("p").forEach((p) => textCell.push(p));
    }
    const cells = [[image || "", textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > .utility-aspect-1x1"));
    if (!items.length) items = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (!img) return;
      const cell = [img];
      const caption = item.querySelector("p, figcaption, h3, h4");
      if (caption && caption.textContent.trim()) cell.push(caption);
      cells.push([cell]);
    });
    if (!cells.length) {
      element.querySelectorAll("img").forEach((img) => cells.push([img]));
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function buildNameRole(container, document2) {
    const out = [];
    if (!container) return out;
    const strong = container.querySelector("strong");
    const name = strong ? strong.textContent.trim() : "";
    if (name) {
      const p = document2.createElement("p");
      const s = document2.createElement("strong");
      s.textContent = name;
      p.append(s);
      out.push(p);
    }
    const role = Array.from(container.querySelectorAll("div, span")).find((el) => !el.querySelector("strong, img, div, p") && !el.closest("strong") && el.textContent.trim() && el.textContent.trim() !== name);
    if (role) {
      const p = document2.createElement("p");
      p.textContent = role.textContent.trim();
      out.push(p);
    }
    return out;
  }
  function parse4(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane, .tabs-content > [role="tabpanel"]'));
    const tabs = Array.from(element.querySelectorAll('.tab-menu > .tab-menu-link, .tab-menu > [role="tab"]'));
    const tabForPane = (pane, i) => {
      const m = (pane.id || "").match(/(\d+)$/);
      if (m) {
        const byId = tabs.find((t) => (t.id || "").endsWith(`-${m[1]}`));
        if (byId) return byId;
      }
      return tabs[i] || null;
    };
    const cells = [];
    panes.forEach((pane, i) => {
      const tab = tabForPane(pane, i);
      const labelCell = [];
      if (tab) {
        const avatar = tab.querySelector(".avatar img") || tab.querySelector("img");
        if (avatar) labelCell.push(avatar);
        const textWrap = avatar && avatar.closest(".avatar") && avatar.closest(".avatar").nextElementSibling || tab;
        labelCell.push(...buildNameRole(textWrap, document2));
      }
      const panelCell = [];
      const panelImg = pane.querySelector("img");
      if (panelImg) panelCell.push(panelImg);
      const quote = pane.querySelector("p.paragraph-xl") || pane.querySelector("p, blockquote");
      const nameWrap = (() => {
        const strong = pane.querySelector("strong");
        if (!strong) return null;
        const nameLine = strong.closest("div");
        return nameLine && nameLine.parentElement || nameLine;
      })();
      panelCell.push(...buildNameRole(nameWrap, document2));
      if (quote) panelCell.push(quote);
      if (!labelCell.length) {
        const strong = pane.querySelector("strong");
        if (strong) labelCell.push(strong.textContent.trim());
      }
      if (!panelCell.length) return;
      cells.push([labelCell.length ? labelCell : "", panelCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(".article-card-body")).map((body) => {
      const card = body.closest("a, .article-card") || body.parentElement;
      return {
        body,
        image: card && card.querySelector(".article-card-image img") || body.parentElement && body.parentElement.querySelector("img"),
        href: body.closest("a") && body.closest("a").getAttribute("href") || ""
      };
    });
    if (!items.length) {
      items = Array.from(element.querySelectorAll(":scope > a, :scope > .article-card")).map((card) => ({
        body: card,
        image: card.querySelector("img"),
        href: card.getAttribute("href") || ""
      }));
    }
    const cells = [];
    items.forEach(({ body, image, href }) => {
      const textCell = [];
      const tag = body.querySelector(".tag");
      const metaSpans = Array.from(body.querySelectorAll(".article-card-meta span"));
      const date = metaSpans.find((s) => s !== tag && s.textContent.trim());
      if (tag && tag.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = tag.textContent.trim();
        textCell.push(p);
      }
      if (date) {
        const p = document2.createElement("p");
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }
      const heading = body.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) {
        const h3 = document2.createElement("h3");
        const title = heading.textContent.trim();
        if (href) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = title;
          h3.append(a);
        } else {
          h3.textContent = title;
        }
        textCell.push(h3);
      }
      if (!image && !textCell.length) return;
      cells.push([image || "", textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > details.faq-item"));
    if (!items.length) items = Array.from(element.querySelectorAll("details"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let questionText = "";
      if (summary) {
        const span = summary.querySelector("span");
        questionText = (span ? span.textContent : summary.textContent).trim();
      }
      const answer = item.querySelector(".faq-answer") || Array.from(item.children).find((c) => c !== summary);
      if (!questionText && !answer) return;
      const q = document2.createElement("p");
      q.textContent = questionText;
      const answerCell = [];
      if (answer) {
        const blocks = Array.from(answer.children);
        if (blocks.length) answerCell.push(...blocks);
        else if (answer.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = answer.textContent.trim();
          answerCell.push(p);
        }
      }
      cells.push([q, answerCell.length ? answerCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector("img.cover-image") || element.querySelector("img");
    const body = element.querySelector(".card-body") || element;
    const heading = body.querySelector("h1, h2, h3");
    const subheading = body.querySelector("p.subheading") || body.querySelector("p");
    let ctaLinks = Array.from(body.querySelectorAll(".button-group a"));
    if (!ctaLinks.length) ctaLinks = Array.from(body.querySelectorAll("a.button"));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctaLinks.forEach((link) => {
      const p = document2.createElement("p");
      p.append(link);
      contentCell.push(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.navbar",
        "footer.footer.inverse-footer",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].filter((attr) => attr.name.startsWith("data-astro-cid")).forEach((attr) => el.removeAttribute(attr.name));
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-split": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Homepage: split hero, featured article, photo gallery, testimonial tabs, latest articles, FAQ and closing CTA banner",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-split",
        instances: ["header.section.secondary-section > .container > .grid-layout"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) > .container > .grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.inverse-section .utility-position-relative.utility-radius-card"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "hero",
        selector: ["#main-content > header.section.secondary-section", "header.section.secondary-section"],
        style: "grey",
        blocks: ["hero-split"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "featured-article",
        selector: ["#main-content > section.section:nth-of-type(1)"],
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "gallery",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(2)"],
        style: "grey",
        blocks: ["cards-gallery"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) .utility-text-align-center"]
      },
      {
        id: "rc4",
        name: "testimonials",
        selector: ["#main-content > section.section:nth-of-type(3)"],
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "latest-articles",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(4)"],
        style: "grey",
        blocks: ["cards-article"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) .utility-text-align-center"]
      },
      {
        id: "rc6",
        name: "faq",
        selector: ["#main-content > section.section:nth-of-type(5)"],
        style: "faq-split",
        blocks: ["accordion-faq"],
        defaultContent: ["#main-content > section.section:nth-of-type(5) .grid-layout > div:first-child"]
      },
      {
        id: "rc7",
        name: "cta-banner",
        selector: ["#main-content > section.section.inverse-section", "section.section.inverse-section"],
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
