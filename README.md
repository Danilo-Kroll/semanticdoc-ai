# SemanticDoc AI

**Geração automatizada de documentação orientada ao negócio para relatórios Power BI utilizando Codex Skills.**

O SemanticDoc AI é uma Skill para o Codex que interpreta projetos Power BI, analisa a estrutura dos visuais e suas regras de cálculo e gera um **manual de indicadores orientado ao negócio**, em português brasileiro.

O objetivo é facilitar a compreensão dos indicadores pelos usuários de negócio e preservar o conhecimento sobre suas definições e regras, sem exigir conhecimentos técnicos de DAX ou do modelo de dados.

O resultado é um único arquivo `documentacao.html`, com navegação por páginas, explicações em linguagem de negócio e imagens dos visuais, quando houver capturas disponíveis.

Veja o [exemplo com o painel Netflix](example/README.md), com o link do Power BI, capturas das páginas e o HTML gerado.

## Objetivo do projeto

O SemanticDoc AI foi criado para **preservar e compartilhar o conhecimento de negócio presente nos relatórios Power BI**.

Em muitas organizações, o entendimento sobre o que cada indicador representa, como é calculado e como deve ser interpretado fica concentrado nos profissionais que desenvolveram ou acompanham os relatórios.

Com mudanças de colaboradores, equipes ou responsabilidades, esse conhecimento pode se perder, dificultando a continuidade das análises e a compreensão das informações.

O SemanticDoc AI busca reduzir essa dependência, transformando as definições dos relatórios e modelos semânticos em uma documentação clara, acessível e orientada à área de negócio.

Dessa forma, o conhecimento sobre os indicadores permanece documentado e disponível para consultas, integração de novos colaboradores e continuidade das atividades, independentemente de quem desenvolveu originalmente o relatório.

## Requisitos

- Codex com suporte a Skills locais.
- Projeto Power BI em formato PBIP, incluindo o arquivo `.pbip` e os artefatos referenciados.

A execução básica não exige a instalação de Python, Node.js, bibliotecas adicionais, Power BI Desktop, Microsoft Fabric, Power BI Service ou ferramentas pagas.

## Instalação

Clone ou baixe este repositório do GitHub.

Salve seu relatório Power BI no formato PBIP na raiz do projeto, mantendo os arquivos e pastas gerados pelo Power BI Desktop.

A estrutura ficará semelhante a esta:

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

O template HTML está incluído na pasta `assets/` da Skill, sem necessidade de configurar caminhos absolutos. O layout pode ser personalizado conforme a identidade visual da organização, desde que sejam preservados os componentes necessários à geração da documentação.

A pasta `scripts/` contém um montador e um validador opcionais para ambientes que já possuem Node.js. Sua utilização não é obrigatória para a execução básica.

## Como utilizar

### 1. Prepare o projeto

Abra no Codex a pasta raiz do projeto (seu-projeto/).

Opcionalmente, na pasta `img/` salve as capturas das páginas ou dos visuais do relatório.

Exemplo:

```text
img/
├── logo.png
├── 01.png
├── 02.png
└── 03.png
```

- `logo.png`: permite personalizar o cabeçalho da documentação com a identidade visual da sua empresa/projeto. A inclusão é opcional e aceita imagens nos formatos PNG, JPG e JPEG. Salve o arquivo com o nome `logo` e a extensão correspondente.
- `01.png`, `02.png`, `03.png`: capturas utilizadas na documentação.

A numeração dos arquivos é apenas uma referência. A Skill procura relacionar as imagens às páginas e aos visuais utilizando a estrutura do PBIR, os títulos e a disposição dos elementos.

As imagens são opcionais. Na ausência de capturas, os indicadores continuam documentados normalmente, sem espaços reservados para gráficos.

### 2. Execute a Skill

Não é necessário manter o projeto aberto no Power BI Desktop durante a execução.

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

O SemanticDoc AI gera um manual de indicadores organizado por páginas, preservando os nomes e a ordem original do relatório Power BI e apresentando as informações em linguagem acessível às áreas de negócio.

Cada indicador documentado apresenta três seções principais:

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

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
