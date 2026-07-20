export default function decorate(block) {
  const content = block.querySelector(':scope > div > div') || block;

  // Highlight the headline text that follows the <br> in the accent color.
  const h1 = content.querySelector('h1');
  const br = h1?.querySelector('br');
  if (br) {
    const span = document.createElement('span');
    let node = br.nextSibling;
    while (node) {
      const next = node.nextSibling;
      span.appendChild(node);
      node = next;
    }
    if (span.childNodes.length) h1.appendChild(span);
  }

  const paragraphs = [...content.querySelectorAll('p')];

  // The two CTAs are authored as bold paragraphs (first = outlined, second = filled).
  const ctaParagraphs = paragraphs.filter((p) => {
    const strong = p.querySelector('strong');
    return strong && p.textContent.trim() === strong.textContent.trim();
  });

  if (ctaParagraphs.length >= 2) {
    const [outlined, filled] = ctaParagraphs;
    const buttonContainer = document.createElement('p');
    buttonContainer.className = 'button-container';

    const makeButton = (p, variant) => {
      const btn = document.createElement('a');
      btn.className = `button ${variant}`;
      btn.href = '#';
      btn.textContent = p.textContent.trim();
      return btn;
    };

    buttonContainer.append(makeButton(outlined, 'secondary'));
    buttonContainer.append(makeButton(filled, 'primary'));

    outlined.replaceWith(buttonContainer);
    filled.remove();
  }
}
