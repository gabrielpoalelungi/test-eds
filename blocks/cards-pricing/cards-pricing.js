export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'cards-pricing-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-pricing-card-body');
    if (!body) return;

    /* "Most Popular" -> featured card + badge bar at the top of the card */
    const em = body.querySelector('p > em');
    if (em && /most popular/i.test(em.textContent)) {
      li.classList.add('cards-pricing-featured');
      const badge = document.createElement('p');
      badge.className = 'cards-pricing-badge';
      badge.textContent = em.textContent;
      li.prepend(badge);
      em.closest('p').remove();
    }

    /* price row: the paragraph holding the current price (strong) + original (del) */
    const strong = body.querySelector('p > strong');
    const priceP = strong && strong.closest('p');
    if (priceP && priceP.querySelector('del')) {
      priceP.classList.add('cards-pricing-price');
    }
  });

  block.textContent = '';
  block.append(ul);
}
