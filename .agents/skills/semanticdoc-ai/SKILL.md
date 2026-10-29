---
name: semanticdoc-ai
description: Descobre projetos Power BI PBIP no diretório de trabalho, interpreta páginas e visuais PBIR com apoio do modelo TMDL ou model.bim e gera um manual funcional HTML offline pelo template incluído. Use com $semanticdoc-ai para documentar qualquer relatório sem serviços externos, valores momentâneos ou alteração do projeto.
---

# SemanticDoc AI

Analise qualquer projeto Power BI local, seu contexto visual e o modelo semântico para ensinar o usuário final a compreender a finalidade e a leitura correta dos indicadores. Derive todo nome, caminho, página, visual e regra do projeto selecionado; nunca incorpore suposições de um relatório usado anteriormente.

## Portabilidade e dependências

- Considere como raiz de trabalho o diretório aberto pelo usuário, ou o diretório explicitamente indicado na chamada. Não procure fora dessa raiz.
- Resolva caminhos do projeto relativamente ao arquivo `*.pbip` e caminhos de recursos da Skill relativamente à pasta que contém este `SKILL.md`.
- Não codifique caminhos absolutos, nomes de usuários, unidades de disco, nomes de relatórios, páginas, medidas, tabelas, campos ou temas de negócio.
- Use apenas recursos já disponíveis no ambiente do Codex e arquivos locais. A execução básica não pode solicitar instalação de Python, Node.js, bibliotecas, Power BI Desktop, Microsoft Fabric, gateways ou conversores.
- Não exija Power BI Service, Fabric, tokens, APIs, autenticação, licenças adicionais ou serviços pagos. Não envie o projeto nem seus dados para serviços externos.
- Use como padrão visual canônico `assets/semanticdoc_template.html`, resolvido relativamente à pasta que contém este `SKILL.md`. A instalação da Skill deve ser autossuficiente e não pode depender de um template localizado na raiz do projeto Power BI.

## Acionamento automático

A mensagem contendo somente `$semanticdoc-ai` é uma solicitação completa. Um caminho opcional para um `*.pbip` apenas seleciona diretamente o projeto. Ao receber a chamada:

- inicie o processo imediatamente, sem pedir objetivo, contexto, confirmação ou instruções adicionais;
- descubra arquivos `*.pbip` dentro da raiz de trabalho, ignorando a pasta da própria Skill, `.git`, diretórios de dependências, caches e saídas geradas;
- se um caminho válido tiver sido indicado, use esse projeto;
- se houver exatamente um PBIP, selecione-o automaticamente;
- se houver mais de um PBIP, não gere nem sobrescreva `documentacao.html`: apresente somente os caminhos relativos encontrados e peça ao usuário que escolha um projeto;
- se não houver PBIP, aceite uma única pasta de relatório que contenha `definition.pbir`; se houver nenhuma ou várias candidatas, peça apenas que o usuário disponibilize ou escolha o projeto;
- relacione páginas, visuais, campos, medidas, filtros e imagens antes de redigir o conteúdo;
- leia integralmente `assets/semanticdoc_template.html`, a partir da pasta deste `SKILL.md`, e use-o como base obrigatória da saída;
- gere apenas `documentacao.html` no diretório do PBIP selecionado, salvo quando o usuário indicar explicitamente outro diretório de saída;
- informe ao usuário o caminho do arquivo gerado.

Se não houver capturas, mas houver PBIP/PBIR, prossiga e gere a documentação sem imagens. Imagens isoladas não substituem o projeto para esta execução universal: sem uma definição de relatório identificável, não crie arquivo vazio e peça apenas que o usuário disponibilize o projeto Power BI.

## Resultado esperado

Crie ou atualize `documentacao.html`, em português brasileiro, junto ao PBIP selecionado. Preserve o título fixo do template e derive o subtítulo do nome e da finalidade do projeto selecionado. Se o usuário indicar explicitamente outro diretório, use o local indicado. O manual deve explicar a finalidade e a leitura dos indicadores com base nas definições reais encontradas no PBIR e no modelo semântico.

O HTML deve ser um arquivo único e autossuficiente:

- quando houver capturas, incorpore todas as imagens usadas com Data URLs no formato `data:image/<tipo>;base64,<conteúdo>`;
- coloque todo o CSS dentro de um elemento `<style>`;
- não use caminhos locais ou externos, URLs remotas, fontes externas, folhas de estilo ou scripts externos;
- coloque todo o JavaScript necessário dentro de um elemento `<script>` no próprio HTML;
- não gere Markdown, imagens recortadas permanentes, arquivos CSS, arquivos JavaScript ou qualquer outro arquivo no projeto;
- preserve os arquivos de imagem de origem;
- não produza arquivos de inventário, mapas de dependência ou relatórios técnicos auxiliares.

Não modifique o relatório Power BI original nem qualquer arquivo que o componha. Operações permitidas no projeto são leitura e criação ou atualização de `documentacao.html`.

## Template visual obrigatório

Use sempre o arquivo canônico [assets/semanticdoc_template.html](assets/semanticdoc_template.html), localizado dentro da própria pasta da Skill, como fonte visual única de `documentacao.html`. Resolva esse caminho a partir do diretório que contém `SKILL.md`, independentemente do diretório de trabalho ou da localização do projeto PBIP.

- Leia o template completo em toda execução antes de gerar ou atualizar o documento.
- Trate o template como recurso somente leitura durante a execução. Modifique-o apenas quando o usuário pedir explicitamente uma alteração no próprio padrão visual.
- Preserve seu layout, cores, fontes, identidade visual, CSS, classes estruturais, navegação por abas, responsividade, regras de impressão e JavaScript. Não recrie um estilo equivalente nem use `documentacao.html` anterior como template.
- Preserve `<title>` e `<h1>` fixos. Substitua somente o subtítulo do cabeçalho, o marcador de logo opcional e os conteúdos entre os marcadores `SEMANTICDOC:TABS` e `SEMANTICDOC:PAGES`. Todo o restante deve permanecer idêntico.
- Use o logo somente quando disponibilizado e identificado com segurança. No marcador `<!-- SEMANTICDOC:LOGO -->`, insira uma única imagem `hero-logo` em Base64 com texto alternativo; sem logo, mantenha o marcador sem reservar espaço.
- Use os componentes e classes existentes no template para títulos de página, indicadores, imagens, `Objetivo`, `Como interpretar` e regras relevantes.
- Substitua os textos ilustrativos por interpretações comprovadas no PBIP/PBIR e no modelo semântico. O template define apresentação, não regras de negócio.
- Quando houver captura confiavelmente relacionada, inclua-a em `<div class="visual-image"><img ...></div>` como primeiro filho de `visual-content`, seguida de `visual-body`, com Data URL Base64 e texto alternativo funcional. Sem captura, use `visual-content no-image` contendo somente `visual-body` e nunca use `image-placeholder`.
- Se o template não puder ser lido, não improvise outro padrão visual. Informe apenas que o recurso obrigatório está indisponível e não sobrescreva uma documentação existente.

### Contrato de geração literal

O template é o arquivo de origem, não apenas uma referência de estilo. Execute a montagem nesta ordem:

1. carregue o conteúdo integral de `assets/semanticdoc_template.html`, resolvido a partir da pasta deste `SKILL.md`, em memória antes de produzir qualquer HTML;
2. confirme que o arquivo contém `<style>`, `<script>`, `header.hero`, `nav.tabs`, páginas demonstrativas e o rodapé;
3. produza separadamente o subtítulo, o logo opcional, os botões de aba e as seções de página, mantendo os títulos fixos;
4. crie o candidato a `documentacao.html` exclusivamente substituindo os conteúdos demonstrativos correspondentes no template carregado;
5. valide o candidato em memória;
6. grave ou sobrescreva `documentacao.html` somente depois que todas as validações passarem.

É proibido:

- começar por um HTML vazio, reescrever o esqueleto do documento ou copiar a documentação anterior;
- alterar, reordenar, reformatar ou regenerar qualquer trecho fora das áreas demonstrativas substituídas;
- acrescentar outro `<style>`, outro `<script>`, atributos `style`, bibliotecas, folhas de estilo ou scripts;
- criar classes visuais novas ou substituir componentes do template por marcação equivalente;
- modificar o template para acomodar um relatório específico.

O conteúdo gerado deve usar somente estas classes do template: `hero`, `shell`, `hero-layout`, `hero-copy`, `hero-logo`, `eyebrow`, `subtitle`, `tabs`, `tab`, `page`, `active`, `page-intro`, `visual-grid`, `visual`, `visual-head`, `visual-content`, `no-image`, `visual-image`, `visual-body`, `field`, `rule`, `footer` e `note`. Não use `wide`, `image-placeholder` nem variantes que coloquem indicadores lado a lado.

Use estes componentes canônicos:

```html
<button class="tab" id="tab-{id}" role="tab" aria-selected="{true|false}"
  aria-controls="page-{id}" tabindex="{0|-1}" data-tab="page-{id}">
  {nome original da página}
</button>

<section class="page {active}" id="page-{id}" role="tabpanel"
  aria-labelledby="tab-{id}" {hidden}>
  <div class="page-intro">
    <h2>{nome original da página}</h2>
    <p><strong>Objetivo da página:</strong> {objetivo}</p>
  </div>
  <div class="visual-grid">{visuais}</div>
</section>

<article class="visual">
  <div class="visual-head"><h3>{nome do indicador}</h3></div>
  <div class="visual-content">
    <div class="visual-image"><img src="data:image/png;base64,{captura}" alt="{descrição funcional}"></div>
    <div class="visual-body">
      <div class="field">Objetivo</div>
      <p>{objetivo}</p>
      <div class="field">Como interpretar</div>
      <p>{interpretação}</p>
      {rule opcional}
    </div>
  </div>
</article>
```

Todos os indicadores ocupam uma linha completa, sem exceções por tipo de visual. Sem imagem, omita `visual-image` e acrescente `no-image` a `visual-content` para que o texto ocupe toda a largura. Para páginas sem indicadores funcionais, mantenha apenas `page-intro` e omita `visual-grid`; não invente cards.

Quando Node.js já estiver disponível, use [scripts/render_documentation.cjs](scripts/render_documentation.cjs) para montar e validar o HTML a partir do template. O script recebe via entrada padrão um JSON com `subtitle`, `logo` opcional e `pages`; cada página contém `name`, `objective` e `visuals`, e cada visual contém `name`, `objective`, `interpretation`, `rules` opcional (lista de frases) e `image` opcional. Cada imagem ou logo contém `src` (Data URL Base64) e `alt`. Execute `node <diretório-da-Skill>/scripts/render_documentation.cjs <caminho-de-saída>/documentacao.html`. Mantenha o JSON apenas em memória ou em arquivo temporário removido após a execução. O script não interpreta DAX e não substitui a análise funcional. Se Node.js não estiver disponível, siga o mesmo contrato diretamente com os recursos existentes, sem exigir instalação.

## Fluxo de trabalho

### 1. Descobrir o projeto e as capturas

- Aplique primeiro a seleção determinística definida em **Acionamento automático**. Não escolha arbitrariamente entre vários PBIPs.
- Leia o PBIP selecionado como manifesto e resolva cada caminho de artefato a partir do diretório desse arquivo. Não presuma nomes como `Report`, `SemanticModel` ou qualquer prefixo específico.
- Dentro dos artefatos referenciados, procure `definition.pbir`, `*.tmdl`, `model.bim` e, para formatos legados, `report.json`.
- A partir do diretório do PBIP selecionado, procure primeiro nas pastas opcionais `imagens/`, `images/`, `screenshots/` e `capturas/`, nessa ordem. Se nenhuma delas existir ou contiver capturas utilizáveis, procure arquivos PNG, JPG, JPEG, WEBP, BMP, GIF, TIF ou TIFF nas demais pastas do projeto.
- Não exija pasta de imagens nem quantidade mínima de arquivos. Na ausência de capturas, prossiga normalmente com a documentação textual e omita os componentes de imagem.
- Não associe arquivos a páginas apenas por nome, numeração ou ordem. Valide cada correspondência usando o PBIR, o nome visível da página, títulos, dimensões, posições e composição dos visuais; trate nomes e numeração somente como indícios auxiliares.
- Considere somente capturas de páginas ou visuais. Ignore logotipos, ícones, planos de fundo, capas, pôsteres e outros recursos decorativos ou internos do relatório, salvo quando fizerem parte inseparável de uma captura real fornecida pelo usuário.
- Exclua da descoberta o próprio `documentacao.html` e todo o diretório que contém este `SKILL.md`, inclusive `assets/`, `scripts/`, `references/` ou outros recursos da instalação da Skill. Não mova, renomeie nem modifique as imagens encontradas.

### 2. Ler a definição do relatório

- Use as referências do PBIP para localizar o artefato de relatório. Não associe pastas por semelhança de nome quando o manifesto fornecer um caminho explícito.
- Leia `definition.pbir` para determinar a referência do modelo semântico.
- Quando houver `datasetReference.byPath`, resolva o caminho relativo e procure o modelo local correspondente.
- Quando houver apenas `datasetReference.byConnection`, ou quando o caminho local não existir, trate o modelo como externo ou ausente. Registre uma única nota curta informando que a lógica não foi verificada e, em cada indicador afetado, mencione somente a regra específica que permanece desconhecida; não repita alertas genéricos.
- Para PBIR, leia `definition/pages/pages.json` para preservar a ordem original das páginas, cada `page.json` para obter o nome original, dimensões e filtros de página, e cada `visuals/*/visual.json` para posição, título, consulta, campos, medidas, agregações, filtros e ordenação.
- Em cada `visual.json`, determine também quais campos alimentam eixos, categorias, séries, legendas, valores e tooltips. Identifique se o visual apresenta total, percentual, participação, composição, tendência, ranking, variação temporal ou comparação entre realizado, válido, meta, limite ou período.
- Considere também filtros do relatório em `definition/report.json` e medidas de relatório em `definition/reportExtensions.json`, quando existirem.
- Se o relatório usar PBIR-Legacy, extraia as mesmas informações do `report.json` disponível, sem editar ou converter o formato.

### 3. Relacionar visuais ao modelo

- Para cada visual funcional, identifique as projeções da consulta e registre internamente as medidas, colunas, hierarquias, agregações, cálculos visuais e filtros usados. Não publique esse inventário no HTML.
- Ignore formas, imagens, botões, navegadores, caixas de texto e outros elementos puramente decorativos. Preserve textos somente quando forem necessários para entender um indicador ou uma regra de uso.
- Localize cada medida ou campo no TMDL do modelo, normalmente em arquivos `definition/tables/*.tmdl` e demais arquivos `*.tmdl`. Se o modelo estiver em `model.bim`, consulte a definição JSON equivalente.
- Para cada medida usada pelo visual, leia a expressão DAX e acompanhe somente as dependências necessárias para entender seu significado.
- Verifique condições e critérios de cálculo, filtros internos, dependências de outras medidas, tratamento de valores em branco ou zero, contagens distintas, contexto temporal, filtros removidos ou preservados, metas e limites comprovadamente definidos.
- Diferencie medidas semelhantes antes de redigir, especialmente quantidade versus percentual, visitas realizadas versus visitas válidas, total bruto versus distinto e valor atual versus referência. Não trate nomes parecidos como equivalentes.
- Para colunas calculadas, grupos de cálculo, parâmetros ou agregações implícitas, consulte a definição correspondente quando ela afetar a leitura do visual.
- Consulte relacionamentos e direção de filtro somente quando forem indispensáveis para explicar o indicador. Não transforme a documentação em descrição do modelo.
- Mantenha uma trilha de evidência apenas durante a análise: visual → função no visual → campo ou medida → definição → regra funcional. Não crie um arquivo auxiliar para essa trilha.
- Classifique internamente cada afirmação como `comprovada pelo PBIR`, `comprovada pelo modelo` ou `necessita validação`. Não exponha essa classificação como inventário; use-a para impedir que hipóteses sejam apresentadas como fatos.
- Se um visual não puder ser vinculado com segurança ao campo ou à medida, não deduza a lógica pelo título. Sinalize somente a dúvida específica junto ao indicador, por exemplo: `A condição usada neste indicador não pôde ser verificada no modelo disponível.`

### 4. Relacionar capturas e visuais

- Use capturas como representação visual, não como fonte primária para explicar a regra de cálculo.
- Relacione a captura à página usando o nome visível, o `displayName` do `page.json`, a ordem das páginas e a composição dos visuais.
- Relacione cada gráfico ou card ao `visual.json` por título, posição relativa, campos visíveis, legendas e eixos. Não use apenas semelhança de texto quando houver ambiguidade.
- Recorte a captura original somente quando os limites do visual forem confiáveis e preserve título, eixos, rótulos e legenda necessários à leitura.
- Não redesenhe, reconstrua, aprimore ou altere o gráfico. Se o recorte não for seguro, use a captura completa apenas para esse visual.
- Não inclua uma captura de página inteira quando todos os visuais relevantes daquela página já tiverem imagens individuais.
- Quando nenhuma captura estiver disponível, mantenha a seção funcional do indicador e omita a imagem sem criar placeholder decorativo.
- Não instale ferramentas de edição ou conversão para produzir recortes. Se os recursos disponíveis não permitirem um recorte confiável, preserve a captura completa correspondente ou documente o visual sem imagem.

### 5. Redigir e gerar o HTML

- Aplique obrigatoriamente o **Contrato de geração literal**. Use `assets/semanticdoc_template.html`, resolvido relativamente à pasta deste `SKILL.md`, como arquivo de origem e substitua somente os conteúdos demonstrativos autorizados; nunca redija o documento completo diretamente.
- Traduza as regras comprovadas no modelo para linguagem de negócio, sem reproduzir DAX, nomes técnicos de tabelas, relacionamentos ou detalhes de implementação.
- Para cada indicador, escreva `Objetivo` em uma ou duas frases e `Como interpretar` em duas ou três frases. Cada frase deve acrescentar informação específica sobre a finalidade, o contexto, a comparação ou a regra do indicador.
- Crie `Regras importantes` somente quando houver uma condição comprovada que altere a leitura ou uma dúvida específica que precise de validação. Use poucos itens curtos e omita a seção quando ela não agregar informação.
- Organize os indicadores por página, na ordem definida pelo relatório, e agrupe indicadores semelhantes quando isso reduzir repetição e melhorar a leitura.
- Gere uma aba para cada página usando exatamente seu nome original e configure a primeira página do relatório como aba inicial.
- Quando houver capturas, incorpore as imagens em Base64 nos componentes de imagem do template; grave somente `documentacao.html`.
- Antes de concluir, verifique cada explicação contra a trilha de evidência e valide o arquivo offline.

Se forem necessários arquivos temporários para recortes ou conversão, mantenha-os fora do projeto e remova-os depois que as imagens forem incorporadas. O único artefato final gerado pela execução deve ser `documentacao.html`.

## Regras de interpretação

- Use linguagem simples, curta, objetiva e adequada a usuários finais.
- Explique somente regras que mudem a forma correta de interpretar o indicador.
- Não reproduza valores exibidos, resultados atuais, séries mês a mês ou listas categoria por categoria.
- Não compare barras, pontos ou períodos e não conclua se o resultado está alto, baixo, melhor ou pior.
- Não gere análise de desempenho, tendências ou recomendações a partir dos dados exibidos.
- Não repita o título do indicador como descrição do objetivo.
- Não use frases vazias como `permite analisar os dados`, `apresenta informações` ou equivalentes. Declare qual decisão, acompanhamento ou compreensão de negócio o indicador apoia.
- Não explique convenções visuais óbvias, como `barras maiores representam valores maiores`, salvo quando uma escala, sinal, cor ou eixo tiver significado não convencional comprovado.
- Não crie seções chamadas `Tipo de visual`, `O que apresenta`, `Filtros identificados` ou equivalentes.
- Não repita explicações genéricas nem a mesma regra em todos os indicadores. Quando uma regra for compartilhada, explique-a uma vez no agrupamento ou na página.
- Não reproduza DAX, consultas, tabelas, colunas técnicas, relacionamentos ou nomes internos do modelo no documento final.
- Não invente regras, metas, períodos, unidades, definições ou dependências. Quando a evidência for insuficiente, registre apenas a limitação específica.
- Não afirme que uma referência é meta sem evidência no PBIR ou no modelo, e não presuma que um resultado maior seja sempre melhor.
- Não confunda quantidade com percentual, total bruto com contagem distinta, valor realizado com referência ou campos e medidas de nomes semelhantes.
- Não crie uma seção geral e repetitiva de confirmações. Registre a regra importante ou a dúvida específica perto do indicador somente quando ela evitar uma interpretação incorreta.
- Ignore visuais puramente decorativos e evite documentar segmentações como indicadores. Considere o efeito de filtros apenas quando ele for essencial à leitura.
- Não envie arquivos ou dados para serviços externos adicionais. Trabalhe somente com os recursos disponibilizados no ambiente atual.

## Estrutura e apresentação do HTML

Preserve o documento, os componentes e os estilos de `assets/semanticdoc_template.html`, localizado relativamente a este `SKILL.md`. O template já fornece `<!doctype html>`, `<html lang="pt-BR">`, UTF-8, viewport, HTML semântico, CSS interno e JavaScript interno; não substitua esses elementos nem inclua dependências externas.

### Navegação por abas

- Crie uma barra de abas no topo do documento, antes do conteúdo das páginas.
- Gere uma aba para cada página documentada, preservando a ordem de `pages.json` ou, no formato legado, a ordem definida no relatório.
- Use como rótulo da aba o nome original da página em `page.json.displayName`. Não substitua, resuma ou traduza esse nome.
- Associe cada aba a um único painel de página. O conteúdo de um painel não deve aparecer em outro.
- Marque a primeira aba como ativa na carga inicial e mostre somente o painel da primeira página.
- Ao selecionar uma aba, oculte os demais painéis, mostre somente o painel correspondente e atualize o destaque visual.
- Use botões com `role="tab"` dentro de um contêiner `role="tablist"`; use `aria-selected`, `aria-controls`, `id` e `role="tabpanel"` de forma consistente.
- Implemente clique e navegação por teclado com Setas esquerda/direita, Home e End. Ao mudar de aba pelo teclado, mova o foco para a aba ativa.
- Em telas pequenas, mantenha as abas legíveis com rolagem horizontal, quebra controlada ou outro comportamento responsivo que não corte os nomes das páginas.
- Todo o comportamento deve usar um único `<script>` incorporado, sem bibliotecas e sem acesso à rede.
- Na impressão, force todos os painéis de página a ficarem visíveis, inclusive os que possuem `hidden`, e mantenha a ordem original. O estado da aba selecionada não pode ocultar conteúdo impresso.
- Não duplique indicadores, textos ou imagens para implementar a navegação.

Organize o conteúdo por página. Em cada painel de aba, inclua uma única vez o nome original e o **Objetivo da página**, descrevendo sua finalidade sem analisar os resultados atuais. Não repita conteúdo entre painéis.

Para cada visual relevante, gere somente:

1. **Nome do indicador**
2. **Imagem original do gráfico ou card** — somente quando houver captura correspondente
3. **Objetivo** — uma ou duas frases sobre a informação de negócio representada e sua finalidade
4. **Como interpretar** — duas ou três frases sobre significado, contexto, comparação e particularidades comprovadas
5. **Regras importantes** — seção opcional com apenas as regras essenciais ou a dúvida específica que necessita validação

Não crie **Regras importantes** quando o conteúdo apenas repetir `Objetivo` ou `Como interpretar`. Quando faltar evidência, registre uma frase curta e específica, sem alertas longos ou genéricos.

Requisitos de layout:

- posicione a barra de abas no topo, com contraste claro entre estado normal, foco e `aria-selected="true"`;
- mantenha a aba ativa visualmente destacada por cor, borda, fundo ou combinação equivalente, sem depender apenas de mudança sutil de tom;
- use composição compacta, sem painéis de resumo, contadores de páginas, quantidade de visuais ou cards decorativos;
- adapte cada seção à proporção da imagem e ao tamanho real do texto, evitando alturas fixas e grandes espaços vazios;
- use largura de 95% da janela, limitada a 1600px, alinhando cabeçalho, conteúdo e rodapé com margens laterais reduzidas;
- use uma única coluna de indicadores em `visual-grid`, separados por 14px; nunca coloque dois indicadores lado a lado;
- mantenha o nome no topo de cada card e, abaixo, `visual-content` com imagem à esquerda em aproximadamente 35% e descrição à direita em aproximadamente 65%; não mova a descrição para baixo da imagem no desktop;
- mantenha duas colunas em tablets acima de 640px e empilhe imagem e descrição em telas de até 640px;
- preserve a proporção original com `width: auto`, `height: auto`, `max-width: 100%`, `max-height: 220px` e `object-fit: contain`; não aplique cortes, altura fixa ou ampliação obrigatória às imagens;
- use `visual-content no-image` para texto em largura completa quando não houver captura, sem coluna vazia;
- agrupe visuais semelhantes sob um título comum quando isso reduzir repetição;
- não inclua a captura inteira da página como introdução se os gráficos já estiverem recortados e presentes;
- use `@media print` para preservar contraste, evitar cortes dentro de um indicador e remover efeitos desnecessários;
- inclua em `@media print` uma regra equivalente a `[role="tabpanel"][hidden] { display: block !important; }` para imprimir todas as páginas, independentemente da aba ativa.

Incorpore cada imagem utilizada como Data URL Base64. É permitido incorporar a captura original uma vez em um elemento SVG interno e apresentar recortes fiéis com `viewBox` e referências internas, desde que o arquivo permaneça autossuficiente e nenhum gráfico seja recriado.

## Validação antes da entrega

- Confirme que existe somente um artefato novo ou atualizado: `documentacao.html`.
- Antes de gravar o arquivo, confirme que o candidato foi obtido somente pelas substituições demonstrativas permitidas.
- Compare o bloco `<style>` do candidato com o bloco do template e exija igualdade exata, caractere por caractere.
- Compare o bloco `<script>` do candidato com o bloco do template e exija igualdade exata, caractere por caractere.
- Confirme que existe exatamente um `<style>`, exatamente um `<script>`, nenhum atributo `style` e nenhuma classe fora do contrato do template.
- Confirme que o cabeçalho, a barra de abas, o contêiner principal e suas posições relativas permanecem iguais aos do template.
- Confirme que `<title>` e `<h1>` permanecem fixos, o subtítulo identifica o relatório e qualquer logo presente usa Base64 sem criar espaço vazio quando ausente.
- Confirme que cada `article.visual` contém exatamente um `visual-head` seguido de um `visual-content`, com `visual-image` antes de `visual-body` quando houver imagem. Sem imagem, exija `visual-content no-image` com somente `visual-body`.
- Confirme que todos os cards ocupam a largura completa; em 1440px e 768px, imagem e descrição devem ficar lado a lado, com a imagem limitada a 220px. Em 390px, a imagem deve ficar acima da descrição sem rolagem horizontal do documento.
- Verifique que a largura do documento é `min(95% da janela, 1600px)`, o espaçamento entre cards está entre 12px e 16px e a proporção renderizada das imagens coincide com a original.
- Valide também um indicador sem imagem, conferindo que o texto ocupa toda a largura, e a impressão, conferindo que todas as páginas ocultas aparecem. O script auxiliar valida o contrato estrutural; quando houver navegador disponível, verifique também as dimensões renderizadas.
- Se qualquer validação do template falhar, descarte o candidato e preserve o `documentacao.html` existente. Não tente corrigir o layout por aproximação.
- Quando houver imagens, confirme que toda imagem utilizada está incorporada em Base64 válido e que nenhum recorte distorce sua proporção.
- Procure e remova referências `http://`, `https://`, `file://`, caminhos absolutos, `<link>`, `@import` e qualquer `<script src="...">`. Mantenha somente o script incorporado necessário às abas.
- Confirme que a quantidade de abas corresponde à quantidade de páginas documentadas, os nomes e a ordem coincidem com o relatório e a primeira aba inicia ativa.
- Teste o clique e o teclado, verificando que somente um painel fica visível na tela e que `aria-selected`, `tabindex` e `hidden` são atualizados corretamente.
- Teste a visualização em largura reduzida e confirme que todos os nomes de página continuam acessíveis.
- Confirme pela folha de impressão ou por inspeção do CSS que todos os painéis são exibidos em `@media print`, mesmo quando ocultos na tela.
- Confirme que cada visual documentado está na página correta e possui nome, objetivo, orientação de interpretação e imagem quando houver captura correspondente.
- Quando não houver captura, confirme que o indicador continua compreensível, que `visual-image` foi omitido e que `image-placeholder` não aparece no documento.
- Confirme que cada regra funcional pode ser rastreada ao PBIR e ao modelo; quando não puder, registre a limitação sem completar a lógica por suposição.
- Confirme que cada `Objetivo` contém uma ou duas frases específicas e cada `Como interpretar` contém duas ou três frases úteis.
- Confirme que `Regras importantes` aparece somente quando necessária e contém apenas condições essenciais ou dúvidas específicas.
- Remova valores atuais, comparações de resultados, análises de desempenho, explicações óbvias, frases genéricas, inventários técnicos, DAX e seções não permitidas.
- Revise separadamente quantidade versus percentual, total bruto versus distinto, realizado versus referência e referência versus meta para impedir equivalências não comprovadas.
- Confirme que arquivos PBIP, PBIR, TMDL, `model.bim` e imagens originais permaneceram inalterados.
- Abra o HTML localmente, quando o ambiente permitir, e verifique se texto, imagens, responsividade e impressão continuam legíveis sem acesso à rede.

## Limites de escopo

Esta Skill não modifica o relatório, o modelo semântico ou as capturas; não cria DAX, não publica no Fabric ou no Power BI Service, não chama APIs, não exige autenticação e não gera PDF. Ela produz somente um manual HTML autossuficiente com interação local por abas. A ausência do modelo local limita a comprovação das regras e deve ser informada no documento.

## Instrução permanente

Quando o arquivo documentacao.html já existir, ignorar seu HTML durante a montagem e reconstruí-lo exclusivamente a partir de `assets/semanticdoc_template.html`, resolvido relativamente à pasta deste `SKILL.md`. O arquivo anterior não pode ser usado como fonte visual, estrutural ou de regras de negócio.
