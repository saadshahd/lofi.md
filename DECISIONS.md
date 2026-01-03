# lofi.md Decisions

| Decision   | Choice                                          | Why                                          |
| ---------- | ----------------------------------------------- | -------------------------------------------- |
| Primitives | 3: `container`, `control`, `content`            | Minimal set; visual variants not categories  |
| Vocabulary | Domain keywords as sugar over primitives        | Friendly syntax, extensible internals        |
| Layout     | Single `grid` with props (no row/column)        | One element handles all layout via props     |
| Markdown   | Native `md` block (tables, lists, dividers)     | Don't reinvent what markdown does            |
| DSL > HTML | Escape hatch only                               | For elements not in vocabulary               |
| Output     | Text DSL → HTML only with shadcn sketch styling | LLMs generate text, humans consume visually  |
| Ecosystem  | Node/bun                                        | moo.md integration, designers don't use Java |
| Tailwind   | Closed vocabulary, no arbitrary classes         | bounded output for better generation         |
| Packages   | `@lofi/html` (1st renderer)                     | Single responsibility; enables `@lofi/figma` |
| Storybook  | `apps/storybook` aggregates from packages       | React wrapper for visual regression only     |
| md/html    | Post-lexer token collapsing in LofiLexer | Langium doesn't expose lexer modes; collapse tokens after lexing |
| Attributes | All require `=` (e.g. `primary=1`) | Eliminates ID/attr ambiguity without lookahead; ATTR_NAME terminal |

## Deferred Decisions

| Feature                               | Status   | Reconsider When        |
| ------------------------------------- | -------- | ---------------------- |
| `tw=` attribute for spacing utilities | DEFERRED | 10+ users request it   |
| Custom element definitions            | DEFERRED | Clear use case emerges |
| Theming beyond sketch style           | DEFERRED | Production use cases   |
