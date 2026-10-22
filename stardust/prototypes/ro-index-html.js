/* ro-index-html.js — interaction parity only (behaviours observed on the live page). */
(() => {
  // hero video play/pause (live: .cmp-progressiveplaybutton)
  const video = document.querySelector('.hero__video');
  const play = document.querySelector('.hero__play');
  if (video && play) {
    play.addEventListener('click', () => {
      const paused = play.getAttribute('aria-pressed') === 'true';
      play.setAttribute('aria-pressed', String(!paused));
      if (paused) video.play().catch(() => {}); else video.pause();
    });
  }
  // info-i tooltip toggle (live: .cmp-infoi__icon → .style-tooltip-container--full)
  const closeAll = (except) => document.querySelectorAll('.infoi.is-open').forEach((el) => {
    if (el !== except) { el.classList.remove('is-open'); el.querySelector('.infoi__btn').setAttribute('aria-expanded', 'false'); }
  });
  document.querySelectorAll('.infoi').forEach((el) => {
    const btn = el.querySelector('.infoi__btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !el.classList.contains('is-open');
      closeAll(el);
      el.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    el.querySelector('.infoi__close').addEventListener('click', (e) => { e.stopPropagation(); closeAll(); });
  });
  document.addEventListener('click', () => closeAll());
  // footer accordion (<768 only; CSS ignores aria-expanded above that)
  document.querySelectorAll('.flist__title').forEach((t) => {
    const toggle = () => t.setAttribute('aria-expanded', String(t.getAttribute('aria-expanded') !== 'true'));
    t.addEventListener('click', toggle);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  // header flyouts (observed: trigger click → bar turns solid white, panel opens; same trigger / back closes)
  const gnav = document.querySelector('.gnav');
  const triggers = [...document.querySelectorAll('.gnav__primary button.gnav__link')];
  const flyouts = [...document.querySelectorAll('.gnav__flyout')];
  const closeFlyouts = () => {
    flyouts.forEach((f) => { f.hidden = true; f.classList.remove('is-visible'); });
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    gnav.classList.remove('is-open');
  };
  triggers.forEach((t) => t.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = t.getAttribute('aria-expanded') === 'true';
    closeFlyouts();
    if (wasOpen) return;
    const panel = flyouts.find((f) => f.dataset.flyout === t.getAttribute('aria-label'));
    if (!panel) return;
    panel.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('is-visible')));
    t.setAttribute('aria-expanded', 'true');
    gnav.classList.add('is-open');
  }));
  document.querySelectorAll('.gnav__back').forEach((b) => b.addEventListener('click', closeFlyouts));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeFlyouts(); closeAll(); } });
  document.addEventListener('click', (e) => { if (!e.target.closest('.gnav__flyout')) closeFlyouts(); });

  // assist nudge (observed on a timer: fade-in, then fade-out and hidden)
  const nudge = document.querySelector('.assist__nudge');
  if (nudge) {
    const hide = () => { nudge.classList.add('is-leaving'); setTimeout(() => { nudge.hidden = true; nudge.classList.remove('is-leaving'); }, 400); };
    setTimeout(() => { nudge.hidden = false; setTimeout(hide, 6000); }, 4000);
    nudge.querySelector('.assist__nudge-close').addEventListener('click', hide);
  }
})();
