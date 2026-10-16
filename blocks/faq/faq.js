/**
 * faq — split: section head (heading + lede) | accordion of native <details>.
 * Decode tier: reconstructive (repeat group = one row per question: first cell
 * question, remaining cells answer). The head is the row holding the heading.
 * A flattened single row alternates question / answer after the head.
 * The authored question paragraph is moved into <summary> to keep the native
 * <details> accordion the source ships (dynamics row x-faq-details); the
 * summary carries only the question + a decorative icon.
 */
// Authored nodes of every cell, in order (EW1: existing elements, moved later, never copied).
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    // #104 — wrapTextNodes may fold a media-led cell into ONE <p>; expand it back.
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')
      && (kids[0].children.length > 1 || kids[0].textContent.trim())) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text node → moved into a fresh <p>
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function wrapNodes(className, nodes, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(...nodes);
  return w;
}

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';

function cellNodes(row) {
  return collectNodes({ querySelectorAll: () => row.querySelectorAll(':scope > div') });
}

function item(question, answer) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.append(...question);
  summary.insertAdjacentHTML('beforeend', ICON);
  details.append(summary, wrapNodes('answer', answer));
  return details;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const head = [];
  const ledes = [];
  const pairs = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const all = cellNodes(row);
    if (!all.length) return;
    if (all.some(isHeading) && !pairs.length) {
      all.forEach((el) => (isHeading(el) || el.tagName !== 'P' ? head : ledes).push(el));
      return;
    }
    if (cells.length > 1) {
      const q = collectNodes({ querySelectorAll: () => [cells[0]] });
      const a = collectNodes({ querySelectorAll: () => cells.slice(1) });
      pairs.push([q, a]);
    } else {
      // flattened: alternate question / answer
      for (let i = 0; i < all.length; i += 2) {
        pairs.push([[all[i]], all[i + 1] ? [all[i + 1]] : []]);
      }
    }
  });
  // a single flattened row: the head took everything; split it after the lede
  if (!pairs.length && ledes.length > 1) {
    const flat = ledes.splice(1);
    for (let i = 0; i < flat.length; i += 2) {
      pairs.push([[flat[i]], flat[i + 1] ? [flat[i + 1]] : []]);
    }
  }
  const intro = wrapNodes('intro', head);
  if (ledes.length) intro.append(wrapNodes('lede', ledes));
  const list = document.createElement('div');
  list.className = 'faq-list';
  list.append(...pairs.map(([q, a]) => item(q, a)));
  block.replaceChildren(wrapNodes('split', [intro, list]));
}
