---
name: semanticdoc-ai
description: Automatically discovers Power BI PBIP projects in the working directory, interprets PBIR pages and visuals using the TMDL or model.bim semantic model, and generates an offline functional HTML manual from the bundled template. Use with $semanticdoc-ai to document any report without additional external services, current chart values, or changes to the project.
---

# SemanticDoc AI

Analyze any local Power BI project, its visual context, and its semantic model to help end users understand the purpose and correct interpretation of its indicators. Derive every name, path, page, visual, and rule from the selected project; never carry over assumptions from a previously analyzed report.

These instructions are written in English for reuse across environments. The generated manual remains in Brazilian Portuguese to match the bundled template and renderer. Preserve the literal Portuguese UI labels specified below. The original Portuguese instructions are preserved in [SKILL.pt-BR.md](SKILL.pt-BR.md) as a reference copy; this `SKILL.md` is the active entry point.

## Portability and dependencies

- Treat the directory opened by the user, or the directory explicitly provided in the invocation, as the working root. Do not search outside that root.
- Resolve project paths relative to the `*.pbip` file and Skill resource paths relative to the directory containing this `SKILL.md`.
- Do not hardcode absolute paths, usernames, drive letters, report names, pages, measures, tables, fields, or business domains.
- Use only resources already available in the Codex environment and local files. Basic execution must not request installation of Python, Node.js, libraries, Power BI Desktop, Microsoft Fabric, gateways, or converters.
- Do not require Power BI Service, Fabric, tokens, APIs, authentication, additional licenses, or paid services. Do not send the project or its data to external services.
- Use `assets/semanticdoc_template.html` as the canonical visual template, resolved relative to the directory containing this `SKILL.md`. The Skill installation must be self-contained and must not depend on a template located at the root of a Power BI project.

## Automatic invocation

A message containing only `$semanticdoc-ai` is a complete request. An optional path to a `*.pbip` file simply selects the project directly. Upon invocation:

- start immediately without asking for an objective, context, confirmation, or additional instructions;
- discover `*.pbip` files inside the working root, excluding the Skill's own directory, `.git`, dependency directories, caches, and generated outputs;
- if a valid path was provided, use that project;
- if exactly one PBIP exists, select it automatically;
- if more than one PBIP exists, do not generate or overwrite `documentacao.html`: list only the relative paths found and ask the user to select a project;
- if no PBIP exists, accept a single report directory containing `definition.pbir`; if there are no candidates or multiple candidates, ask only for the user to provide or select the project;
- map pages, visuals, fields, measures, filters, and images before writing the content;
- read the entire `assets/semanticdoc_template.html`, relative to the directory containing this `SKILL.md`, and use it as the mandatory output source;
- generate only `documentacao.html` in the selected PBIP's directory unless the user explicitly requests another output directory;
- tell the user the generated file's path.

If screenshots are unavailable but PBIP/PBIR exists, proceed and generate documentation without images. Images alone do not replace the project for this universal workflow: without an identifiable report definition, do not create an empty file; ask only for the user to provide the Power BI project.

## Expected output

Create or update `documentacao.html` in Brazilian Portuguese alongside the selected PBIP. Preserve the template's fixed title and derive the subtitle from the selected project's name and purpose. If the user explicitly specifies another directory, use that location. The manual must explain the purpose and interpretation of the indicators using the actual definitions found in PBIR and the semantic model.

The HTML must be a single, self-contained file:

- when screenshots are available, embed every image used as a Data URL in the format `data:image/<type>;base64,<content>`;
- place all CSS inside a `<style>` element;
- do not use local or external paths, remote URLs, external fonts, stylesheets, or external scripts;
- place all required JavaScript inside a `<script>` element in the HTML itself;
- do not generate Markdown, permanent cropped images, CSS files, JavaScript files, or any other project files;
- preserve the source image files;
- do not create inventories, dependency maps, or auxiliary technical reports.

Do not modify the original Power BI report or any files that belong to it. The only permitted project operations are reading files and creating or updating `documentacao.html`.

## Mandatory visual template

Always use the canonical file [assets/semanticdoc_template.html](assets/semanticdoc_template.html), bundled inside the Skill directory, as the sole visual source for `documentacao.html`. Resolve this path from the directory containing `SKILL.md`, regardless of the working directory or the PBIP project's location.

- Read the complete template on every execution before generating or updating the document.
- Treat the template as read-only during execution. Modify it only when the user explicitly requests a change to the visual standard itself.
- Preserve its layout, colors, fonts, visual identity, CSS, structural classes, tab navigation, responsiveness, print rules, and JavaScript. Do not recreate an equivalent style or use a previous `documentacao.html` as a template.
- Keep `<title>` and `<h1>` fixed. Replace only the header subtitle, the optional logo marker, and the content between the `SEMANTICDOC:TABS` and `SEMANTICDOC:PAGES` markers. Everything else must remain identical.
- Use a logo only when it has been provided and reliably identified. At `<!-- SEMANTICDOC:LOGO -->`, insert a single Base64 `hero-logo` image with alternative text; without a logo, keep the marker without reserving space.
- Use the template's existing components and classes for page titles, indicators, images, `Objetivo`, `Como é calculado`, `Como interpretar`, and relevant rules.
- Replace illustrative text with explanations supported by PBIP/PBIR and the semantic model. The template defines presentation, not business rules.
- When a screenshot is reliably matched, place it in `<div class="visual-image"><img ...></div>` as the first child of `visual-content`, followed by `visual-body`, with a Base64 Data URL and functional alternative text. Without a screenshot, use `visual-content no-image` containing only `visual-body`; never use `image-placeholder`.
- If the template cannot be read, do not improvise another visual standard. State only that the required resource is unavailable and do not overwrite existing documentation.

### Literal generation contract

The template is the source file, not merely a style reference. Assemble the document in this order:

1. load the complete `assets/semanticdoc_template.html`, resolved from the directory containing this `SKILL.md`, into memory before producing any HTML;
2. confirm that it contains `<style>`, `<script>`, `header.hero`, `nav.tabs`, demonstration pages, and the footer;
3. prepare the subtitle, optional logo, tab buttons, and page sections separately, keeping the titles fixed;
4. create the candidate `documentacao.html` exclusively by replacing the corresponding demonstration content in the loaded template;
5. validate the candidate in memory;
6. write or overwrite `documentacao.html` only after all validations pass.

The following are prohibited:

- starting from an empty HTML document, rewriting the document skeleton, or copying previous documentation;
- changing, reordering, reformatting, or regenerating anything outside the replaced demonstration areas;
- adding another `<style>`, another `<script>`, `style` attributes, libraries, stylesheets, or scripts;
- creating new visual classes or replacing template components with equivalent markup;
- modifying the template to accommodate a particular report.

Generated content may use only these template classes: `hero`, `shell`, `hero-layout`, `hero-copy`, `hero-logo`, `eyebrow`, `subtitle`, `tabs`, `tab`, `page`, `active`, `page-intro`, `visual-grid`, `visual`, `visual-head`, `visual-content`, `no-image`, `visual-image`, `visual-body`, `field`, `rule`, `footer`, and `note`. Do not use `wide`, `image-placeholder`, or variants that place indicators side by side.

Use these canonical components. Placeholder descriptions are in English; the literal UI labels remain in Portuguese:

```html
<button class="tab" id="tab-{id}" role="tab" aria-selected="{true|false}"
  aria-controls="page-{id}" tabindex="{0|-1}" data-tab="page-{id}">
  {original page name}
</button>

<section class="page {active}" id="page-{id}" role="tabpanel"
  aria-labelledby="tab-{id}" {hidden}>
  <div class="page-intro">
    <h2>{original page name}</h2>
    <p><strong>Objetivo da página:</strong> {page objective}</p>
  </div>
  <div class="visual-grid">{visuals}</div>
</section>

<article class="visual">
  <div class="visual-head"><h3>{indicator name}</h3></div>
  <div class="visual-content">
    <div class="visual-image"><img src="data:image/png;base64,{screenshot}" alt="{functional description}"></div>
    <div class="visual-body">
      <div class="field">Objetivo</div>
      <p>{objective}</p>
      <div class="field">Como é calculado</div>
      <p>{verified calculation logic or specific limitation}</p>
      <div class="field">Como interpretar</div>
      <p>{interpretation}</p>
      {optional rule}
    </div>
  </div>
</article>
```

Every indicator occupies a full-width row, with no exceptions based on visual type. Without an image, omit `visual-image` and add `no-image` to `visual-content` so the text uses the full width. For pages without functional indicators, keep only `page-intro` and omit `visual-grid`; do not invent cards.

When Node.js is already available, use [scripts/render_documentation.cjs](scripts/render_documentation.cjs) to assemble and validate the HTML from the template. The script accepts JSON on standard input with `subtitle`, optional `logo`, and `pages`; each page contains `name`, `objective`, and `visuals`, and each visual contains `name`, `objective`, `calculation`, `interpretation`, optional `rules` (a list of sentences), and optional `image`. The required `calculation` field contains the verified calculation explanation or a short statement that the calculation is unavailable; do not omit the field when evidence is missing. Each image or logo contains `src` (a Base64 Data URL) and `alt`. Run `node <skill-directory>/scripts/render_documentation.cjs <output-directory>/documentacao.html`. Keep the JSON only in memory or in a temporary file removed after execution. The script does not interpret DAX and does not replace functional analysis. If Node.js is unavailable, follow the same contract directly using existing resources, without requesting installation.

## Workflow

### 1. Discover the project and screenshots

- First apply the deterministic selection process defined in **Automatic invocation**. Do not choose arbitrarily between multiple PBIPs.
- Read the selected PBIP as a manifest and resolve each artifact path from its directory. Do not assume names such as `Report`, `SemanticModel`, or a particular prefix.
- Within the referenced artifacts, look for `definition.pbir`, `*.tmdl`, `model.bim`, and, for legacy formats, `report.json`.
- Starting from the selected PBIP's directory, search the optional `img/`, `images/`, `screenshots/`, and `capturas/` directories first, in that order. If none exists or contains usable screenshots, search for PNG, JPG, JPEG, WEBP, BMP, GIF, TIF, or TIFF files in the project's remaining directories.
- Do not require an image directory or a minimum number of files. Without screenshots, proceed normally with textual documentation and omit image components.
- Do not map files to pages solely by filename, numbering, or order. Validate each match using PBIR, the visible page name, titles, dimensions, positions, and visual composition; treat filenames and numbering only as supporting clues.
- Consider only page or visual screenshots. Ignore logos, icons, backgrounds, covers, posters, and other decorative or internal report resources unless they are an inseparable part of an actual screenshot supplied by the user.
- Exclude `documentacao.html` itself and the entire directory containing this `SKILL.md`, including `assets/`, `scripts/`, `references/`, and any other installed Skill resources. Do not move, rename, or modify discovered images.

### 2. Read the report definition

- Use the PBIP references to locate the report artifact. Do not match directories by similar names when the manifest provides an explicit path.
- Read `definition.pbir` to determine the semantic model reference.
- When `datasetReference.byPath` exists, resolve its relative path and look for the corresponding local model.
- When only `datasetReference.byConnection` exists, or the local path is missing, treat the model as external or unavailable. Add a single short note stating that the calculation logic has not been verified; for each affected indicator, mention only the specific unknown rule rather than repeating general warnings.
- For PBIR, read `definition/pages/pages.json` to preserve the original page order, each `page.json` for the original name, dimensions, and page filters, and each `visuals/*/visual.json` for position, title, query, fields, measures, aggregations, filters, and sorting.
- In each `visual.json`, also determine which fields provide axes, categories, series, legends, values, and tooltips. Identify whether the visual represents a total, percentage, share, composition, trend, ranking, time variation, or comparison between actual values, valid values, targets, limits, or periods.
- Also consider report filters in `definition/report.json` and report-level measures in `definition/reportExtensions.json`, when present.
- If the report uses PBIR-Legacy, extract the same information from the available `report.json` without editing or converting the format.

### 3. Map visuals to the model

- For each functional visual, identify its query projections and internally record the measures, columns, hierarchies, aggregations, visual calculations, and filters used. Do not publish this inventory in the HTML.
- Ignore shapes, images, buttons, navigators, text boxes, and other purely decorative elements. Preserve text only when necessary to understand an indicator or usage rule.
- Locate each measure or field in the model's TMDL, usually in `definition/tables/*.tmdl` and other `*.tmdl` files. For a `model.bim` model, inspect the equivalent JSON definition.
- For each measure used by the visual, read its DAX expression and follow only the dependencies needed to understand its meaning.
- Check calculation conditions and criteria, internal filters, measure dependencies, treatment of blank or zero values, distinct counts, temporal context, removed or preserved filters, and explicitly defined targets and limits.
- Distinguish similar measures before writing, especially quantities versus percentages, completed visits versus valid visits, raw totals versus distinct counts, and current values versus references. Do not treat similar names as equivalent.
- For calculated columns, calculation groups, parameters, or implicit aggregations, inspect the corresponding definition when it affects interpretation.
- Examine relationships and filter direction only when essential to explain the indicator. Do not turn the documentation into a model description.
- Maintain an evidence trail only during analysis: visual → role in the visual → field or measure → definition → functional rule. Do not create an auxiliary file for this trail.
- Internally classify every claim as `verified in PBIR`, `verified in the model`, or `requires validation`. Do not publish these labels as an inventory; use them to prevent assumptions from being presented as facts.
- If a visual cannot be reliably linked to its field or measure, do not infer the logic from its title. State only the specific uncertainty beside that indicator, for example: `A condição usada neste indicador não pôde ser verificada no modelo disponível.`

### 4. Match screenshots to visuals

- Use screenshots as visual representations, not as the primary source for calculation rules.
- Match the screenshot to the page using the visible name, `page.json.displayName`, page order, and visual composition.
- Match each chart or card to its `visual.json` using title, relative position, visible fields, legends, and axes. Do not rely only on similar text when the match is ambiguous.
- Crop the original screenshot only when the visual's boundaries are reliable, preserving the title, axes, labels, and legend needed for interpretation.
- Do not redraw, reconstruct, enhance, or alter the chart. If a crop is unsafe, use the full screenshot for that visual only.
- Do not include a full-page screenshot when all relevant visuals on that page already have individual images.
- When no screenshot is available, retain the indicator's functional documentation and omit the image without creating a decorative placeholder.
- Do not install editing or conversion tools to create crops. If existing resources cannot produce a reliable crop, retain the corresponding full screenshot or document the visual without an image.

### 5. Write the content and generate HTML

- Follow the **Literal generation contract**. Use `assets/semanticdoc_template.html`, resolved relative to the directory containing this `SKILL.md`, as the source file, replacing only the authorized demonstration content; never write the complete document from scratch.
- Translate verified model rules into business language without reproducing DAX, technical table names, relationships, or implementation details.
- For every indicator, always include these three sections in order: `Objetivo`, `Como é calculado`, and `Como interpretar`. Write one or two sentences per section; use a third calculation sentence only when necessary to explain a relevant condition.
- In `Objetivo`, explain the indicator's business purpose. In `Como é calculado`, translate the verified logic of the DAX measures and fields used by the visual. In `Como interpretar`, explain how to understand and use the result in analysis without repeating the objective or retelling the calculation.
- In `Como é calculado`, distinguish sums, averages, record counts, distinct counts, and percentages; for percentages, explain the numerator and the comparison base. Include internal filters, measure dependencies, groupings, temporal context, and treatment of blanks or zeros only when verified and relevant.
- For unaggregated visuals, such as a list of titles, explain how records are selected and organized according to the visual's configuration without inventing a mathematical operation.
- When a calculation cannot be verified, keep `Como é calculado` with a specific sentence such as `A regra de contagem não pôde ser verificada no modelo disponível.` When only part of the logic is available, explain only the verified portion and briefly identify the missing criterion; never infer rules from a title or screenshot.
- Do not reproduce DAX formulas, technical table names, or current chart values in any of the three sections. Every sentence must add specific information; do not copy the same text between sections or repeat a calculation rule in `Regras importantes`.
- Create `Regras importantes` only for a verified condition that changes interpretation or a specific uncertainty requiring validation. Use a few short items and omit the section when it adds no information.
- Organize indicators by page in report order, grouping similar indicators when this reduces repetition and improves clarity.
- Generate one tab per page using its exact original name, and make the report's first page the initial tab.
- When screenshots exist, embed them in Base64 using the template's image components; write only `documentacao.html`.
- Before finishing, check every explanation against the evidence trail and validate the file offline.

If temporary files are needed for cropping or conversion, keep them outside the project and remove them after images have been embedded. The only final artifact generated by execution must be `documentacao.html`.

## Interpretation rules

- Use simple, short, objective language suitable for end users.
- Explain only rules that affect the correct interpretation of an indicator.
- Do not reproduce displayed values, current results, month-by-month narratives, or category-by-category lists.
- Do not compare bars, points, or periods or conclude that a result is high, low, better, or worse.
- Do not generate performance analysis, trend conclusions, or recommendations from displayed data.
- Do not repeat the chart title as the objective's description.
- Do not use empty phrases such as "allows analysis of the data" or "presents information." State the business decision, monitoring task, or understanding that the indicator supports.
- Do not explain obvious visual conventions such as "larger bars represent larger values" unless a verified nonstandard meaning applies to a scale, sign, color, or axis.
- Do not create sections named `Tipo de visual`, `O que apresenta`, `Filtros identificados`, or equivalent headings.
- Do not repeat generic explanations or the same rule for every indicator. Explain a shared rule once at the relevant group or page level.
- Do not reproduce DAX, queries, tables, technical columns, relationships, or internal model names in the final document.
- Do not invent rules, targets, periods, units, definitions, or dependencies. When evidence is insufficient, state only the specific limitation.
- Do not call a reference a target without evidence in PBIR or the model, and do not assume higher results are always better.
- Do not confuse quantities with percentages, raw totals with distinct counts, actual values with references, or fields and measures with similar names.
- Do not create a general, repetitive confirmation section. Place an important rule or specific uncertainty near its indicator only when it prevents a misunderstanding.
- Ignore purely decorative visuals and avoid documenting slicers as indicators. Discuss filter effects only when essential to interpretation.
- Do not send files or data to additional external services. Work only with resources available in the current environment.

## HTML structure and presentation

Preserve the document, components, and styles in `assets/semanticdoc_template.html`, located relative to this `SKILL.md`. The template already includes `<!doctype html>`, `<html lang="pt-BR">`, UTF-8, viewport metadata, semantic HTML, internal CSS, and internal JavaScript; do not replace these elements or add external dependencies.

### Tab navigation

- Create a tab bar at the top of the document, before the page content.
- Generate one tab per documented page, preserving the order in `pages.json` or the report's order in the legacy format.
- Use the exact original `page.json.displayName` as each tab label. Do not replace, shorten, or translate it.
- Associate each tab with exactly one page panel. A panel's content must not appear in another panel.
- Mark the first tab active on initial load and display only the first page's panel.
- Selecting a tab must hide the other panels, show only the corresponding panel, and update the active styling.
- Use buttons with `role="tab"` inside a `role="tablist"` container; use `aria-selected`, `aria-controls`, `id`, and `role="tabpanel"` consistently.
- Implement click handling and keyboard navigation with Left/Right Arrow, Home, and End. Move focus to the active tab when switching by keyboard.
- On small screens, keep tab names readable with horizontal scrolling, controlled wrapping, or another responsive behavior that does not cut off page names.
- Use a single embedded `<script>` for all behavior, with no libraries or network access.
- When printing, force all page panels to be visible, including panels with `hidden`, and preserve their original order. The selected tab must not hide printed content.
- Do not duplicate indicators, text, or images to implement navigation.

Organize content by page. In each tab panel, include the original name once and the **Objetivo da página**, describing its purpose without analyzing current results. Do not repeat content between panels.

For each relevant visual, generate only:

1. **Indicator name**
2. **Original chart or card image** — only when a matching screenshot exists
3. **Objetivo** — one or two sentences on the business information represented and its purpose
4. **Como é calculado** — one or two sentences on the verified operation, criteria, and filters; add a third sentence only when necessary, or briefly state the limitation if the calculation is unavailable
5. **Como interpretar** — one or two sentences on understanding and using the result, without repeating its purpose or calculation
6. **Regras importantes** — optional, containing only essential rules or a specific uncertainty requiring validation, without duplicating the previous three sections

Do not create **Regras importantes** when it merely repeats `Objetivo`, `Como é calculado`, or `Como interpretar`. When calculation evidence is missing, state a short, specific limitation in `Como é calculado` itself, without long or generic warnings.

Layout requirements:

- position the tab bar at the top, with clear contrast between the normal, focused, and `aria-selected="true"` states;
- distinguish the active tab through color, border, background, or an equivalent combination rather than a subtle shade change alone;
- keep the composition compact, without summary panels, page counters, visual counts, or decorative cards;
- adapt each section to the image's proportions and actual text length, avoiding fixed heights and large empty areas;
- use 95% of the window width, capped at 1600px, aligning header, content, and footer with narrow side margins;
- use a single column of indicators in `visual-grid`, with 14px spacing; never place two indicators side by side;
- keep each card's name at the top, followed by `visual-content` with the image on the left at approximately 35% and the description on the right at approximately 65%; do not move the description below the image on desktop;
- retain two columns on tablets wider than 640px and stack the image above the description on screens up to 640px wide;
- preserve image proportions with `width: auto`, `height: auto`, `max-width: 100%`, `max-height: 220px`, and `object-fit: contain`; do not crop, set fixed heights, or force image enlargement for layout purposes;
- use `visual-content no-image` for full-width text when no screenshot is available, without an empty image column;
- group similar visuals under a shared title when that reduces repetition;
- do not include an entire page screenshot as an introduction when its cropped charts are already present;
- use `@media print` to preserve contrast, avoid splitting an indicator, and remove unnecessary effects;
- include a `@media print` rule equivalent to `[role="tabpanel"][hidden] { display: block !important; }` to print every page regardless of the active tab.

Embed every image used as a Base64 Data URL. It is permissible to embed an original screenshot once in an internal SVG element and display faithful crops using `viewBox` and internal references, provided the file remains self-contained and no chart is recreated.

## Validation before delivery

- Confirm that `documentacao.html` is the only new or updated execution artifact.
- Before writing the file, confirm that the candidate was produced only by the permitted demonstration-content substitutions.
- Compare the candidate's `<style>` block with the template's block and require exact character-for-character equality.
- Compare the candidate's `<script>` block with the template's block and require exact character-for-character equality.
- Confirm there is exactly one `<style>`, exactly one `<script>`, no `style` attributes, and no classes outside the template contract.
- Confirm the header, tab bar, main container, and their relative positions remain the same as in the template.
- Confirm that `<title>` and `<h1>` remain fixed, the subtitle identifies the report, and any logo is Base64 with no reserved empty space when absent.
- Confirm each `article.visual` contains exactly one `visual-head` followed by one `visual-content`, with `visual-image` before `visual-body` when an image exists. Without an image, require `visual-content no-image` containing only `visual-body`.
- Confirm every card uses the full width; at 1440px and 768px, the image and description must sit side by side, with image height capped at 220px. At 390px, the image must appear above the description with no horizontal document scrolling.
- Check that document width is `min(95% of the window, 1600px)`, card spacing is between 12px and 16px, and rendered image proportions match the originals.
- Also validate an indicator without an image, checking full-width text, and printing, checking that all hidden pages become visible. The helper script validates the structural contract; when a browser is available, also check rendered dimensions.
- If any template validation fails, discard the candidate and preserve the existing `documentacao.html`. Do not approximate the layout as a repair.
- When images exist, confirm each used image is valid embedded Base64 and no crop distorts its proportions.
- Find and remove `http://`, `https://`, `file://`, absolute paths, `<link>`, `@import`, and any `<script src="...">` references. Retain only the embedded script needed for tabs.
- Confirm the number of tabs equals the number of documented pages, names and order match the report, and the first tab is initially active.
- Test clicking and keyboard navigation, checking that only one screen panel is visible and `aria-selected`, `tabindex`, and `hidden` update correctly.
- Test a narrow viewport and confirm every page name remains accessible.
- Confirm through the print stylesheet or CSS inspection that all panels appear in `@media print`, even when hidden on screen.
- Confirm every documented visual is on the correct page and has a name, `Objetivo`, `Como é calculado`, and `Como interpretar` exactly once in that order, plus an image whenever a matching screenshot exists.
- Without a screenshot, confirm the indicator remains understandable, `visual-image` is omitted, and `image-placeholder` does not appear.
- Confirm every functional rule is traceable to PBIR and the model; where it is not, state the limitation without inventing missing logic.
- Confirm each `Objetivo` and `Como interpretar` contains one or two specific, distinct sentences. Require a short explanation in `Como é calculado`, including verified relevant filters and dependencies or an explicit limitation when unavailable.
- Separately review sums, averages, percentages, counts, and distinct counts in `Como é calculado`. Confirm none was inferred solely from the visual's name, percentages identify their comparison base, and no DAX formula or duplicate explanation is published.
- Confirm `Regras importantes` appears only when necessary and contains only essential conditions or specific uncertainties.
- Remove current values, result comparisons, performance analysis, obvious explanations, generic phrases, technical inventories, DAX, and prohibited sections.
- Separately review quantity versus percentage, raw totals versus distinct counts, actual values versus references, and references versus targets to prevent unsupported equivalences.
- Confirm PBIP, PBIR, TMDL, `model.bim`, and original image files remain unchanged.
- Open the HTML locally when the environment allows and check that text, images, responsiveness, and printing remain readable without network access.

## Scope limits

This Skill does not modify the report, semantic model, or screenshots; create DAX; publish to Fabric or Power BI Service; call APIs; require authentication; or generate PDFs. It produces only a self-contained HTML manual with local tab navigation. An unavailable local model limits verification of calculation rules and must be disclosed in the document.

## Permanent instruction

When `documentacao.html` already exists, ignore its HTML during assembly and rebuild exclusively from `assets/semanticdoc_template.html`, resolved relative to the directory containing this `SKILL.md`. The previous file must not be used as a visual, structural, or business-rule source.
