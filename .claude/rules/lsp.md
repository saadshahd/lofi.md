---
paths: packages/vscode/src/language-server/**/*.ts
---

# Langium LSP Patterns

## Langium Provides

- Autocomplete (CompletionProvider)
- Hover (HoverProvider)
- Go to Definition (DefinitionProvider)
- Find References (ReferencesProvider)
- Diagnostics (ValidationRegistry)
- Quick Fixes (CodeActionProvider)

## What NOT to Implement

- Custom parser logic — Langium parses via grammar
- Custom validation — Use `registerLofiValidation()`
- Custom error formatting — `ErrorMeta` already provides suggestions
- Custom completion items — Langium infers from grammar

## Quick Fix Pattern

Langium diagnostics include `data` field with error metadata.
Wire up `CodeActionProvider` to read existing `ErrorMeta`:

```typescript
// Error already has quick fix data
ErrorMeta[code].suggestion  // "Use exactly 2 spaces"
ErrorMeta[code].example     // 'card\n  heading "Title"'
```

## Server Startup

```typescript
// packages/vscode/src/language-server/main.ts
import { startLanguageServer } from 'langium/lsp';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { createLofiServices } from '@lofi/language';
import { NodeFileSystem } from 'langium/node';

const connection = createConnection(ProposedFeatures.all);
const { shared, Lofi } = createLofiServices(NodeFileSystem);
startLanguageServer({ shared, Lofi, connection });
```

## Debugging

Enable verbose logging:

```typescript
connection.console.log('Server started');
```

Check Output panel: "lofi Language Server"
