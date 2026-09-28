/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-nav.js
  var import_nav_exports = {};
  __export(import_nav_exports, {
    default: () => import_nav_default
  });
  var slug = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  function img(document, name) {
    const el = document.createElement("img");
    el.src = `images/${name}`;
    el.alt = "";
    return el;
  }
  function p(document, ...children) {
    const el = document.createElement("p");
    children.forEach((c) => el.append(c));
    return el;
  }
  function link(document, href, text) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  }
  function buildBrand(document, navbar) {
    const logo = navbar.querySelector("a.logo");
    const a = document.createElement("a");
    a.href = logo.getAttribute("href") || "/";
    a.append(img(document, "nav-logo.svg"), logo.textContent.trim());
    return [p(document, a)];
  }
  function buildMegaMenu(document, mega) {
    const ul = document.createElement("ul");
    mega.querySelectorAll(":scope .mega-menu-grid > li").forEach((col) => {
      const li = document.createElement("li");
      const heading = col.querySelector("h3");
      if (heading) {
        li.append(p(document, heading.textContent.trim()));
        const items = document.createElement("ul");
        col.querySelectorAll(".mega-nav-link-item").forEach((item) => {
          const title = item.querySelector("strong").textContent.trim();
          const desc = item.querySelector(".paragraph-sm");
          const itemLi = document.createElement("li");
          itemLi.append(
            p(document, img(document, `nav-icon-${slug(title)}.svg`)),
            p(document, link(document, item.getAttribute("href"), title))
          );
          if (desc) itemLi.append(p(document, desc.textContent.trim()));
          items.append(itemLi);
        });
        li.append(items);
      } else {
        const card = col.querySelector("a");
        const strong = document.createElement("strong");
        strong.textContent = card.querySelector(".h3-heading").textContent.trim();
        li.append(p(document, strong));
        const text = card.querySelector("p");
        if (text) li.append(p(document, text.textContent.trim()));
        const cta = card.querySelector(".text-button");
        li.append(p(document, link(document, card.getAttribute("href"), cta.textContent.trim()), img(document, "nav-arrow-right.svg")));
      }
      ul.append(li);
    });
    return ul;
  }
  function buildMenu(document, navbar) {
    const ul = document.createElement("ul");
    navbar.querySelectorAll(".nav-menu-list > .nav-menu-list-item").forEach((item) => {
      const li = document.createElement("li");
      const trigger = item.querySelector(":scope > .nav-link, :scope > .nav-menu-dropdown > .nav-link");
      const label = trigger.textContent.trim();
      const mega = item.querySelector(".mega-menu");
      const dropdown = item.querySelector(".nav-menu-dropdown-list");
      if (mega) {
        li.append(p(document, label), buildMegaMenu(document, mega));
      } else if (dropdown) {
        const sub = document.createElement("ul");
        dropdown.querySelectorAll("a").forEach((a) => {
          const subLi = document.createElement("li");
          subLi.append(link(document, a.getAttribute("href"), a.textContent.trim()));
          sub.append(subLi);
        });
        li.append(p(document, label), sub);
      } else {
        li.append(p(document, link(document, trigger.getAttribute("href"), label)));
      }
      ul.append(li);
    });
    return [ul];
  }
  function buildTools(document, navbar) {
    return [...navbar.querySelectorAll(".nav-right a.button")].map((a) => {
      const strong = document.createElement("strong");
      strong.append(link(document, a.getAttribute("href"), a.textContent.trim()));
      return p(document, strong);
    });
  }
  var import_nav_default = {
    transform: ({ document }) => {
      const navbar = document.querySelector(".navbar");
      const main = document.createElement("div");
      const sections = [buildBrand, buildMenu, buildTools].map((fn) => fn(document, navbar));
      sections.forEach((nodes, i) => {
        if (i > 0) main.append(document.createElement("hr"));
        nodes.forEach((n) => main.append(n));
      });
      document.body.innerHTML = "";
      document.body.append(main);
      return [{
        element: document.body,
        path: "/nav",
        report: { title: "nav", template: "nav" }
      }];
    }
  };
  return __toCommonJS(import_nav_exports);
})();
