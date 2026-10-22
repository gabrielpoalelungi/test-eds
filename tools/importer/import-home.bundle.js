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

  // tools/importer/parsers/carousel-hero.js
  function absUrl(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function makeImage(document, img) {
    if (!img) return null;
    const out = document.createElement("img");
    out.src = absUrl(img.getAttribute("src") || img.src);
    out.alt = img.getAttribute("alt") || "";
    return out;
  }
  function parse(element, { document }) {
    const slides = [...element.querySelectorAll("swiper-slide")];
    const cells = [];
    slides.forEach((slide, idx) => {
      const imageCell = [];
      const img = makeImage(document, slide.querySelector(".hero-image img"));
      if (img) imageCell.push(img);
      const contentCell = [];
      const headline = slide.querySelector(".headline, h1, h2");
      if (headline && headline.textContent.trim()) {
        const h = document.createElement(idx === 0 ? "h1" : "h2");
        h.textContent = headline.textContent.trim();
        contentCell.push(h);
      }
      slide.querySelectorAll(".hero-content .body p").forEach((p) => {
        if (!p.textContent.trim()) return;
        const para = document.createElement("p");
        para.innerHTML = p.innerHTML.trim();
        contentCell.push(para);
      });
      const cta = slide.querySelector(".hero-content a[href]");
      if (cta) {
        const label = (cta.querySelector(".text") || cta).textContent.trim();
        if (label) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = cta.getAttribute("href");
          a.textContent = label;
          p.append(a);
          contentCell.push(p);
        }
      }
      slide.querySelectorAll(".hero-disclaimer p").forEach((p) => {
        if (!p.textContent.trim()) return;
        const para = document.createElement("p");
        para.textContent = p.textContent.trim();
        contentCell.push(para);
      });
      if (imageCell.length || contentCell.length) cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-offers.js
  var FALLBACK_HREF = "/ofertepebune/";
  function absUrl2(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function makeImage2(document, img) {
    if (!img) return null;
    const out = document.createElement("img");
    out.src = absUrl2(img.getAttribute("src") || img.src);
    out.alt = img.getAttribute("alt") || "";
    return out;
  }
  function parse2(element, { document }) {
    const slides = [...element.querySelectorAll("swiper-slide")];
    const cells = [];
    slides.forEach((slide) => {
      const card = slide.querySelector(".offer-card") || slide;
      const imageCell = [];
      const img = makeImage2(document, card.querySelector(".card-image-wrapper img, img.card-image"));
      if (img) imageCell.push(img);
      const contentCell = [];
      const titleEl = card.querySelector(".card-title");
      const title = titleEl ? titleEl.textContent.trim() : "";
      if (title) {
        const link = slide.querySelector("a[href]");
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = link ? link.getAttribute("href") : FALLBACK_HREF;
        a.textContent = title;
        h3.append(a);
        contentCell.push(h3);
      }
      const availability = card.querySelector(".availability-text");
      if (availability && availability.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = availability.textContent.trim();
        contentCell.push(p);
      }
      if (imageCell.length || contentCell.length) cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-offers", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function absUrl3(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function slugify(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function parse3(element, { document }) {
    const items = [...element.querySelectorAll(".product-category")];
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".product-category-title");
      const label = titleEl ? titleEl.textContent.trim() : "";
      if (!label) return;
      const imageCell = [];
      const srcImg = item.querySelector("img.product-category-image") || item.querySelector("img");
      if (srcImg) {
        const img = document.createElement("img");
        img.src = absUrl3(srcImg.getAttribute("src") || srcImg.src);
        img.alt = srcImg.getAttribute("alt") || label;
        imageCell.push(img);
      }
      const a = document.createElement("a");
      a.href = `/meniu/${slugify(label)}`;
      a.textContent = label;
      cells.push([imageCell, [a]]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function absUrl4(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function parse4(element, { document }) {
    const cards = [...element.querySelectorAll(".product-card")];
    const cells = [];
    cards.forEach((card) => {
      const wrapper = card.parentElement || card;
      const imageCell = [];
      const srcImg = card.querySelector("img.card-image");
      if (srcImg) {
        const img = document.createElement("img");
        img.src = absUrl4(srcImg.getAttribute("src") || srcImg.src);
        img.alt = srcImg.getAttribute("alt") || "";
        imageCell.push(img);
      }
      const bodyCell = [];
      const badge = card.querySelector(".label-new-product");
      if (badge && badge.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = badge.textContent.trim();
        bodyCell.push(p);
      }
      const titleEl = card.querySelector(".card-title");
      if (titleEl && titleEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        bodyCell.push(h3);
      }
      const descEl = card.querySelector(".card-description");
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        bodyCell.push(p);
      }
      const detailsLink = card.querySelector("a.black[href]") || card.querySelector("a[href]") || wrapper.querySelector("a[href]");
      if (detailsLink) {
        const labelEl = detailsLink.querySelector(".underline");
        const label = (labelEl ? labelEl.textContent : detailsLink.textContent).trim() || "Vezi detalii";
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = detailsLink.getAttribute("href");
        a.textContent = label;
        p.append(a);
        bodyCell.push(p);
      }
      if (imageCell.length || bodyCell.length) cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-app.js
  function absUrl5(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function makeImage3(document, img) {
    if (!img) return null;
    const out = document.createElement("img");
    out.src = absUrl5(img.getAttribute("src") || img.src);
    out.alt = img.getAttribute("alt") || "";
    return out;
  }
  function parse5(element, { document }) {
    const textCell = [];
    const logo = makeImage3(document, element.querySelector("img.app-logo"));
    if (logo) {
      logo.alt = "KFC App";
      const p = document.createElement("p");
      p.append(logo);
      textCell.push(p);
    }
    const left = element.querySelector(".left-content") || element;
    const headline = left.querySelector(".headline");
    if (headline && headline.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = headline.textContent.replace(/\s+/g, " ").trim();
      textCell.push(h2);
    }
    left.querySelectorAll(".description").forEach((desc) => {
      const icon = desc.querySelector("img.description-icon");
      const paragraphs = [...desc.querySelectorAll(".description-text p")].filter((p) => p.textContent.trim());
      paragraphs.forEach((src, i) => {
        const p = document.createElement("p");
        if (icon && i === 0) {
          const img = makeImage3(document, icon);
          img.alt = "";
          p.append(img, " ");
        }
        const span = document.createElement("span");
        span.innerHTML = src.innerHTML.trim();
        p.append(...span.childNodes);
        textCell.push(p);
      });
    });
    const cta = left.querySelector(".cta-button a[href]");
    if (cta) {
      const label = (cta.querySelector(".text") || cta).textContent.trim();
      if (label) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = label;
        p.append(a);
        textCell.push(p);
      }
    }
    const mediaCell = [];
    const media = makeImage3(document, element.querySelector(".right-content img"));
    if (media) {
      if (!media.alt || media.alt === "image") media.alt = "KFC App";
      mediaCell.push(media);
    }
    const cells = [[textCell, mediaCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-app", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse6(element, { document }) {
    const textCell = [];
    element.querySelectorAll(".description p").forEach((src) => {
      if (!src.textContent.trim()) return;
      const p = document.createElement("p");
      p.innerHTML = src.innerHTML.trim();
      textCell.push(p);
    });
    const actionCell = [];
    const cta = element.querySelector(".cta-button a[href]") || element.querySelector("a[href]");
    if (cta) {
      const label = (cta.querySelector(".text") || cta).textContent.trim();
      if (label) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = label;
        p.append(a);
        actionCell.push(p);
      }
    }
    const cells = [[textCell, actionCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-campaigns.js
  function absUrl6(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function parse7(element, { document }) {
    const slides = [...element.querySelectorAll("swiper-slide")];
    const cells = [];
    slides.forEach((slide) => {
      const card = slide.querySelector(".campaign-card") || slide;
      const imageCell = [];
      const srcImg = card.querySelector("img.card-image");
      if (srcImg) {
        const img = document.createElement("img");
        img.src = absUrl6(srcImg.getAttribute("src") || srcImg.src);
        img.alt = srcImg.getAttribute("alt") || "";
        imageCell.push(img);
      }
      const contentCell = [];
      const headline = card.querySelector(".card-headline, h2, h3");
      if (headline && headline.textContent.trim()) {
        const h2 = document.createElement("h2");
        h2.textContent = headline.textContent.trim();
        contentCell.push(h2);
      }
      const body = card.querySelector(".card-body");
      if (body && body.textContent.trim()) {
        const p = document.createElement("p");
        p.innerHTML = body.innerHTML.trim();
        contentCell.push(p);
      }
      const cta = card.querySelector(".card-button a[href]") || card.querySelector("a[href]");
      if (cta) {
        const label = (cta.querySelector(".text") || cta).textContent.trim();
        if (label) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = cta.getAttribute("href");
          a.textContent = label;
          p.append(a);
          contentCell.push(p);
        }
      }
      if (imageCell.length || contentCell.length) cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-campaigns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/search-restaurant.js
  var LOCATOR_HREF = "/restaurante";
  var DEFAULT_LABEL = "G\u0103se\u0219te un restaurant";
  function parse8(element, { document }) {
    const input = element.querySelector("input");
    const label = element.querySelector("label");
    const text = input && input.getAttribute("placeholder") && input.getAttribute("placeholder").trim() || label && label.textContent.trim() || input && input.getAttribute("aria-label") && input.getAttribute("aria-label").trim() || DEFAULT_LABEL;
    const labelP = document.createElement("p");
    labelP.textContent = text;
    const linkP = document.createElement("p");
    const a = document.createElement("a");
    a.href = LOCATOR_HREF;
    a.textContent = text;
    linkP.append(a);
    const cells = [[[labelP]], [[linkP]]];
    const block = WebImporter.Blocks.createBlock(document, { name: "search-restaurant", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-heritage.js
  function absUrl7(src) {
    if (!src) return "";
    try {
      return new URL(src, "https://kfc.ro/").href;
    } catch (e) {
      return src;
    }
  }
  function makeImage4(document, img, alt) {
    if (!img) return null;
    const out = document.createElement("img");
    out.src = absUrl7(img.getAttribute("src") || img.src);
    out.alt = alt || img.getAttribute("alt") || "";
    return out;
  }
  function parse9(element, { document }) {
    const leftCell = [];
    const left = makeImage4(document, element.querySelector("img.image-left"), "KFC heritage");
    if (left) leftCell.push(left);
    const contentCell = [];
    const content = element.querySelector(".heritage-content") || element;
    const title = content.querySelector(".title");
    if (title && title.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      contentCell.push(h2);
    }
    content.querySelectorAll("p.body, .body p").forEach((src) => {
      if (!src.textContent.trim()) return;
      const p = document.createElement("p");
      p.innerHTML = src.innerHTML.trim();
      contentCell.push(p);
    });
    const cta = content.querySelector(".button a[href]") || content.querySelector("a[href]");
    if (cta) {
      const label = (cta.querySelector(".text") || cta).textContent.trim();
      if (label) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = label;
        p.append(a);
        contentCell.push(p);
      }
    }
    const rightCell = [];
    const right = makeImage4(document, element.querySelector("img.image-right"), "Colonel Sanders");
    [right, makeImage4(document, element.querySelector("img.signature"), "Semn\u0103tura Colonelului")].filter(Boolean).forEach((img) => {
      const p = document.createElement("p");
      p.append(img);
      rightCell.push(p);
    });
    const cells = [[leftCell, contentCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-heritage", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/kfc-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "#CybotCookiebotDialog",
        '[id^="CybotCookiebot"]',
        "iframe.CybotCookiebotHiddenIframe",
        "iframe.CybotCookiebotOffscreenIframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "dialog#location_select_modal",
        "dialog.svelte-1af6gkq",
        "dialog.svelte-1r5sxm2",
        "dialog"
      ]);
      WebImporter.DOMUtils.remove(element, ["nav#menu-panel"]);
      WebImporter.DOMUtils.remove(element, ["button.got-to-top-btn"]);
      WebImporter.DOMUtils.remove(element, ["#svelte-announcer"]);
      WebImporter.DOMUtils.remove(element, ["a.skip-to-main", "section.heritage img.stripes"]);
      element.querySelectorAll(".featured-offers .section-title").forEach((title) => {
        const h2 = element.ownerDocument.createElement("h2");
        h2.textContent = title.textContent.replace(/\s+/g, " ").trim();
        title.replaceWith(h2);
      });
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header.svelte-h4y2dc",
        "header",
        "footer.svelte-13uj0x1",
        "footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "noscript",
        "link",
        "iframe",
        "object",
        "embed",
        "form#close_modal"
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const w = img.getAttribute("width");
        const h = img.getAttribute("height");
        if ((w === "1" || w === "0") && (h === "1" || h === "0")) img.remove();
      });
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("data-gtm") || n.startsWith("data-track") || n.startsWith("data-analytics") || n === "onclick" || n === "onload") {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/kfc-sections.js
  var MARKER_ATTR = "data-excat-section-id";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const document = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(element, section);
        if (!el) continue;
        if (i === 0 && !section.style) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(MARKER_ATTR, section.id);
        if (i === 0) hr.setAttribute("data-excat-first-section", "true");
        el.parentNode.insertBefore(hr, el);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${MARKER_ATTR}="${section.id}"]`);
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        let anchor = null;
        if (marker) {
          let node = marker.nextSibling;
          while (node && !(node.nodeType === 1 && node.tagName === "HR")) {
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
          if (marker.hasAttribute("data-excat-first-section")) {
            marker.remove();
          } else {
            marker.removeAttribute(MARKER_ATTR);
          }
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "carousel-hero": parse,
    "carousel-offers": parse2,
    "cards-category": parse3,
    "cards-product": parse4,
    "columns-app": parse5,
    "columns-cta": parse6,
    "carousel-campaigns": parse7,
    "search-restaurant": parse8,
    "columns-heritage": parse9
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
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
        document.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode || !main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
