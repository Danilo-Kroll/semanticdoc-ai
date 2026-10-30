const test = require('node:test');
const assert = require('node:assert/strict');
const {render, validateDocument} = require('./render_documentation.cjs');

const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6S8AAAAASUVORK5CYII=';
const image = {src, alt: 'Captura de teste'};
const indicator = {name: 'Indicador', objective: 'Acompanhar o volume de registros.', calculation: 'Conta os registros com identificador preenchido, incluindo repetições, no contexto selecionado.', interpretation: 'Use a quantidade para acompanhar o volume de atividade. O resultado não equivale ao número de pessoas diferentes.'};
const document = {subtitle: 'Relatório de teste', pages: [
  {name: 'Primeira', objective: 'Consultar indicadores.', visuals: [{...indicator, image}]},
  {name: 'Segunda', objective: 'Consultar o contexto.', visuals: [indicator]},
  {name: 'Menu', objective: 'Orientar a navegação.', visuals: []}
]};

test('cada indicador tem título e conteúdo em um único card', () => {
  const html = render(document);
  assert.equal(validateDocument(html), true);
  assert.equal((html.match(/<article class="visual">/g) || []).length, 2);
  assert.match(html, /class="visual-content"><div class="visual-image"><img[^>]*><\/div><div class="visual-body">/);
  assert.match(html, /class="visual-content no-image"><div class="visual-body">/);
  assert.doesNotMatch(html, /class="(?:wide|image-placeholder)"/);
});

test('mantém título fixo e permite subtítulo e logo opcionais', () => {
  const withLogo = render({...document, logo: image});
  const withoutLogo = render(document);
  assert.match(withLogo, /<img class="hero-logo" src="data:image\/png;base64,/);
  assert.doesNotMatch(withoutLogo, /<img class="hero-logo"/);
  assert.equal(withLogo.match(/<h1>.*?<\/h1>/)[0], withoutLogo.match(/<h1>.*?<\/h1>/)[0]);
});

test('escapa títulos e textos sem permitir marcação arbitrária', () => {
  const html = render({...document, subtitle: '<script>alert(1)</script> $&', pages: [
    {name: 'A & B', objective: 'Consultar <dados>.', visuals: [{...indicator, name: '<img src=x>'}]}
  ]});
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt; \$&amp;/);
  assert.match(html, /A &amp; B/);
  assert.doesNotMatch(html, /<img src=x>/);
});

test('rejeita imagens externas, Base64 e MIME incompatíveis', () => {
  for (const source of ['https://example.invalid/image.png', 'data:image/png;base64,AAAA', src.replace('image/png', 'image/jpeg')]) {
    assert.throws(() => render({...document, logo: {src: source, alt: 'Logo'}}));
  }
});

test('rejeita alterações de CSS, JavaScript, título e classes fora do contrato', () => {
  const html = render(document);
  for (const bad of [
    html.replace('max-height:220px', 'max-height:500px'),
    html.replace('function activate(tab)', 'function activate(other)'),
    html.replace('<h1>Manual funcional', '<h1>Outro título'),
    html.replace('class="visual"', 'class="visual wide"')
  ]) assert.throws(() => validateDocument(bad));
});

test('rejeita card sem wrapper e coluna de imagem vazia', () => {
  const html = render(document);
  assert.throws(() => validateDocument(html.replace('class="visual-content"', 'class="visual-body"')));
  assert.throws(() => validateDocument(html.replace('class="visual-content no-image"', 'class="visual-content"')));
});

test('preserva ordem, aba inicial única e impressão de todos os painéis', () => {
  const html = render(document);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
  assert.ok(html.indexOf('>Primeira</button>') < html.indexOf('>Segunda</button>'));
  assert.match(html, /\[role="tabpanel"\]\[hidden\]\{display:block!important/);
  assert.throws(() => validateDocument(html.replace('aria-selected="false"', 'aria-selected="true"')));
});

test('cada indicador tem as três seções uma única vez e na ordem solicitada', () => {
  const html = render(document);
  const cards = [...html.matchAll(/<article class="visual">([\s\S]*?)<\/article>/g)];
  for (const [, content] of cards) {
    assert.deepEqual([...content.matchAll(/<div class="field">([^<]+)<\/div>/g)].map(m => m[1]),
      ['Objetivo', 'Como é calculado', 'Como interpretar']);
    assert.ok(content.includes(indicator.calculation));
  }
});

test('exige cálculo explícito e aceita uma limitação breve quando indisponível', () => {
  for (const calculation of [undefined, null, '', '   ']) {
    assert.throws(() => render({...document, pages: [{...document.pages[0], visuals: [{...indicator, calculation}]}]}), /Como é calculado/);
  }
  const calculation = 'A regra de contagem não pôde ser verificada no modelo disponível.';
  const html = render({...document, pages: [{...document.pages[0], visuals: [{...indicator, calculation}]}]});
  assert.ok(html.includes(`<div class="field">Como é calculado</div><p>${calculation}</p>`));
});

test('rejeita seção de cálculo ausente, vazia, repetida ou fora de ordem', () => {
  const html = render(document);
  const calculation = `<div class="field">Como é calculado</div><p>${indicator.calculation}</p>`;
  for (const bad of [
    html.replace(calculation, ''),
    html.replace(calculation, '<div class="field">Como é calculado</div><p> </p>'),
    html.replace(calculation, calculation + calculation),
    html.replace('<div class="field">Como é calculado</div>', '<div class="field">Como interpretar</div>')
  ]) assert.throws(() => validateDocument(bad), /Cada indicador/);
});
