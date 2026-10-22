/* eslint-disable */
/* global WebImporter */

/**
 * Parser for search-restaurant (kfc.ro restaurant finder input).
 * Source: .search-restaurant-input > form > label + input#find_restaurant
 * Block: row 1 = label / placeholder text, row 2 = link to the restaurant locator (/restaurante).
 */

const LOCATOR_HREF = '/restaurante';
const DEFAULT_LABEL = 'Găsește un restaurant';

export default function parse(element, { document }) {
  const input = element.querySelector('input');
  const label = element.querySelector('label');
  const text = (input && input.getAttribute('placeholder') && input.getAttribute('placeholder').trim())
    || (label && label.textContent.trim())
    || (input && input.getAttribute('aria-label') && input.getAttribute('aria-label').trim())
    || DEFAULT_LABEL;

  const labelP = document.createElement('p');
  labelP.textContent = text;

  const linkP = document.createElement('p');
  const a = document.createElement('a');
  a.href = LOCATOR_HREF;
  a.textContent = text;
  linkP.append(a);

  const cells = [[[labelP]], [[linkP]]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'search-restaurant', cells });
  element.replaceWith(block);
}
