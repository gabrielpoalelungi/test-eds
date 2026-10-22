# KFC Romania homepage migration plan

**Source page:** https://kfc.ro/
**Page type:** Standard content page. You don't need the commerce, forms or Figma add-ons for this page.
**Goal:** Move the KFC Romania homepage into AEM Edge Delivery Services. The migrated page should keep the same content and structure, use blocks authors can edit, and look as close to the original as possible.

> **Status: ready to run. Switch to Execute mode to start.** You've approved the plan, but plan mode is still on, so nothing has been changed yet. The work begins with the first checklist item as soon as you switch to Execute mode.

## Approach

1. **Project setup:** Work out the project type (Document Authoring, document-based or Universal Editor) and which block library to use.
2. **Page analysis:** Scrape https://kfc.ro/ and save screenshots, cleaned HTML, metadata and images. Then split the page into sections and identify the block for each part (hero, promo cards, product or menu teasers, columns, carousels and so on).
3. **Block mapping:** Reuse existing blocks wherever they fit (80% or closer). Create a new block or variant only where nothing existing matches.
4. **Import setup:** Write the parsers (one per block variant), the cleanup and section transformers, and the import script for this page.
5. **Content import:** Run the import to produce the migrated homepage. Then check that every section, heading, image and link came through.
6. **Header and footer:** Rebuild the KFC navigation (including the mobile menu) and the footer from the live site.
7. **Design:** Bring over the site-wide look (colours, fonts, spacing), then style each block to match the original.
8. **Visual check:** Compare the migrated page with the original on desktop and mobile, and fix any differences.

## Things to watch for

- **Cookie banner and pop-ups:** kfc.ro may show a consent banner or location/app pop-ups. These are left out of the migrated content.
- **Bot protection:** If the site blocks automated access, a fallback scraping method is used.
- **Content that loads dynamically:** Things like store finders, ordering widgets or app-download links may need a simple placeholder block instead of a working copy.
- **Language:** The content stays in Romanian.
- **Where changes go:** Everything is created locally only. Nothing is uploaded to Document Authoring, previewed remotely or published unless you ask for it.

## Checklist

- [ ] Work out the project type and block library
- [ ] Scrape https://kfc.ro/ (screenshots, HTML, metadata, images)
- [ ] Analyse the page structure and identify sections and block variants
- [ ] Name block variants, reusing existing ones where they fit
- [ ] Add block and section mappings to the page template configuration
- [ ] Generate or adapt the block code for any new blocks or variants
- [ ] Generate the import parsers and transformers
- [ ] Generate the homepage import script
- [ ] Run the content import and check the imported homepage
- [ ] Migrate the header and navigation (desktop and mobile)
- [ ] Migrate the footer
- [ ] Apply the site-wide design (colours, fonts, spacing)
- [ ] Style each block to match the original
- [ ] Compare the whole page with the original on desktop and mobile, then fix differences
- [ ] Summarise what changed (local only) and suggest next steps (uploading to Document Authoring, previewing, more pages)
