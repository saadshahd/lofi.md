# Error Taxonomy

## Error Code Format

```
LOFI_[CATEGORY]_[NUMBER]
```

Categories:
- `SYNTAX` — General syntax errors
- `INDENT` — Indentation errors
- `ATTR` — Invalid attribute usage
- `BLOCK` — md/html block errors

## Error Interface

```typescript
interface LofiError {
  code: string;           // LOFI_INDENT_001
  message: string;        // User-friendly text
  line: number;
  column: number;
  suggestion?: string;    // "Did you mean 2 spaces?"
  example?: string;       // Correct syntax example
}
```

## Required for Every Langium Validation Rule

1. **Machine-readable code** — UPPER_SNAKE_CASE
2. **User message with context** — Include what was found vs. expected
3. **Suggested fix** — For LSP quick-fix support
4. **Example of correct syntax** — Show the right way

## Error Catalog

### Indentation Errors

| Code | Message | Suggestion |
|------|---------|------------|
| `LOFI_INDENT_001` | Expected 2-space indentation, found {n} spaces | Use exactly 2 spaces for each nesting level |
| `LOFI_INDENT_002` | Tab characters not allowed | Replace tabs with 2 spaces |
| `LOFI_INDENT_003` | Mixed spaces and tabs | Use only 2-space indentation |
| `LOFI_INDENT_004` | Unexpected indentation level | Check parent element nesting |

### Syntax Errors

| Code | Message | Suggestion |
|------|---------|------------|
| `LOFI_SYNTAX_001` | Unknown element '{keyword}' | See @SYNTAX.md for valid elements |
| `LOFI_SYNTAX_002` | Missing content for '{element}' | Add quoted string: `button "Label"` |
| `LOFI_SYNTAX_003` | Invalid attribute '{attr}' for '{element}' | Check valid attributes in @SYNTAX.md |

### Attribute Errors

| Code | Message | Suggestion |
|------|---------|------------|
| `LOFI_ATTR_001` | Missing value for attribute '{attr}' | Use `attr=value` or remove attribute |
| `LOFI_ATTR_002` | Invalid value '{value}' for '{attr}' | Expected one of: {valid_values} |
| `LOFI_ATTR_003` | Duplicate attribute '{attr}' | Remove duplicate |

### Block Errors

| Code | Message | Suggestion |
|------|---------|------------|
| `LOFI_BLOCK_001` | Empty md block | Add markdown content |
| `LOFI_BLOCK_002` | Invalid markdown syntax | Check markdown formatting |
| `LOFI_BLOCK_003` | Unclosed html block | Add closing content or remove block |

## Implementation Pattern

```typescript
// packages/language/src/validation/validator.ts
import { ValidationAcceptor } from 'langium';

export function validateIndentation(
  element: Element,
  accept: ValidationAcceptor
): void {
  const indent = getIndentation(element);
  if (indent % 2 !== 0) {
    accept('error', {
      code: 'LOFI_INDENT_001',
      message: `Expected 2-space indentation, found ${indent} spaces`,
      node: element,
      data: {
        suggestion: 'Use exactly 2 spaces for each nesting level',
        example: 'card\n  heading "Title"',
      },
    });
  }
}
```

## LSP Quick-Fix Integration

```typescript
// In language server
export function provideCodeActions(
  diagnostic: Diagnostic
): CodeAction[] {
  if (diagnostic.code === 'LOFI_INDENT_001') {
    return [{
      title: 'Fix indentation to 2 spaces',
      kind: CodeActionKind.QuickFix,
      edit: fixIndentation(diagnostic),
    }];
  }
  return [];
}
```
