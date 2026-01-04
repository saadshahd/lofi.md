# lofi.md Decisions

| Decision     | Choice                                              | Why                                              |
| ------------ | --------------------------------------------------- | ------------------------------------------------ |
| Primitives   | 3: `container`, `control`, `content`                | Minimal set; visual variants not categories      |
| Vocabulary   | Domain keywords as sugar over primitives            | Friendly syntax, extensible internals            |
| Layout       | Single `grid` with props (no row/column)            | One element handles all layout via props         |
| Markdown     | Native `md` block (tables, lists, dividers)         | Don't reinvent what markdown does                |
| DSL > HTML   | Escape hatch only                                   | For elements not in vocabulary                   |
| Output       | Text DSL → HTML only with shadcn sketch styling     | LLMs generate text, humans consume visually      |
| Ecosystem    | Node/bun                                            | moo.md integration, designers don't use Java     |
| Tailwind     | Closed vocabulary, no arbitrary classes             | bounded output for better generation             |
| Packages     | `@lofi/html` (1st renderer)                         | Single responsibility; enables `@lofi/figma`     |
| Storybook    | `apps/storybook` aggregates from packages           | React wrapper for visual regression only         |
| md/html      | Post-lexer token collapsing                         | Langium doesn't expose lexer modes; collapse     |
| Attributes   | All require `=` (e.g. `primary=1`)                  | Eliminates ID/attr ambiguity without lookahead;  |
| Sketch       | Hand-drawn with SVG wobble filter                   | Prevents stakeholder fixation on details;        |
| Typography   | Architects Daughter (headings), Patrick Hand (body) | Sketch feel while remaining legible              |
| Font loading | Google Fonts with subset                            | Balance between character and performance        |
| Wobble       | feTurbulence + feDisplacementMap SVG filter         | Pure CSS/SVG, no JS runtime, works everywhere    |
| Icons        | Clean (no wobble)                                   | Panel consensus: clean icons, sketchy containers |
| Dark mode    | prefers-color-scheme only                           | No toggle complexity for MVP                     |

## Deferred Decisions

| Feature                               | Status   | Reconsider When        |
| ------------------------------------- | -------- | ---------------------- |
| `tw=` attribute for spacing utilities | DEFERRED | 10+ users request it   |
| Custom element definitions            | DEFERRED | Clear use case emerges |
| Theming beyond sketch style           | DEFERRED | Production use cases   |
