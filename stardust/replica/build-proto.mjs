// Inlines the source's SVG icons into the prototype template.
import fs from 'node:fs';
const dir = 'stardust/prototypes';
const page = JSON.parse(fs.readFileSync('stardust/current/pages/index.json', 'utf8'));
let html = fs.readFileSync('stardust/replica/index-proposed.src.html', 'utf8');
html = html.replace('{{description}}', page.description.replace(/"/g, '&quot;'));
html = html.replace(/\{\{icon:([a-z-]+)\}\}/g, (_, n) => fs.readFileSync(`${dir}/assets/icons/${n}.svg`, 'utf8')
  .replace(/\s*data-astro-cid-[a-z0-9]+=""/g, '').replace(/ class="faq-icon"/, '').replace(/>\s+</g, '><').trim());
fs.writeFileSync(`${dir}/index-proposed.html`, html);
console.log('wrote', `${dir}/index-proposed.html`, html.length);
