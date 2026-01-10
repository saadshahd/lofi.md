# lofi.md

> LLM-first wireframe DSL. Think in wireframes, ship in HTML.

See @PHILOSOPHY.md for axioms. See @SYNTAX.md for element reference. See @ROADMAP.md for milestones.

## Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Runtime | bun | Fast, simple, matches moo.md ecosystem |
| Parser | Langium | LSP for free, IndentationAwareTokenBuilder |
| Build | tsup | ESM + CJS, simple config |
| Test | Vitest + `langium/test` + Storybook 10 | Colocated tests, visual regression |
| Lint | Biome | Fast, all-in-one |
| Markdown | remark | For `md` blocks |
| CSS | Tailwind v4 + CSS | Hybrid: utilities for simple, CSS classes for stateful |
| UI (VS Code) | React 19, shadcn@latest | Webview only, not DSL output |
| Icons | Phosphor | Clean, MIT |

## Commands

```bash
# Development
bun install              # Install dependencies
bun run dev              # Dev server with hot reload
bun run build            # Build all packages

# Testing
bun run test             # Run Vitest (ALWAYS use 'bun run test', not 'bun test')
bun run storybook        # Launch Storybook 10

# Linting
bun run lint             # Biome check
bun run lint:fix         # Biome fix

# CLI
lofi input.lofi          # Generate HTML
lofi --serve input.lofi  # Dev server
lofi --watch input.lofi  # Watch mode
```

## Architecture

```
lofi/
├── packages/
│   ├── language/        # Langium grammar + generator
│   │   ├── src/
│   │   │   ├── lofi.langium
│   │   │   └── generator/
│   │   └── package.json
│   ├── cli/             # CLI tool
│   └── vscode/          # VS Code extension (React webview)
├── test-cases/          # Golden test inputs (.lofi files)
└── examples/            # Canonical examples
```

## Key Constraints

1. **LLM-first** — Syntax optimized for machine generation
2. **One way** — Each concept has exactly one representation
3. **Closed vocabulary** — 31 elements, no arbitrary Tailwind classes
4. **HTML output** — No React runtime for preview
5. **2-space indentation** — Mandatory, no tabs
6. **CSS for states** — Use CSS classes (not Tailwind variants) for hover/active/focus

## Output Pipeline

```
lofi DSL → Langium → AST → HTML + Tailwind classes → lofi.css (optimized)
```
