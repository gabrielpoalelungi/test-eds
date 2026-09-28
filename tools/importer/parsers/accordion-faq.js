/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Block contract (blocks/accordion-faq): one row per FAQ item, two cells - [question] | [answer].
 * Selectors validated against migration-work/block-context/accordion-faq/source.html:
 *   details.faq-item (x4) > summary.faq-question > span (question; decorative +/- SVG img dropped),
 *   div.faq-answer (answer paragraphs)
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll(':scope > details.faq-item'));
  if (!items.length) items = Array.from(element.querySelectorAll('details'));

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    let questionText = '';
    if (summary) {
      const span = summary.querySelector('span');
      questionText = (span ? span.textContent : summary.textContent).trim();
    }
    const answer = item.querySelector('.faq-answer') || Array.from(item.children).find((c) => c !== summary);
    if (!questionText && !answer) return;

    const q = document.createElement('p');
    q.textContent = questionText;

    const answerCell = [];
    if (answer) {
      const blocks = Array.from(answer.children);
      if (blocks.length) answerCell.push(...blocks);
      else if (answer.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = answer.textContent.trim();
        answerCell.push(p);
      }
    }
    cells.push([q, answerCell.length ? answerCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
