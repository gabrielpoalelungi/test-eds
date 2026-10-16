/**
 * testimonials — tabbed testimonials: one panel (photo | name, role, quote)
 * per person, plus a tablist of avatar + name/role buttons.
 * Decode tier: reconstructive (repeat group = one row per person; a flattened
 * single row is segmented on its "who" paragraph). Per group: media before the
 * text = photo, media after it = tab avatar, the paragraph holding <strong> =
 * name + role, remaining paragraphs = quote.
 * Tab labels are presentational clones of the authored "who" paragraph with
 * editor indices stripped (EW4); the authored one stays in the visible panel.
 * Behaviour: click selects; ArrowLeft/Right/Up/Down, Home, End move the tab.
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

const MEDIA = 'picture, img';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);
const mediaOf = (el) => {
  if (el.matches('picture')) return el;
  return el.querySelector('picture') || (el.matches('img') ? el : el.querySelector('img'));
};

function wrapNodes(className, nodes, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(...nodes);
  return w;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  el.removeAttribute('data-image-index');
  return el;
}

function groupsOf(block) {
  const rows = [...block.children];
  const perRow = rows.map((row) => collectNodes({
    querySelectorAll: () => row.querySelectorAll(':scope > div'),
  })).filter((n) => n.length);
  if (perRow.length > 1) return perRow;
  // flattened: open a new group at a second "who" paragraph's photo
  const nodes = perRow[0] || [];
  const groups = [];
  let cur = [];
  let hasWho = false;
  let pendingMedia = [];
  nodes.forEach((el) => {
    const who = el.tagName === 'P' && el.querySelector('strong') && !isMedia(el);
    if (isMedia(el) && !el.textContent.trim()) {
      if (hasWho) pendingMedia.push(el);
      else cur.push(el);
      return;
    }
    if (who && hasWho) {
      // first pending media was this group's avatar, the rest open the next group
      cur.push(...pendingMedia.slice(0, pendingMedia.length > 1 ? 1 : 0));
      groups.push(cur);
      cur = pendingMedia.slice(pendingMedia.length > 1 ? 1 : 0);
      pendingMedia = [];
      hasWho = false;
    }
    cur.push(...pendingMedia);
    pendingMedia = [];
    if (who) hasWho = true;
    cur.push(el);
  });
  cur.push(...pendingMedia);
  if (cur.length) groups.push(cur);
  return groups;
}

export default function decorate(block) {
  const groups = groupsOf(block);
  if (!groups.length) return;
  const n = [...document.querySelectorAll('.testimonials.block')].indexOf(block);
  const uid = `testimonials-${n < 0 ? 0 : n}`;
  const panels = [];
  const tabs = [];
  groups.forEach((nodes, i) => {
    let photo = null;
    let avatar = null;
    let who = null;
    let seenText = false;
    const quote = [];
    const rest = [];
    nodes.forEach((el) => {
      if (isMedia(el) && !el.textContent.trim()) {
        if (!photo && !seenText) photo = mediaOf(el);
        else if (!avatar) avatar = mediaOf(el);
        else rest.push(mediaOf(el));
        return;
      }
      seenText = true;
      if (!who && el.tagName === 'P' && el.querySelector('strong')) who = el;
      else if (el.tagName === 'P') quote.push(el);
      else rest.push(el);
    });
    if (!who && quote.length > 1) who = quote.shift();

    const panel = document.createElement('div');
    panel.className = 'testimonial';
    panel.id = `${uid}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${uid}-tab-${i}`);
    if (i) panel.hidden = true;
    if (photo) panel.append(wrapNodes('photo', [photo]));
    const text = document.createElement('div');
    text.className = 'text';
    if (who) text.append(wrapNodes('who', [who]));
    if (quote.length) text.append(wrapNodes('quote', quote, 'blockquote'));
    text.append(...rest);
    panel.append(text);
    panels.push(panel);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `${uid}-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    tab.setAttribute('aria-selected', i ? 'false' : 'true');
    tab.tabIndex = i ? -1 : 0;
    const person = document.createElement('span');
    person.className = 'person';
    if (avatar) person.append(wrapNodes('avatar', [avatar], 'span'));
    const label = document.createElement('span');
    label.className = 'label';
    if (who) {
      // presentational clone of the authored name/role (EW4)
      const clone = stripInstrumentation(who.cloneNode(true));
      label.append(...clone.childNodes);
    } else label.textContent = `${i + 1}`;
    person.append(label);
    tab.append(person);
    tabs.push(tab);
  });

  const list = document.createElement('div');
  list.className = 'tablist';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Testimonials');
  list.append(...tabs);

  const select = (tab, focus = true) => {
    tabs.forEach((t, j) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const keys = {
        ArrowRight: i + 1,
        ArrowDown: i + 1,
        ArrowLeft: i - 1,
        ArrowUp: i - 1,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select(tabs[(keys[e.key] + tabs.length) % tabs.length]);
    });
  });

  block.replaceChildren(...panels, list);
}
