# lofi.md Roadmap

> LLM-first wireframe DSL. Part of the moo.md ecosystem.

## Phase 1: Ruthless MVP

### Identity

| Aspect        | Value   |
| ------------- | ------- |
| **Package**   | `lofi`  |
| **Extension** | `.lofi` |
| **CLI**       | `lofi`  |
| **Brand**     | lofi.md |

---

### Tech Stack (Decided)

| Component           | Choice  | Rationale                                                |
| ------------------- | ------- | -------------------------------------------------------- |
| **Parser**          | Langium | LSP for free, IndentationAwareTokenBuilder, future-proof |
| **Package manager** | bun     | Fast, simple, matches moo.md ecosystem                   |
| **Bundler**         | tsup    | Simple, fast, ESM + CJS                                  |
| **Test runner**     | Vitest  | Fast, ESM-native, good DX                                |
| **Linting**         | Biome   | Fast, all-in-one (format + lint)                         |
| **Markdown parser** | remark  | For `md` blocks, battle-tested                           |

---

### Monorepo Structure

```
lofi/
├── .claude/
│   ├── CLAUDE.md              # Project instructions for Claude
│   └── rules/
│       ├── langium.md         # Langium grammar patterns
│       ├── testing.md         # Testing philosophy + colocation
│       ├── lofi-syntax.md     # DSL domain knowledge
│       ├── output.md          # @lofi/html renderer patterns
│       ├── storybook.md       # Visual regression patterns
│       ├── ci.md              # GitHub Actions patterns
│       └── errors.md          # Error taxonomy (LOFI_*)
├── packages/
│   ├── language/              # Parser: Langium grammar → AST
│   │   ├── src/
│   │   │   ├── lofi.langium   # Grammar definition
│   │   │   └── index.ts       # parse() + AST types
│   │   └── package.json
│   ├── html/                  # Renderer: AST → HTML + Tailwind
│   │   ├── src/
│   │   │   ├── index.ts       # generate()
│   │   │   └── classes.ts     # CVA class mappings
│   │   └── package.json
│   ├── cli/                   # CLI tool
│   │   ├── src/
│   │   │   ├── index.ts       # CLI entry
│   │   │   └── server.ts      # Dev server with hot reload
│   │   └── package.json
│   └── vscode/                # VS Code extension (Milestone 6)
│       └── package.json
├── apps/
│   └── storybook/             # Visual regression testing
│       ├── .storybook/
│       └── stories/
├── test-cases/                # Validation test cases (.lofi files)
├── examples/                  # Canonical examples
├── PHILOSOPHY.md
├── SYNTAX.md
├── ROADMAP.md
├── biome.json
├── package.json               # Workspace root
└── tsconfig.json
```

---

### Milestones

#### Milestone 1: Syntax Validation ✅

- [x] Write formal syntax spec
- [x] Create 10 test case files
- [x] Run LLM validation tests
- [x] **Result: 100% parse success (10/10)**

#### Milestone 2: Repo Scaffolding ✅

**Monorepo & Packages**

- [x] Initialize bun workspace monorepo
- [x] Create packages/language structure (parser only)
- [x] Create packages/html structure (renderer)
- [x] Create packages/cli structure
- [x] Create apps/storybook structure

**Config & Tooling**

- [x] Configure TypeScript (tsconfig.json)
- [x] Configure Biome (biome.json)
- [x] Set up Vitest (base config)
- [x] Set up Tailwind v4 (npm package)
- [x] Set up Storybook 10 (visual regression)

**Claude Rules** ✅

- [x] Create `.claude/CLAUDE.md` with project rules
- [x] Create `.claude/rules/langium.md`
- [x] Create `.claude/rules/testing.md`
- [x] Create `.claude/rules/lofi-syntax.md`
- [x] Create `.claude/rules/output.md`
- [x] Create `.claude/rules/storybook.md`
- [x] Create `.claude/rules/ci.md`
- [x] Create `.claude/rules/errors.md`

#### Milestone 3: Langium Grammar ✅

**Core Grammar**

- [x] Define `lofi.langium` grammar with all 31 keywords
- [x] Implement IndentationAwareTokenBuilder + IndentationAwareLexer
- [x] Define AST node types (Document, Element, Attribute, MdBlock, HtmlBlock)
- [x] Handle `md` blocks (inline `md: content` and block with INDENT/DEDENT)
- [x] Handle `html` blocks (passthrough with INDENT/DEDENT)
- [x] RAW_LINE terminal with negative lookahead for element-like patterns
- [x] 44 unit tests passing (basic parsing, nesting, comments, all keywords, md/html blocks)
- [x] Configure langium-config.json with syntax highlighting generators (TextMate, Monarch, Prism, EBNF)

**Remaining Work**

- [ ] Error recovery and sync points (Langium validation rules)
- [ ] Golden tests with `test-cases/*.lofi` files
- [ ] Error messages with LOFI_* codes (see `.claude/rules/errors.md`)

#### Milestone 4: HTML Renderer (@lofi/html)

- [ ] Implement `generate()` in packages/html
- [ ] Define element → Tailwind class mapping (closed vocabulary)
- [ ] Use CVA for variant handling (runtime, no build step)
- [ ] Implement sketch theme CSS variables
- [ ] Handle all 31 element types
- [ ] Unit tests for renderer
- [ ] Visual regression tests in Storybook

#### Milestone 5: CLI + Server

- [ ] `lofi <input.lofi>` → HTML output
- [ ] `lofi --watch` → file watcher
- [ ] `lofi --serve` → dev server with hot reload
- [ ] Create bin/lofi entry point
- [ ] Publish to npm

#### Milestone 6: LSP + Tooling

- [ ] VS Code extension (packages/vscode)
- [ ] React 19 webview for preview panel
- [ ] shadcn@latest components for extension UI
- [ ] Syntax highlighting (enhance auto-generated TextMate with all 31 keywords, or implement semantic highlighting via AbstractSemanticTokenProvider)
- [ ] Autocomplete for element keywords
- [ ] Hover docs for attributes
- [ ] Diagnostics (errors shown in editor)

> **Note:** Langium's auto-generated TextMate/Prism grammars only include literal keywords (`md`, `html`), not terminal patterns. The Monarch grammar works correctly. For full keyword highlighting, either manually enhance TextMate grammar or implement semantic highlighting.

#### Milestone 7: Documentation

- [x] PHILOSOPHY.md
- [ ] SYNTAX.md (complete reference)
- [ ] README.md (quick start)
- [ ] 5 canonical examples

#### Milestone 8: Upstream Reference

- [ ] Document original wiremd nesting issue
- [ ] Note: lofi syntax solves this with indentation

---

## Key Decisions

See [DECISIONS.md](DECISIONS.md) for full decision log including deferred decisions.

---

## Langium Grammar (Implemented)

See `packages/language/src/lofi.langium` for the full grammar. Key structure:

```langium
grammar Lofi

entry Document:
    elements+=TopLevelElement*;

Element:
    keyword=KEYWORD content=STRING? attrs+=Attribute*
    (INDENT children+=ChildElement* DEDENT)?;

MdBlock:
    'md' (
        ':' content=RAW_LINE |
        INDENT lines+=RAW_LINE* DEDENT
    );

HtmlBlock:
    'html' INDENT lines+=RAW_LINE* DEDENT;

Attribute:
    name=ID '=' value=(STRING | NUMBER | ID) |
    name=ID;

// 31 element keywords (containers, controls, content)
terminal KEYWORD: /page|section|card|.../;

// RAW_LINE captures md/html block content via negative lookahead
// SYNC: Keywords duplicated in KEYWORD and RAW_LINE patterns
terminal RAW_LINE: /(?!keywords...)(?!md|html...)...+/;
```

---

## Sources

- [Langium Indentation Guide](https://langium.org/docs/recipes/lexing/indentation-sensitive-languages/)
- [Anka DSL Research](https://arxiv.org/html/2512.23214) — LLM-optimized DSL principles
- [PlantUML Salt](https://plantuml.com/salt) — Prior art
