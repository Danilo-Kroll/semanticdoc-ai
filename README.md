# semanticdoc-ai

Skill local do Codex para documentar um projeto Power BI para a área de negócio.
Interpreta o arquivo PBIP e prints dos visuais e gerar um manual funcional em português brasileiro.

O resultado é um único `documentacao.html`, com navegação por abas e imagens quando existirem capturas reais.

## Requisitos

- Um projeto Power BI em formato PBIP, com o arquivo `*.pbip` e os artefatos por ele referenciados.
- Codex com suporte a Skills locais.

Não é necessário instalar Python, Node.js, bibliotecas, Microsoft Fabric, Power BI Service, gateways ou ferramentas pagas. A análise usa somente os arquivos locais já disponíveis.

## Instalação no projeto

Copie somente a pasta completa `semanticdoc-ai` para `.agents/skills` ou clone esse repositório para o seu projeto. O template já acompanha a Skill em `assets/`, portanto não precisa ser instalado ou configurado separadamente:

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
├── README.md
├── img/
├── seu-relatorio.pbip
├── pasta-do-relatorio/
└── pasta-do-modelo/
```

A Skill resolve `assets/semanticdoc_template.html` relativamente ao próprio `SKILL.md`. Nenhum caminho absoluto ou configuração na raiz do projeto é necessário.

A pasta `scripts/` inclui `render_documentation.cjs`, um montador e validador opcional para ambientes que já tenham Node.js. Copie a pasta completa da Skill; a execução básica continua sem exigir instalação adicional.

## Uso

Na pasta 'img' guarde o print de cada aba do Power BI (Na ausência de capturas, os visuais continuam documentados sem imagem e sem espaços vazios. A quantidade e a numeração dos arquivos não determinam a página: a correspondência é validada pelo PBIR, pelos títulos e pela disposição dos visuais. A Skill nunca cria gráficos fictícios, A renomeação dos prints apenas ajuda a Skill a ser mais eficiente).

Abra a raiz do projeto como diretório de trabalho no Codex e execute:

```text
$semanticdoc-ai
```

Nenhum prompt adicional é necessário e não precisa deixar o Power BI aberto. A Skill:

1. localiza o PBIP;
2. segue suas referências para o relatório PBIR e o modelo semântico;
3. preserva a ordem e os nomes originais das páginas;
4. relaciona visuais, medidas, campos, filtros e regras de cálculo;
5. procura capturas reais primeiro em `img/`, `images/`, `screenshots/` e `capturas/`, sem exigir que essas pastas existam;
6. gera `documentacao.html` ao lado do PBIP.

Se houver vários arquivos PBIP, a Skill lista somente seus caminhos relativos e solicita a escolha. Também é possível selecionar diretamente um projeto:

```text
$semanticdoc-ai ./caminho/para/arquivo.pbip
```

## Conteúdo gerado

O manual contém:

- uma aba por página do relatório;
- objetivo resumido de cada página;
- nome e três seções obrigatórias para cada visual funcional: Objetivo, Como é calculado e Como interpretar;
- regras importantes somente quando comprovadas ou necessárias para evitar leitura incorreta;
- imagens originais quando houver correspondência segura com o visual.

Cada indicador ocupa uma linha completa, com título no topo, imagem à esquerda e texto à direita. Para o celular a página é ajustada.

Em “Como é calculado”, a Skill explica a lógica comprovada das medidas e dos campos em linguagem simples, incluindo filtros e dependências relevantes. Diferencia soma, média, percentual, contagem e contagem distinta, sem publicar DAX. Se o cálculo não puder ser verificado, registra uma limitação breve nessa seção. No montador, essa explicação deve ser informada pelo campo obrigatório `calculation` de cada visual.

## Fontes analisadas

- PBIP para descoberta dos artefatos;
- PBIR atual ou `report.json` legado para páginas, visuais, campos, filtros e configurações;
- TMDL ou `model.bim` para medidas, dependências e regras de cálculo;
- capturas fornecidas pelo usuário na pasta 'img' (não obrigatória).

Quando o modelo semântico é externo ou não está disponível, a documentação identifica apenas as regras específicas que não puderam ser verificadas.

## Segurança e limites

- O PBIP, o relatório, o modelo e as imagens originais não são alterados.
- Nenhum dado é enviado a serviços externos.
- Não são usados Power BI Service, Microsoft Fabric, APIs ou tokens.
- Valores momentâneos e análises dos resultados atuais não são reproduzidos.
- Regras de negócio sem evidência no projeto não são inventadas.
- O único arquivo de saída é `documentacao.html`.
