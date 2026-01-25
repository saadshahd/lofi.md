# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-01-11

### Added

- **Language**: Langium-based parser for lofi DSL with 31 element keywords
  - 2-space indentation enforcement
  - `md` blocks for native markdown (tables, lists)
  - `html` blocks for escape hatch
  - Full error recovery with LOFI_* error codes

- **HTML Renderer** (`@lofi.md/html`): Sketch-style output
  - Hand-drawn aesthetic with SVG wobble filter
  - Tailwind v4 theme integration
  - CVA for variant handling
  - 28 renderer tests

- **CLI** (`@lofi.md/cli`): Command-line interface
  - `lofi <file.lofi>` — Output HTML to stdout
  - `lofi <file.lofi> -o out.html` — Output to file
  - `lofi <file.lofi> --serve` — Dev server with hot reload
  - `lofi <file.lofi> --watch` — Watch mode

- **VS Code Extension** (`lofi-wireframes`): Full IDE support
  - Syntax highlighting
  - Live preview panel
  - Autocomplete, hover docs, diagnostics
  - Quick fixes for common errors

- **Storybook**: Visual component library
  - Stories for all 31 elements
  - Composition examples (Dashboard, Auth, Ecommerce)

### Technical

- Monorepo with bun workspaces + turbo
- 99 tests passing
- CI/CD with GitHub Actions (test, lint, build, visual regression)

[0.0.1]: https://github.com/lofi-md/wiremd/releases/tag/v0.0.1
