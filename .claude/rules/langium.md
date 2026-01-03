---
paths: packages/language/**/*.ts
---

# Langium Grammar Patterns

## Indentation-Sensitive Parsing

lofi uses 2-space indentation for nesting. Langium handles this via:

```typescript
// In module registration
import { IndentationAwareTokenBuilder, IndentationAwareLexer } from 'langium';

// Register custom lexer
services.parser.TokenBuilder = () => new IndentationAwareTokenBuilder();
services.parser.Lexer = (services) => new IndentationAwareLexer(services);
```

## Synthetic Terminals

```langium
// INDENT and DEDENT are injected by IndentationAwareTokenBuilder
terminal INDENT: 'synthetic:indent';
terminal DEDENT: 'synthetic:dedent';

// CRITICAL: Separate WS from NL - cannot combine
hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;
```

## Grammar Rule Naming

| Pattern | Example | Use |
|---------|---------|-----|
| PascalCase | `Element`, `Attribute` | AST node types |
| camelCase | `keyword`, `attrs` | Properties |
| UPPER_SNAKE | `INDENT`, `KEYWORD` | Terminals |

## AST Node Types

Every keyword maps to one of 3 primitives:

```typescript
type LofiPrimitive = 'container' | 'control' | 'content';

// In AST
interface Element {
  $type: 'Element';
  keyword: string;           // 'button', 'card', etc.
  primitive: LofiPrimitive;  // Computed from keyword
  attrs: Attribute[];
  children: (Element | MdBlock | HtmlBlock)[];
}
```

## Keyword Sync Requirement

Keywords are defined in two places that must stay synchronized:

| Location | Purpose |
|----------|---------|
| `lofi.langium` KEYWORD terminal | Lexer matching |
| `validation/errors.ts` VALID_KEYWORDS | Runtime validation |

When adding/removing keywords, update both files. The grammar comment `SYNC: If adding keywords...` marks this.

## Error Recovery

Langium provides automatic error recovery via:

- `LofiTokenBuilder` — Wraps indentation errors with LOFI_INDENT_* codes
- `LofiDocumentValidator` — Enhances parser errors with LOFI_SYNTAX_* codes
- `LofiValidator` — AST-level semantic validation

Error codes follow the taxonomy in `.claude/rules/errors.md`.

## Testing with langium/test

```typescript
import { parseDocument } from 'langium/test';
import { describe, it, expect } from 'vitest';

describe('lofi grammar', () => {
  it('parses button element', async () => {
    const doc = await parseDocument(`button "Save" primary`);
    expect(doc.parseResult.parserErrors).toHaveLength(0);
    expect(doc.parseResult.value.elements[0].keyword).toBe('button');
  });
});
```

Reference: https://dev.to/diverse_research/testing-your-dsls-in-langium-gp9
