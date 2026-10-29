# semanticdoc-ai

Skill local do Codex para descobrir um projeto Power BI PBIP, interpretar suas páginas e seus visuais com apoio do modelo semântico e gerar um manual funcional em português brasileiro.

O resultado é um único `documentacao.html` autossuficiente, com navegação por abas e imagens Base64 quando existirem capturas reais.

## Requisitos

- Um projeto Power BI em formato PBIP, com o arquivo `*.pbip` e os artefatos por ele referenciados.
- Codex com suporte a Skills locais.

Não é necessário instalar Python, Node.js, bibliotecas, Microsoft Fabric, Power BI Service, gateways ou ferramentas pagas. A análise usa somente os arquivos locais já disponíveis.

## Instalação no projeto

Copie somente a pasta completa `semanticdoc-ai` para `.agents/skills`. O template canônico já acompanha a Skill em `assets/`, portanto não precisa ser instalado ou configurado separadamente:

```text
seu-projeto/
├── .agents/
│   └── skills/
│       └── semanticdoc-ai/
│           ├── SKILL.md
│           ├── README.md
│           └── assets/
│               └── semanticdoc_template.html
├── seu-relatorio.pbip
├── pasta-do-relatorio/
└── pasta-do-modelo/
```

A Skill resolve `assets/semanticdoc_template.html` relativamente ao próprio `SKILL.md`. Nenhum caminho absoluto ou configuração na raiz do projeto é necessário.

## Uso

Abra a raiz do projeto como diretório de trabalho e execute:

```text
$semanticdoc-ai
```

Nenhum prompt adicional é necessário quando existe um único PBIP. A Skill:

1. localiza o PBIP;
2. segue suas referências para o relatório PBIR e o modelo semântico;
3. preserva a ordem e os nomes originais das páginas;
4. relaciona visuais, medidas, campos, filtros e regras de cálculo;
5. procura capturas reais primeiro em `imagens/`, `images/`, `screenshots/` e `capturas/`, sem exigir que essas pastas existam;
6. gera `documentacao.html` ao lado do PBIP.

Se houver vários arquivos PBIP, a Skill lista somente seus caminhos relativos e solicita a escolha. Também é possível selecionar diretamente um projeto:

```text
$semanticdoc-ai ./caminho/para/arquivo.pbip
```

## Conteúdo gerado

O manual contém:

- uma aba por página do relatório;
- objetivo resumido de cada página;
- nome, objetivo e orientação de interpretação para cada visual funcional;
- regras importantes somente quando comprovadas ou necessárias para evitar leitura incorreta;
- imagens originais em Base64 quando houver correspondência segura com o visual.

Na ausência de capturas, os visuais continuam documentados sem imagem e sem espaços vazios. A quantidade e a numeração dos arquivos não determinam a página: a correspondência é validada pelo PBIR, pelos títulos e pela disposição dos visuais. A Skill nunca cria gráficos fictícios.

## Fontes analisadas

- PBIP para descoberta dos artefatos;
- PBIR atual ou `report.json` legado para páginas, visuais, campos, filtros e configurações;
- TMDL ou `model.bim` para medidas, dependências e regras de cálculo;
- capturas fornecidas pelo usuário ou armazenadas no projeto.

Quando o modelo semântico é externo ou não está disponível, a documentação identifica apenas as regras específicas que não puderam ser verificadas.

## Segurança e limites

- O PBIP, o relatório, o modelo e as imagens originais não são alterados.
- Nenhum dado é enviado a serviços externos.
- Não são usados Power BI Service, Microsoft Fabric, APIs ou tokens.
- Valores momentâneos e análises dos resultados atuais não são reproduzidos.
- Regras de negócio sem evidência no projeto não são inventadas.
- O único arquivo de saída é `documentacao.html`.
