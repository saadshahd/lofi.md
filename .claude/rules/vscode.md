---
paths: packages/vscode/**/*.ts
---

# VS Code Extension Patterns

## Architecture

Thin client over Langium LSP. Extension does NOT reimplement parsing/validation.

```
TextMate grammar → immediate syntax highlighting (no LSP needed)
Langium LSP → autocomplete, hover, diagnostics, quick fixes
@lofi/html generate() → webview preview
```

## Key Principles

1. **Don't fight the platform** — Use VS Code's APIs idiomatically
2. **Langium does the work** — Wire up existing services, don't reimplement
3. **Webview is dumb** — Receives HTML, renders it. No React complexity.
4. **Bundle for offline** — Inline CSS, don't fetch from CDN

## Language Server

```typescript
// Thin wrapper — Langium handles everything
import { startLanguageServer } from 'langium/lsp';
import { createLofiServices } from '@lofi/language';
import { NodeFileSystem } from 'langium/node';

const services = createLofiServices(NodeFileSystem).Lofi;
startLanguageServer(services);
```

## Language Client

Standard `vscode-languageclient` pattern:
- Spawn server as child process
- Document selector: `{ language: 'lofi' }`
- Sync incremental changes

## Webview Preview

```typescript
class LofiPreviewPanel {
  update(document: vscode.TextDocument) {
    const html = generate(parse(document.getText()));
    this.panel.webview.html = this.wrapHtml(html);
  }
}
```

- Listen to `onDidChangeTextDocument`
- Debounce 100ms
- Inline lofi.css as `<style>` block

## TextMate Grammar

- All 31 keywords in `keyword.control.lofi`
- Attributes as `entity.other.attribute-name.lofi`
- Strings as `string.quoted.double.lofi`
- Comments as `comment.line.lofi`

**Sync requirement:** Keywords must match `VALID_KEYWORDS` in `@lofi/language`.

## Testing

1. **Extension Development Host** — F5 to launch test instance
2. **Scope Inspector** — Ctrl+Shift+P → "Developer: Inspect Editor Tokens"
3. **LSP logs** — Output panel → "lofi Language Server"

## Constraints

1. **No React in webview** — Plain HTML sufficient for preview
2. **No custom LSP logic** — Langium provides everything
3. **No external resources in webview** — Bundle everything inline
4. **No duplicate keyword lists** — Import from `@lofi/language`
