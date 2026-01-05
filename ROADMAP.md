# lofi.md Roadmap

> LLM-first wireframe DSL. Part of the moo.md ecosystem.

## Phase 1: Ruthless MVP

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

**Error Recovery & Validation** ✅

- [x] Error codes infrastructure (LOFI*INDENT*_, LOFI*SYNTAX*_)
- [x] LofiTokenBuilder for indentation error wrapping
- [x] LofiDocumentValidator for parser error enhancement
- [x] LofiError interface with suggestion/example fields
- [x] VALID_KEYWORDS constant (SYNC: must match KEYWORD terminal)
- [x] Error path test coverage

**Remaining Work**

- [x] Golden tests with `test-cases/*.lofi` files
- [x] Fix: Attribute parsing — all attrs now require `=` (e.g. `primary=1`), ATTR_NAME terminal for disambiguation
- [x] Fix: Numbered lists in md blocks — LofiLexer post-lexer collapsing converts tokens to RAW_LINE
- [x] Fix: Tab indentation not rejected — parse() now surfaces lexerErrors
- [x] Update golden test snapshots

#### Milestone 4: HTML Renderer (@lofi/html) ✅

- [x] Implement `generate()` in packages/html
- [x] Define element → Tailwind class mapping (closed vocabulary)
- [x] Use CVA for variant handling (runtime, no build step)
- [x] Handle all 31 element types
- [x] Unit tests for renderer (28 tests passing)
- [x] Visual regression tests in Storybook (8 story files)

#### Milestone 4B: Visual Direction & Theme ✅

**Research Phase**
- [x] Panel review: visual direction for wireframe aesthetic
- [x] Decision: hand-drawn/sketchy aesthetic
- [x] Panel review: Tailwind v4 idiomatic implementation
- [x] Document design tokens

**Theme Implementation**
- [x] Create `packages/html/src/lofi.css` with Tailwind v4 @theme
- [x] Add Google Fonts (subset: Architects Daughter, Patrick Hand)
- [x] Implement SVG feTurbulence filter for wobble effect
- [x] Create `@utility wobble` for sketch containers
- [x] Update `styles.ts` to use theme tokens
- [ ] Implement light/dark mode via prefers-color-scheme (deferred)

**Storybook Integration** ✅
- [x] Import lofi.css in Storybook preview
- [x] Inject SVG filter definition via generate()
- [x] Configure Vite aliases for hot reload without rebuild
- [x] Add story for each of 31 elements (one file per element)
- [x] Add variant combination stories (compositions: Dashboard, Auth, Ecommerce)
- [ ] Structural tests (not pixel-perfect regression) — deferred per panel: use visual regression (Chromatic) instead

**Visual Polish** ✅
- [x] Fix contrast issues in theme colors (border: #636E72, placeholder: #7F8C8D for WCAG AA)
- [x] Improve wobble effect (baseFrequency=0.02, scale=2; subtle filter for icons)
- [x] Icons get subtle wobble (wobble-subtle utility)

#### Milestone 5: CLI + Server ✅

- [x] `lofi <input.lofi>` → HTML output (stdout or `-o file.html`)
- [x] `lofi --watch` → file watcher with auto-regeneration
- [x] `lofi --serve` → dev server with WebSocket hot reload
- [x] Create bin/lofi entry point (bun-native, no bundling needed)
- [ ] Publish to npm (deferred until v1.0)

#### Milestone 7: Documentation ✅

- [x] PHILOSOPHY.md
- [x] SYNTAX.md (complete reference)
- [x] README.md (quick start)
- [x] 5 canonical examples

---

## Phase 1 Complete ✅

Milestones 1-5 + 7 deliver a working MVP:
- Parse lofi DSL with full error handling
- Generate sketch-style HTML with all 31 elements
- CLI with --serve (hot reload) and --watch modes
- Visual component library in Storybook
- Complete documentation

---

## Phase 2: Developer Experience ✅

#### Milestone 6: LSP + Tooling ✅

- [x] VS Code extension (packages/vscode)
- [x] Preview panel with live updates (plain HTML + inline CSS — React rejected per panel review: no interactive state needed)
- [x] Syntax highlighting (enhanced TextMate grammar with all 31 keywords)
- [x] Autocomplete for element keywords (via Langium LSP)
- [x] Hover docs for attributes (via Langium LSP)
- [x] Diagnostics with LOFI_* error codes (via Langium LSP)
- [x] Quick fixes for common errors (CodeActionProvider)
- [x] @vscode/test-electron integration tests (4 tests passing)
- [x] Claude rules: `.claude/rules/vscode.md`, `.claude/rules/lsp.md`

> **Architecture Decision:** Preview panel uses plain HTML with inline CSS instead of React. The webview receives generated HTML and renders it — no interactive state management needed. This reduces bundle size and complexity. React/shadcn reserved for future interactive UI (settings, sidebars) if needed.

---

## Key Decisions

See [DECISIONS.md](DECISIONS.md) for full decision log including deferred decisions.

---

## Langium Grammar (Implemented)

See `packages/language/src/lofi.langium` for the full grammar. Key structure:

---

## Sources

- [Langium Indentation Guide](https://langium.org/docs/recipes/lexing/indentation-sensitive-languages/)
- [Anka DSL Research](https://arxiv.org/html/2512.23214) — LLM-optimized DSL principles
- [PlantUML Salt](https://plantuml.com/salt) — Prior art
