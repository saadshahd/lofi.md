# lofi.md Decisions

| Decision       | Choice                                                    | Why                                          |
| -------------- | --------------------------------------------------------- | -------------------------------------------- |
| Primitives     | 3: `container`, `control`, `content`                      | Minimal set; visual variants not categories  |
| Vocabulary     | Domain keywords as sugar over primitives                  | Friendly syntax, extensible internals        |
| Layout         | Single `grid` with props (no row/column)                  | One element handles all layout via props     |
| Markdown       | Native `md` block (tables, lists, dividers)               | Don't reinvent what markdown does            |
| HTML           | Escape hatch only                                         | For elements not in vocabulary               |
| Output         | Text DSL → HTML with shadcn sketch styling                | LLMs generate text, humans consume visually  |
| Ecosystem      | Node/bun                                                  | moo.md integration, designers don't use Java |
