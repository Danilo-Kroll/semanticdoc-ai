# SemanticDoc AI

**Geração automatizada de documentação orientada ao negócio para relatórios Power BI utilizando Codex Skills.**

O SemanticDoc AI é uma Skill para o Codex que interpreta projetos Power BI, analisa a estrutura dos visuais e as regras de cálculo e gera um manual funcional em português brasileiro.

O objetivo é facilitar a compreensão dos indicadores por usuários de negócio, sem exigir conhecimento técnico de DAX ou do modelo de dados.

O resultado é um único arquivo `documentacao.html`, com navegação por páginas, explicações e imagens dos visuais quando houver capturas disponíveis.

## Requisitos

- Codex com suporte a Skills locais.
- Projeto Power BI em formato PBIP, incluindo o arquivo `.pbip` e os artefatos referenciados.

A execução básica não exige a instalação de Python, Node.js, bibliotecas adicionais, Power BI Desktop, Microsoft Fabric, Power BI Service ou ferramentas pagas.

## Instalação

Copie a pasta completa `semanticdoc-ai` para o diretório `.agents/skills/` do seu projeto.

A estrutura esperada é:

```text
seu-projeto/
├── .agents/
│   └── skills/
│       └── semanticdoc-ai/
│           ├── SKILL.md
│           ├── assets/
│           │   └── semanticdoc_template.html
│           └── scripts/
│               ├── render_documentation.cjs
│               └── render_documentation.test.cjs
├── img/
├── seu-relatorio.pbip
├── pasta-do-relatorio/
└── pasta-do-modelo/
```

O template HTML `assets/` acompanha a Skill, não houvendo a necessidade de configurar caminhos absolutos. Fique a vontade para alterar o layout!

A pasta `scripts/` contém um montador e validador opcional para ambientes que já possuem Node.js. Sua utilização não é obrigatória para a execução básica.

## Como utilizar

### 1. Prepare o projeto

Abra no Codex a pasta que contém seu projeto Power BI (`.pbip`).

Opcionalmente, na pasta `img/` capture as páginas ou dos visuais do relatório.

Exemplo:

```text
img/
├── logo.png
├── 01.png
├── 02.png
└── 03.png
```

- `logo.png`: identidade visual opcional para o cabeçalho.
- `01.png`, `02.png`, `03.png`: capturas utilizadas na documentação.

A numeração é apenas uma referência. A Skill procura relacionar as imagens às páginas e aos visuais utilizando a estrutura do PBIR, os títulos e a disposição dos elementos.

As imagens são opcionais. Na ausência de capturas, os indicadores continuam documentados normalmente, sem espaços reservados para gráficos.

### 2. Execute a Skill

No Codex, digite:

```text
$semanticdoc-ai
```

Nenhum prompt adicional é necessário.

A Skill identifica automaticamente o projeto, analisa seus componentes e gera a documentação.

Também é possível informar diretamente o arquivo PBIP:

```text
$semanticdoc-ai ./caminho/para/arquivo.pbip
```

Caso existam vários projetos PBIP no diretório, a Skill solicita a seleção de um deles.

### 3. Acesse a documentação

Após a execução, será criado o arquivo:

```text
documentacao.html
```

O arquivo é gerado ao lado do PBIP selecionado e pode ser aberto diretamente no navegador, sem conexão com serviços externos para exibição.

## Conteúdo da documentação

O SemanticDoc AI gera um manual organizado por páginas, preservando os nomes e a ordem original do relatório Power BI.

Cada indicador contém três seções principais:

**Objetivo**

Explica a finalidade do indicador e qual informação de negócio ele representa.

**Como é calculado**

Traduz as regras de cálculo identificadas no modelo semântico para uma linguagem simples, considerando agregações, filtros e dependências relevantes.

A documentação distingue operações como soma, média, percentual, contagem e contagem distinta, sem reproduzir as fórmulas DAX.

**Como interpretar**

Orienta o usuário sobre o significado do indicador e os cuidados necessários para interpretar corretamente seus resultados.

Quando necessário, também são apresentadas regras importantes ou limitações específicas que não puderam ser verificadas.

### Apresentação visual

O manual utiliza um layout responsivo, com:

- Uma aba para cada página do relatório.
- Imagens originais dos gráficos à esquerda e descrições à direita em telas maiores.
- Adaptação automática para dispositivos móveis.
- Título padronizado e identificação dinâmica do relatório.
- Logotipo opcional.
- Imagens incorporadas em Base64.
- CSS e JavaScript internos, sem dependências externas para visualização.

## Fontes analisadas

O SemanticDoc AI utiliza os seguintes artefatos:

| Fonte | Finalidade |
|---|---|
| PBIP | Identificação e descoberta do projeto Power BI. |
| PBIR ou `report.json` | Páginas, visuais, campos, filtros e configurações. |
| TMDL ou `model.bim` | Medidas, dependências e regras de cálculo. |
| Capturas de tela | Representação visual dos indicadores no manual. |

Quando o modelo semântico está ausente ou utiliza uma conexão externa, a Skill informa as limitações específicas de interpretação, sem inventar regras de negócio.

## Segurança e limitações

- Não altera os arquivos originais do Power BI.
- Não modifica as capturas fornecidas pelo usuário.
- Não publica relatórios no Power BI Service ou Microsoft Fabric.
- Não utiliza APIs externas adicionais ou tokens próprios.
- Não reproduz valores momentâneos nem realiza análises de desempenho.
- Não inventa regras de cálculo sem evidência nos arquivos disponíveis.
- Não exige que o Power BI Desktop esteja aberto.
- Gera somente um arquivo final: `documentacao.html`.

**Privacidade:** a Skill não implementa envio próprio de dados para serviços externos. O processamento realizado pelo Codex segue as configurações de privacidade e segurança do ambiente em que ele é utilizado.

## Tecnologias

- Codex Skills
- Power BI Project (PBIP)
- Power BI Enhanced Report Format (PBIR)
- Tabular Model Definition Language (TMDL)
- DAX
- HTML, CSS e JavaScript

## Objetivo do projeto

O SemanticDoc AI busca aproximar a documentação técnica dos relatórios Power BI das necessidades dos usuários de negócio.

Em vez de apresentar fórmulas e estruturas internas, transforma as definições disponíveis no projeto em explicações funcionais, facilitando a compreensão e a utilização dos indicadores.
