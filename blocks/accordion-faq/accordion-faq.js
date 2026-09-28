// decorative plus icon, rotated to a cross via CSS when the item is open
const PLUS_ICON = '<svg class="accordion-faq-item-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

/**
 * loads and decorates the accordion-faq block
 * Content contract: one row per FAQ item, two cells - [question] | [answer].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [label, ...rest] = [...row.children];
    if (!label) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    // unwrap a single paragraph/heading so summary holds phrasing content
    const only = label.children.length === 1 ? label.firstElementChild : null;
    const source = only && /^(P|H[1-6])$/.test(only.tagName) ? only : label;
    const text = document.createElement('span');
    text.className = 'accordion-faq-item-question';
    text.append(...source.childNodes);
    summary.append(text);
    summary.insertAdjacentHTML('beforeend', PLUS_ICON);

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    rest.forEach((cell) => body.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary);
    if (body.childNodes.length) details.append(body);
    row.replaceWith(details);
  });
}
