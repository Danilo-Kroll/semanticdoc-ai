const fs = require('node:fs');
const path = require('node:path');

const templatePath = path.resolve(__dirname, '../assets/semanticdoc_template.html');
const classes = new Set([
  'hero', 'shell', 'hero-layout', 'hero-copy', 'hero-logo', 'eyebrow', 'subtitle',
  'tabs', 'tab', 'page', 'active', 'page-intro', 'visual-grid', 'visual',
  'visual-head', 'visual-content', 'no-image', 'visual-image', 'visual-body',
  'field', 'rule', 'footer', 'note'
]);

function requireText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label}: texto obrigatório.`);
  return value;
}

function escape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function imageTag(image, className = '') {
  if (!image || typeof image !== 'object') throw new Error('Imagem inválida.');
  const src = requireText(image.src, 'Imagem Base64');
  const alt = requireText(image.alt, 'Texto alternativo');
  const match = src.match(/^data:image\/(png|jpeg|webp|gif|bmp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) throw new Error('Use somente imagens raster incorporadas em Base64.');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.toString('base64') !== match[2]) throw new Error('Base64 inválido.');
  const signatures = {
    png: () => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    jpeg: () => bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    webp: () => bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
    gif: () => /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6)),
    bmp: () => bytes.toString('ascii', 0, 2) === 'BM'
  };
  if (!signatures[match[1]]()) throw new Error('O conteúdo da imagem não corresponde ao MIME.');
  return `<img${className ? ` class="${className}"` : ''} src="${src}" alt="${escape(alt)}">`;
}

function renderVisual(visual) {
  const name = escape(requireText(visual.name, 'Nome do indicador'));
  const objective = escape(requireText(visual.objective, 'Objetivo do indicador'));
  const calculation = escape(requireText(visual.calculation, 'Como é calculado'));
  const interpretation = escape(requireText(visual.interpretation, 'Como interpretar'));
  const rules = visual.rules ?? [];
  if (!Array.isArray(rules)) throw new Error('Regras importantes devem ser uma lista de frases.');
  const rule = rules.length
    ? `<div class="rule"><strong>Regras importantes:</strong> ${rules.map(r => escape(requireText(r, 'Regra'))).join(' ')}</div>`
    : '';
  const image = visual.image ? `<div class="visual-image">${imageTag(visual.image)}</div>` : '';
  return `  <article class="visual"><div class="visual-head"><h3>${name}</h3></div>`
    + `<div class="visual-content${visual.image ? '' : ' no-image'}">${image}`
    + `<div class="visual-body"><div class="field">Objetivo</div><p>${objective}</p>`
    + `<div class="field">Como é calculado</div><p>${calculation}</p>`
    + `<div class="field">Como interpretar</div><p>${interpretation}</p>${rule}</div></div></article>`;
}

function slotPattern(name) {
  return new RegExp(`(<!-- SEMANTICDOC:${name}:START -->)[\\s\\S]*?(<!-- SEMANTICDOC:${name}:END -->)`);
}

function replaceSlot(template, name, value) {
  const pattern = slotPattern(name);
  if (!pattern.test(template)) throw new Error(`Marcador ${name} ausente no template.`);
  return template.replace(pattern, (_, start, end) => `${start}\n${value}\n${end}`);
}

function protectedSkeleton(html) {
  return html.replace(/<p class="subtitle">[\s\S]*?<\/p>/, '<p class="subtitle"></p>')
    .replace(/<img class="hero-logo"[^>]*>/, '<!-- SEMANTICDOC:LOGO -->')
    .replace(slotPattern('TABS'), '$1$2')
    .replace(slotPattern('PAGES'), '$1$2');
}

function validateDocument(html, template = fs.readFileSync(templatePath, 'utf8')) {
  const block = (text, tag) => text.match(new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`))?.[0];
  for (const tag of ['style', 'script', 'title', 'h1']) {
    if (!block(template, tag) || block(html, tag) !== block(template, tag)) {
      throw new Error(`O bloco ${tag} deve permanecer idêntico ao template.`);
    }
    if ((html.match(new RegExp(`<${tag}>`, 'g')) || []).length !== 1) {
      throw new Error(`Quantidade inválida de blocos ${tag}.`);
    }
  }
  if (protectedSkeleton(html) !== protectedSkeleton(template)) {
    throw new Error('Alteração fora das áreas permitidas do template.');
  }
  const markup = html.replace(block(html, 'style'), '').replace(block(html, 'script'), '');
  if (/\sstyle\s*=|<link\b|<script[^>]+src\s*=|(?:https?|file):\/\//i.test(markup)) {
    throw new Error('Estilo inline ou dependência externa encontrada.');
  }
  for (const [, value] of markup.matchAll(/class="([^"]+)"/g)) {
    for (const name of value.split(/\s+/)) if (!classes.has(name)) throw new Error(`Classe não permitida: ${name}`);
  }
  for (const [, tag] of markup.matchAll(/(<img\b[^>]*>)/g)) {
    const src = tag.match(/src="([^"]*)"/)?.[1];
    const alt = tag.match(/alt="([^"]*)"/)?.[1];
    imageTag({src, alt});
  }
  const articles = [...markup.matchAll(/<article class="visual">([\s\S]*?)<\/article>/g)];
  const card = /^<div class="visual-head"><h3>[^<]+<\/h3><\/div><div class="visual-content( no-image)?">(<div class="visual-image"><img[^>]+><\/div>)?<div class="visual-body">[\s\S]*<\/div><\/div>$/;
  for (const [, content] of articles) {
    const match = content.match(card);
    if (!match || Boolean(match[1]) === Boolean(match[2])) throw new Error('Estrutura de indicador inválida.');
    const fields = [...content.matchAll(/<div class="field">([^<]+)<\/div><p>([^<]+)<\/p>/g)];
    const expected = ['Objetivo', 'Como é calculado', 'Como interpretar'];
    if (fields.length !== expected.length
        || (content.match(/class="field"/g) || []).length !== expected.length
        || fields.some((field, i) => field[1] !== expected[i] || !field[2].trim())) {
      throw new Error('Cada indicador deve conter Objetivo, Como é calculado e Como interpretar, nessa ordem e com texto.');
    }
  }
  if ((markup.match(/<article\b/g) || []).length !== articles.length) throw new Error('Card fora do padrão.');
  const tabs = [...markup.matchAll(/<button class="tab" id="tab-(\d+)" role="tab" aria-selected="(true|false)" aria-controls="page-\1" tabindex="(0|-1)" data-tab="page-\1">([^<]+)<\/button>/g)];
  const pages = [...markup.matchAll(/<section class="page( active)?" id="page-(\d+)" role="tabpanel" aria-labelledby="tab-\2"( hidden)?>/g)];
  if (!tabs.length || tabs.length !== pages.length
      || tabs.length !== (markup.match(/role="tab"/g) || []).length
      || pages.length !== (markup.match(/role="tabpanel"/g) || []).length) {
    throw new Error('As abas e páginas devem corresponder uma a uma.');
  }
  tabs.forEach((tab, i) => {
    if (tab[1] !== String(i) || tab[2] !== String(i === 0) || tab[3] !== (i === 0 ? '0' : '-1')
        || pages[i][2] !== String(i) || Boolean(pages[i][1]) !== (i === 0)
        || Boolean(pages[i][3]) !== (i !== 0)) throw new Error('Estado ou ordem inicial das abas inválido.');
  });
  return true;
}

function render(document) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const subtitle = escape(requireText(document.subtitle, 'Subtítulo'));
  if (!Array.isArray(document.pages) || !document.pages.length) throw new Error('Informe pelo menos uma página.');
  const tabs = document.pages.map((page, i) => ` <button class="tab" id="tab-${i}" role="tab" aria-selected="${i === 0}" aria-controls="page-${i}" tabindex="${i === 0 ? 0 : -1}" data-tab="page-${i}">${escape(requireText(page.name, 'Nome da página'))}</button>`).join('\n');
  const pages = document.pages.map((page, i) => {
    const visuals = page.visuals ?? [];
    if (!Array.isArray(visuals)) throw new Error('Visuais devem ser uma lista.');
    const grid = visuals.length ? `\n <div class="visual-grid">\n${visuals.map(renderVisual).join('\n')}\n </div>` : '';
    return `<section class="page${i === 0 ? ' active' : ''}" id="page-${i}" role="tabpanel" aria-labelledby="tab-${i}"${i === 0 ? '' : ' hidden'}>\n <div class="page-intro"><h2>${escape(page.name)}</h2><p><strong>Objetivo da página:</strong> ${escape(requireText(page.objective, 'Objetivo da página'))}</p></div>${grid}\n</section>`;
  }).join('\n');
  let html = template.replace(/<p class="subtitle">[\s\S]*?<\/p>/, () => `<p class="subtitle">${subtitle}</p>`);
  if (document.logo) html = html.replace('<!-- SEMANTICDOC:LOGO -->', () => imageTag(document.logo, 'hero-logo'));
  html = replaceSlot(html, 'TABS', `<nav class="tabs" aria-label="Páginas do relatório" role="tablist">\n${tabs}\n</nav>`);
  html = replaceSlot(html, 'PAGES', pages);
  validateDocument(html, template);
  return html;
}

if (require.main === module) {
  try {
    const output = process.argv[2];
    if (!output || path.basename(output) !== 'documentacao.html') throw new Error('Informe o caminho de saída documentacao.html.');
    const html = render(JSON.parse(fs.readFileSync(0, 'utf8')));
    fs.writeFileSync(output, html, 'utf8');
    process.stdout.write(`Gerado: ${path.resolve(output)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {render, validateDocument};
