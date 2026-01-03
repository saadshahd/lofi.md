---
paths: packages/language/src/generator/**/*.ts
---

# HTML Generator Patterns

## Output Architecture

```
lofi DSL → Langium Parser → AST → HTML Generator → HTML + Tailwind classes
                                                      ↓
                                              + lofi.css (optimized)
```

## HTML Generation

- **Output:** Semantic HTML with Tailwind classes
- **No React runtime** — Pure HTML for preview
- **Use CVA directly** — Runtime library, no build step required

```typescript
// CVA is a runtime library - use it directly
import { cva } from 'class-variance-authority';

const button = cva('rounded-md border px-4 py-2 font-medium shadow-sm', {
  variants: {
    intent: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
  },
  defaultVariants: { intent: 'secondary' },
});

// In generator: button({ intent: 'primary' }) → class string
```

## Tailwind CSS Bundling

Tailwind v4 standalone CLI (no Node.js required):

```bash
./tailwindcss -i input.css -o lofi.css
```

```css
/* input.css */
@import "tailwindcss";
@source "./generated/**/*.html";
```

## CSS Strategy by Context

| Context | Strategy |
|---------|----------|
| Dev/CLI `--serve` | Tailwind CDN (instant, 300KB OK for local) |
| VS Code extension | Pre-built `lofi.css` bundled |
| Storybook | Pre-built CSS |
| Production export | Tailwind CLI scans output → minimal CSS |

## Element → Tailwind Mapping

Document ALL classes used by each element. This enables:
1. Optimized CSS bundle (only classes we use)
2. Predictable output for testing
3. Easy theme customization

```typescript
// packages/language/src/generator/classes.ts
export const elementClasses = {
  button: {
    base: 'rounded-md border px-4 py-2 font-medium shadow-sm transition-colors',
    variants: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  },
  input: {
    base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
    states: {
      focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      disabled: 'disabled:cursor-not-allowed disabled:opacity-50',
      error: 'border-destructive focus-visible:ring-destructive',
    },
  },
  // ... all 31 elements
};
```

## Constraints

1. All Tailwind classes must come from closed vocabulary
2. No arbitrary `class=` attribute on elements
3. `html` block is the ONLY escape hatch for custom HTML/Tailwind
4. Sketch aesthetic uses shadcn color tokens (CSS variables)
