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

#### Milestone 4B: Visual Direction & Theme

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

**Storybook Integration**
- [x] Import lofi.css in Storybook preview
- [x] Inject SVG filter definition via generate()
- [x] Configure Vite aliases for hot reload without rebuild
- [ ] Add story for each of 31 elements
- [ ] Add variant combination stories
- [ ] Structural tests (not pixel-perfect regression)

**Visual Polish** ✅
- [x] Fix contrast issues in theme colors (border: #636E72, placeholder: #7F8C8D for WCAG AA)
- [x] Improve wobble effect (baseFrequency=0.02, scale=2; subtle filter for icons)
- [x] Icons get subtle wobble (wobble-subtle utility)

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
- [x] SYNTAX.md (complete reference)
- [ ] README.md (quick start)
- [x] 5 canonical examples

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
