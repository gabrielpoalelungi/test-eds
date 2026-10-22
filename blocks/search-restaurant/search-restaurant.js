const BLOCK = 'search-restaurant';
let instanceId = 0;

// icons copied from the source store-finder widget
const ICON_SEARCH = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M7.70359 14.4081C11.2956 14.4081 14.2076 11.4961 14.2076 7.90409C14.2076 4.31203 11.2956 1.40009 7.70359 1.40009C4.11153 1.40009 1.19958 4.31203 1.19958 7.90409C1.19958 11.4961 4.11153 14.4081 7.70359 14.4081Z" stroke="#E21E2D" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.7996 17.0001L12.2996 12.5001" stroke="#E21E2D" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true" focusable="false"><path d="M12.0524 7.71741L8.28595 11.4839C8.20742 11.5624 8.10091 11.6066 7.98986 11.6066C7.8788 11.6066 7.7723 11.5624 7.69377 11.4839C7.61524 11.4054 7.57113 11.2989 7.57113 11.1878C7.57113 11.0768 7.61524 10.9703 7.69377 10.8917L10.7462 7.83982H2.54936C2.43837 7.83982 2.33192 7.79573 2.25344 7.71724C2.17495 7.63876 2.13086 7.53231 2.13086 7.42132C2.13086 7.31032 2.17495 7.20388 2.25344 7.12539C2.33192 7.04691 2.43837 7.00282 2.54936 7.00282H10.7462L7.69377 3.95091C7.61524 3.87238 7.57113 3.76587 7.57113 3.65482C7.57113 3.54376 7.61524 3.43726 7.69377 3.35873C7.7723 3.2802 7.8788 3.23608 7.98986 3.23608C8.10091 3.23608 8.20742 3.2802 8.28595 3.35873L12.0524 7.12523C12.0914 7.1641 12.1222 7.21025 12.1433 7.26106C12.1643 7.31186 12.1752 7.36632 12.1752 7.42132C12.1752 7.47631 12.1643 7.53077 12.1433 7.58158C12.1222 7.63238 12.0914 7.67854 12.0524 7.71741Z" fill="white"/></svg>';
const ICON_LOCATION = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M18.75 21H14.1131C14.892 20.3045 15.6266 19.5608 16.3125 18.7734C18.8859 15.8138 20.25 12.6938 20.25 9.75C20.25 7.56196 19.3808 5.46354 17.8336 3.91637C16.2865 2.36919 14.188 1.5 12 1.5C9.81196 1.5 7.71354 2.36919 6.16637 3.91637C4.61919 5.46354 3.75 7.56196 3.75 9.75C3.75 12.6938 5.11031 15.8138 7.6875 18.7734C8.37338 19.5608 9.10795 20.3045 9.88688 21H5.25C5.05109 21 4.86032 21.079 4.71967 21.2197C4.57902 21.3603 4.5 21.5511 4.5 21.75C4.5 21.9489 4.57902 22.1397 4.71967 22.2803C4.86032 22.421 5.05109 22.5 5.25 22.5H18.75C18.9489 22.5 19.1397 22.421 19.2803 22.2803C19.421 22.1397 19.5 21.9489 19.5 21.75C19.5 21.5511 19.421 21.3603 19.2803 21.2197C19.1397 21.079 18.9489 21 18.75 21ZM5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 15.1153 13.5497 19.5938 12 20.8125C10.4503 19.5938 5.25 15.1153 5.25 9.75ZM15.75 9.75C15.75 9.00832 15.5301 8.2833 15.118 7.66661C14.706 7.04993 14.1203 6.56928 13.4351 6.28545C12.7498 6.00162 11.9958 5.92736 11.2684 6.07205C10.541 6.21675 9.8728 6.5739 9.34835 7.09835C8.8239 7.6228 8.46675 8.29098 8.32205 9.01841C8.17736 9.74584 8.25162 10.4998 8.53545 11.1851C8.81928 11.8703 9.29993 12.456 9.91661 12.868C10.5333 13.2801 11.2583 13.5 12 13.5C12.9946 13.5 13.9484 13.1049 14.6517 12.4017C15.3549 11.6984 15.75 10.7446 15.75 9.75ZM9.75 9.75C9.75 9.30499 9.88196 8.86998 10.1292 8.49997C10.3764 8.12996 10.7278 7.84157 11.139 7.67127C11.5501 7.50097 12.0025 7.45642 12.439 7.54323C12.8754 7.63005 13.2763 7.84434 13.591 8.15901C13.9057 8.47368 14.12 8.87459 14.2068 9.31105C14.2936 9.7475 14.249 10.1999 14.0787 10.611C13.9084 11.0222 13.62 11.3736 13.25 11.6208C12.88 11.868 12.445 12 12 12C11.4033 12 10.831 11.7629 10.409 11.341C9.98705 10.919 9.75 10.3467 9.75 9.75Z" fill="#E21E2D"/></svg>';

/**
 * Store-finder placeholder: renders a labelled search input that sends the
 * user to the restaurant locator link authored in the block (no live lookup).
 *
 * Authoring: row 1 = label / placeholder text, row 2 = link to the locator page.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  // without an authored target there is nothing to submit to: keep the content as-is
  if (!link) return;

  instanceId += 1;
  const target = new URL(link.getAttribute('href'), window.location.href);

  const labelCell = [...block.querySelectorAll(':scope > div > div')]
    .find((cell) => !cell.querySelector('a') && cell.textContent.trim());
  const labelText = (labelCell || link).textContent.trim();

  const box = document.createElement('div');
  box.className = `${BLOCK}-box`;

  const icon = document.createElement('span');
  icon.className = `${BLOCK}-icon`;
  icon.innerHTML = ICON_SEARCH;

  const form = document.createElement('form');
  form.className = `${BLOCK}-form`;
  form.setAttribute('role', 'search');
  form.action = target.href;
  form.method = 'get';

  const inputId = `${BLOCK}-input-${instanceId}`;
  const label = document.createElement('label');
  label.className = `${BLOCK}-label`;
  label.htmlFor = inputId;
  label.textContent = labelText;

  const field = document.createElement('div');
  field.className = `${BLOCK}-field`;

  const input = document.createElement('input');
  input.className = `${BLOCK}-input`;
  input.id = inputId;
  input.type = 'text';
  input.name = 'q';
  input.placeholder = labelText;
  input.maxLength = 50;
  input.autocomplete = 'off';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = `${BLOCK}-submit`;
  submit.setAttribute('aria-label', 'Caută restaurant');
  submit.innerHTML = ICON_ARROW;

  const locate = document.createElement('button');
  locate.type = 'button';
  locate.className = `${BLOCK}-locate`;
  locate.setAttribute('aria-label', 'Folosește locația mea');
  locate.innerHTML = ICON_LOCATION;

  const go = (query) => {
    const url = new URL(target.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.location.assign(url.href);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    go(input.value.trim());
  });

  // no geolocation lookup: the location button opens the restaurant locator page
  locate.addEventListener('click', () => go(''));

  field.append(label, input);
  form.append(field, submit, locate);
  box.append(icon, form);
  block.replaceChildren(box);
}
