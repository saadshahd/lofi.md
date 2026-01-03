# Testing Philosophy

## Core Principles (Hickey/Fowler Panel)

1. **Test seams, not internals** — Validate AST output from input strings, not intermediate parsing steps
2. **Golden tests ARE the spec** — `test-cases/*.lofi` files define expected behavior
3. **Indentation is THE feature** — Test edge cases heavily (0/1/2/3/4/tab/mixed spaces)
4. **Error messages are UX** — Test that invalid input produces helpful diagnostics with line numbers

## Test Infrastructure

| Tool | Purpose |
|------|---------|
| `langium/test` | Grammar/parser tests via `parseDocument` |
| Vitest | Generic runner, browser tests, integration |
| Storybook 10 | Visual regression for generated HTML theme |

## Colocation Pattern

Tests live next to source files:

```
packages/language/src/
├── lofi.langium
├── lofi.langium.test.ts     # Grammar tests
├── generator/
│   ├── html.ts
│   └── html.test.ts         # Generator tests
```

## Test Categories

### 1. Golden/Snapshot Tests

Parse each `test-cases/*.lofi`, compare AST snapshot:

```typescript
import { parseDocument } from 'langium/test';
import { readdirSync, readFileSync } from 'fs';

describe('golden tests', () => {
  const testFiles = readdirSync('test-cases').filter(f => f.endsWith('.lofi'));

  testFiles.forEach(file => {
    it(`parses ${file}`, async () => {
      const content = readFileSync(`test-cases/${file}`, 'utf-8');
      const doc = await parseDocument(content);
      expect(doc.parseResult.parserErrors).toHaveLength(0);
      expect(doc.parseResult.value).toMatchSnapshot();
    });
  });
});
```

### 2. Indentation Edge Cases

```typescript
describe('indentation', () => {
  it('rejects 0-space indent', async () => { /* ... */ });
  it('rejects 1-space indent', async () => { /* ... */ });
  it('accepts 2-space indent', async () => { /* ... */ });
  it('rejects 3-space indent', async () => { /* ... */ });
  it('rejects 4-space indent', async () => { /* ... */ });
  it('rejects tab indent', async () => { /* ... */ });
  it('rejects mixed spaces/tabs', async () => { /* ... */ });
});
```

### 3. Error Message Tests

```typescript
describe('error messages', () => {
  it('reports line number for invalid element', async () => {
    const doc = await parseDocument(`button "Save"\n  unknownelement`);
    const error = doc.parseResult.parserErrors[0];
    expect(error.message).toContain('LOFI_SYNTAX');
    expect(error.range.start.line).toBe(1);
  });
});
```

### 4. Visual Regression (Storybook)

Test generated HTML output, not React components:

```typescript
// In Storybook
export const Button = () => {
  const html = generateHtml(`button "Save" primary`);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
```

## What NOT to Test

- Langium internals (trust the framework)
- Individual grammar rules in isolation (test at document level)
- Performance benchmarks (premature optimization)
- Fuzzing for 30-keyword DSL (deterministic tests cover 100%)
