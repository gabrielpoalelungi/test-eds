import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import ico from '../../scripts/icons.js';

// BMW global navigation (.cmp-globalnavigation--transparent-white), rebuilt from /nav:
// section 1 brand, 2 primary list (nested lists = flyout groups), 3 tools,
// 4 My BMW panel, 5 assist launcher (fixed, appended to <body>).

const isDesktop = window.matchMedia('(width >= 1280px)');

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) node.setAttribute(k, '');
    else if (v !== false && v != null) node.setAttribute(k, v);
  });
  node.append(...children.filter(Boolean));
  return node;
}

/** first direct text of a list item (the delivered shape may wrap it in <p>) */
function ownLabel(li) {
  const p = li.querySelector(':scope > p');
  if (p && !p.querySelector('a')) return p.textContent.trim();
  return [...li.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ')
    .trim();
}

function ownLink(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}

function logoLink(section) {
  const a = section?.querySelector('a');
  const link = el('a', { class: 'gnav-logo', href: a?.getAttribute('href') || '/' });
  const label = a?.textContent.trim() || 'BMW Logo';
  link.setAttribute('aria-label', label);
  const icons = a ? [...a.querySelectorAll('.icon img, img')] : [];
  icons.forEach((img, i) => {
    img.alt = '';
    img.setAttribute('role', 'presentation');
    img.loading = 'eager';
    img.width = 52;
    img.height = 52;
    if (i > 0) img.classList.add('gnav-logo-grey');
    link.append(img);
  });
  return link;
}

function backButton(label = 'Close') {
  return el('button', { class: 'gnav-back', type: 'button', 'aria-label': label }, ico('chevron-left'));
}

function buildFlyout(label, groupsUl) {
  const cols = el('div', { class: 'gnav-flyout-cols' });
  [...(groupsUl?.children || [])].forEach((gli) => {
    const list = gli.querySelector(':scope > ul');
    const titleText = ownLabel(gli);
    const title = el('h3', { class: 'gnav-group-title' });
    const icon = gli.querySelector(':scope .icon img, :scope > p .icon img');
    if (icon && !list?.contains(icon)) {
      icon.alt = titleText;
      icon.width = 246;
      icon.height = 34;
      title.append(icon);
    } else {
      title.textContent = titleText;
    }
    const titleImg = title.querySelector('img');
    let drillLabel = el('span', {}, titleText);
    if (titleImg) {
      drillLabel = titleImg.cloneNode(true);
      drillLabel.alt = '';
    }
    const drillBtn = el(
      'button',
      { class: 'gnav-drill-btn', type: 'button', 'aria-expanded': 'false' },
      drillLabel,
      ico('chevron-right'),
    );
    const drillHead = el('div', { class: 'gnav-drill-head' }, backButton(), titleText);
    const group = el('div', { class: 'gnav-group' }, title, drillBtn, drillHead);
    if (list) group.append(list);
    // mobile drill-down: the panel slides in from the right (live: left 250ms)
    drillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      group.classList.add('is-drilled');
      cols.parentElement.classList.add('has-drill');
      drillBtn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        group.classList.add('is-drilled-in');
        drillHead.querySelector('.gnav-back').focus({ preventScroll: true });
      }));
    });
    drillHead.querySelector('.gnav-back').addEventListener('click', (e) => {
      e.stopPropagation();
      group.classList.remove('is-drilled-in');
      drillBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        group.classList.remove('is-drilled');
        cols.parentElement.classList.remove('has-drill');
        drillBtn.focus({ preventScroll: true });
      }, 250);
    });
    cols.append(group);
  });
  const head = el('div', { class: 'gnav-flyout-head' }, backButton(), label);
  return el('div', { class: 'gnav-flyout', hidden: true, 'data-flyout': label }, head, cols);
}

const TOOL_ICONS = [
  [/cart/i, 'cart'],
  [/wishlist|favorit/i, 'heart'],
  [/dealer|partener/i, 'pin'],
];

function toolIcon(href) {
  const hit = TOOL_ICONS.find(([re]) => re.test(href || ''));
  return hit ? hit[1] : 'person';
}

function buildAssist(section) {
  if (!section) return null;
  const ps = [...section.querySelectorAll(':scope > p, :scope > div > p')];
  const [launcherLabel, nudgeTitle, nudgeText, intro] = ps;
  const list = section.querySelector('ul');
  const aside = el('aside', { class: 'assist', role: 'complementary' });
  const nudge = el('div', { class: 'assist-nudge', hidden: true });
  const content = el('div', { class: 'assist-nudge-content' });
  if (nudgeTitle) {
    nudgeTitle.className = 'assist-nudge-title';
    content.append(nudgeTitle);
  }
  if (nudgeText) {
    nudgeText.className = 'assist-nudge-text';
    const em = nudgeText.querySelector('em');
    if (em) {
      const btn = el('button', { class: 'assist-nudge-link', type: 'button' });
      btn.append(...em.childNodes);
      em.replaceWith(btn);
    }
    content.append(nudgeText);
  }
  const closeNudge = el(
    'button',
    { class: 'assist-nudge-close', type: 'button', 'aria-label': 'WCAG.ariaLabel.Close' },
    ico('close'),
  );
  nudge.append(content, closeNudge);
  const dropdown = el('div', { class: 'assist-dropdown', hidden: true });
  if (intro) {
    intro.className = 'assist-intro';
    dropdown.append(intro);
  }
  if (list) dropdown.append(list);
  const label = launcherLabel?.textContent.trim() || 'Asistență clienți BMW';
  const btn = el(
    'button',
    {
      class: 'assist-btn assist-btn-pulse', type: 'button', 'aria-label': label, 'aria-expanded': 'false',
    },
    ico('bubbles'),
  );
  aside.append(nudge, dropdown, btn);

  const toggle = (open) => {
    dropdown.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle(dropdown.hidden);
  });
  nudge.querySelector('.assist-nudge-link')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle(true);
  });
  document.addEventListener('click', (e) => {
    if (!aside.contains(e.target)) toggle(false);
  });
  // observed on the live page: a timed nudge fades in, then out
  const hide = () => {
    nudge.classList.add('is-leaving');
    setTimeout(() => {
      nudge.hidden = true;
      nudge.classList.remove('is-leaving');
    }, 400);
  };
  setTimeout(() => {
    nudge.hidden = false;
    setTimeout(hide, 6000);
  }, 4000);
  closeNudge.addEventListener('click', hide);
  return aside;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment ? [...fragment.querySelectorAll(':scope > .section')] : [];
  const [brandSec, primarySec, toolsSec, myBmwSec, assistSec] = sections;

  block.textContent = '';
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  const skip = el(
    'a',
    { class: 'skip-link', href: '#main', 'aria-label': 'Skip to main content' },
    'Skip to main content',
  );
  const layer = el(
    'div',
    { class: 'gnav-layer', hidden: true },
    el('button', { class: 'gnav-layer-close', type: 'button', 'aria-label': 'Close details layer' }, ico('close')),
  );

  const gnav = el('div', { class: 'gnav' });
  const bar = el('nav', { class: 'gnav-bar', 'aria-label': 'Main navigation' });
  const logo = logoLink(brandSec);
  const list = el('menu', { class: 'gnav-list', 'aria-label': 'Navigation list' });
  const flyouts = [];

  const primaryUl = primarySec?.querySelector('ul');
  [...(primaryUl?.children || [])].forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    const a = ownLink(li);
    if (a && !sub) {
      const label = a.textContent.trim();
      a.className = 'gnav-link';
      a.setAttribute('aria-label', label);
      a.textContent = '';
      a.append(el('span', { class: 'gnav-label' }, label));
      list.append(el('li', {}, a));
      return;
    }
    const label = a ? a.textContent.trim() : ownLabel(li);
    const btn = el(
      'button',
      {
        class: 'gnav-link', type: 'button', 'aria-label': label, 'aria-expanded': 'false',
      },
      el('span', { class: 'gnav-label' }, label),
      ico('chevron-down', 'ico-desktop'),
      ico('chevron-right', 'ico-mobile'),
    );
    list.append(el('li', {}, btn));
    flyouts.push(buildFlyout(label, sub));
  });
  const primary = el('div', { class: 'gnav-primary' }, list);

  const secondary = el('menu', { class: 'gnav-secondary', 'aria-label': 'Navigation list' });
  let myBmwBtn = null;
  let dealerHref = null;
  [...(toolsSec?.querySelector('ul')?.children || [])].forEach((li) => {
    const a = ownLink(li);
    if (a) {
      const label = a.textContent.trim();
      const href = a.getAttribute('href');
      const kind = toolIcon(href);
      a.className = `gnav-icon${kind === 'pin' ? ' gnav-icon-desk' : ''}`;
      a.setAttribute('aria-label', label);
      a.textContent = '';
      a.append(ico(kind));
      if (kind === 'pin') dealerHref = { href, label };
      secondary.append(el('li', {}, a));
    } else {
      const label = ownLabel(li) || li.textContent.trim();
      myBmwBtn = el(
        'button',
        {
          class: 'gnav-icon', type: 'button', 'aria-label': label, 'aria-expanded': 'false',
        },
        ico('person'),
      );
      secondary.append(el('li', {}, myBmwBtn));
    }
  });
  const menuBtn = el(
    'button',
    { class: 'gnav-icon gnav-icon-menu', type: 'button', 'aria-label': 'Open navigation menu' },
    ico('menu'),
  );
  secondary.append(el('li', {}, menuBtn));
  bar.append(logo, primary, secondary);

  // mobile drawer bar (logo, dealer, close)
  const closeMenu = el(
    'button',
    { class: 'gnav-icon', type: 'button', 'aria-label': 'Close navigation menu' },
    ico('close'),
  );
  const mobileTools = el('menu', {});
  if (dealerHref) {
    mobileTools.append(el('li', {}, el(
      'a',
      { class: 'gnav-icon', href: dealerHref.href, 'aria-label': dealerHref.label },
      ico('pin'),
    )));
  }
  mobileTools.append(el('li', {}, closeMenu));
  const mobileLogo = logo.cloneNode(true);
  const mobileBar = el('nav', { class: 'gnav-mobile' }, mobileLogo, mobileTools);

  // My BMW panel
  if (myBmwSec) {
    const panel = el('div', { class: 'gnav-flyout-cols gnav-mybmw' });
    const content = myBmwSec.querySelector('.default-content-wrapper') || myBmwSec;
    panel.append(...content.children);
    // the last two lines are the sign-in / register actions (live: two buttons)
    [...panel.querySelectorAll(':scope > p')].slice(-2).forEach((p) => {
      p.classList.add('gnav-mybmw-action');
      if (!p.querySelector('span')) {
        const span = el('span');
        span.append(...p.childNodes);
        p.append(span);
      }
    });
    const head = el('div', { class: 'gnav-flyout-head' }, backButton());
    flyouts.push(el('div', { class: 'gnav-flyout', hidden: true, 'data-flyout': '' }, head, panel));
  }

  gnav.append(bar, el('div', { class: 'gnav-border' }), mobileBar, ...flyouts);
  block.append(skip, layer, gnav);

  // ---------- behaviour (observed: trigger click → solid-white bar + panel) ----------
  const triggers = [...list.querySelectorAll('button.gnav-link')];
  // the live page locks page scroll while a panel or the drawer is open
  const syncScrollLock = () => {
    const locked = gnav.classList.contains('is-open') || gnav.classList.contains('is-menu-open');
    document.body.style.overflowY = locked ? 'hidden' : '';
  };
  const resetDrill = (f) => {
    f.classList.remove('has-drill');
    f.querySelectorAll('.gnav-group.is-drilled').forEach((g) => {
      g.classList.remove('is-drilled', 'is-drilled-in');
      g.querySelector('.gnav-drill-btn')?.setAttribute('aria-expanded', 'false');
    });
  };
  const hidePanel = (f) => {
    if (f.hidden) return;
    f.classList.remove('is-visible');
    const done = () => {
      f.hidden = true;
      resetDrill(f);
    };
    // mobile panels slide out (live: left 150ms); desktop panels close at once
    if (isDesktop.matches) done();
    else f.closeTimer = setTimeout(done, 150);
  };
  const closeFlyouts = () => {
    flyouts.forEach(hidePanel);
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    myBmwBtn?.setAttribute('aria-expanded', 'false');
    gnav.classList.remove('is-open');
    syncScrollLock();
  };
  const openFlyout = (panel, trigger) => {
    clearTimeout(panel.closeTimer);
    resetDrill(panel);
    panel.hidden = false;
    trigger?.setAttribute('aria-expanded', 'true');
    gnav.classList.add('is-open');
    syncScrollLock();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.add('is-visible');
      // focus moves into the panel (live: Tab continues inside it)
      let first = panel.querySelector('.gnav-flyout-cols a');
      if (!isDesktop.matches) {
        first = panel.dataset.flyout ? panel.querySelector('.gnav-flyout-head .gnav-back') : mobileLogo;
      }
      first?.focus({ preventScroll: true });
    }));
  };
  const setMenu = (open) => {
    closeFlyouts();
    gnav.classList.toggle('is-menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    syncScrollLock();
    // focus moves into the drawer (live: Tab continues inside it)
    if (open) list.querySelector('.gnav-link')?.focus();
    else menuBtn.focus();
  };
  triggers.forEach((t) => t.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = t.getAttribute('aria-expanded') === 'true';
    closeFlyouts();
    if (wasOpen) return;
    const panel = flyouts.find((f) => f.dataset.flyout === t.getAttribute('aria-label'));
    if (panel) openFlyout(panel, t);
  }));
  myBmwBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = flyouts.find((f) => f.dataset.flyout === '');
    const wasOpen = panel && !panel.hidden;
    closeFlyouts();
    // mobile: the My BMW sheet sits under the drawer bar (logo, dealer, close) — CSS
    if (panel && !wasOpen) openFlyout(panel, myBmwBtn);
  });
  gnav.querySelectorAll('.gnav-flyout-head .gnav-back').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const opener = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
    closeFlyouts();
    // back on mobile returns focus to the drawer item that opened the panel
    if (!isDesktop.matches) opener?.focus({ preventScroll: true });
  }));
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(true);
  });
  closeMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (gnav.classList.contains('is-open')) closeFlyouts();
    else if (gnav.classList.contains('is-menu-open')) setMenu(false);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.gnav-flyout') && !gnav.classList.contains('is-menu-open')) closeFlyouts();
  });
  isDesktop.addEventListener('change', () => {
    if (gnav.classList.contains('is-menu-open')) setMenu(false);
    closeFlyouts();
  });

  const assist = buildAssist(assistSec);
  if (assist) document.body.append(assist);
}
