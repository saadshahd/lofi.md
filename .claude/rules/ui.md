---
paths: packages/vscode/**/*.{ts,tsx,css}
---

# UI Development (VS Code Extension)

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | VS Code webview panels |
| shadcn | @latest | Component primitives |
| Tailwind | v4 | CSS-first config |
| Storybook | 10 | Visual regression testing |
| Phosphor | latest | Icons |

**Note:** React is for VS Code extension only, NOT for DSL output (pure HTML).

## shadcn Usage

Install components:
```bash
bunx shadcn@latest add button
bunx shadcn@latest add input
bunx shadcn@latest add card
```

**Never modify shadcn components directly.** Extend in separate files:

```
packages/vscode/src/components/
├── ui/                  # shadcn components (don't modify)
│   ├── button.tsx
│   └── input.tsx
└── custom/              # Your extensions
    └── lofi-button.tsx
```

## Tailwind v4 Config

CSS-first configuration:

```css
/* packages/vscode/src/styles/globals.css */
@import "tailwindcss";
@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-secondary: oklch(0.6 0.1 200);
  --radius: 0.5rem;
}
```

## Storybook 10

Purpose: Visual testing for generated HTML theme/elements.

```typescript
// Button.stories.tsx (colocated)
import type { Meta, StoryObj } from '@storybook/react';
import { generateHtml } from '@lofi/language';

const meta = {
  title: 'Elements/Button',
  render: (args) => {
    const html = generateHtml(`button "${args.label}" ${args.variant}`);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { label: 'Save', variant: 'primary' } };
export const Secondary: Story = { args: { label: 'Cancel', variant: '' } };
```

**Test the GENERATED HTML output**, not React components.

## React Usage Scope

React is ONLY for:
- VS Code webview panels
- Interactive extension UI
- Storybook test harness

React is NOT for:
- DSL output (pure HTML)
- CLI preview (HTML + Tailwind CDN)
- Production exports

## Color Tokens

Use shadcn's CSS variable pattern:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.1 0 0);
  --primary: oklch(0.7 0.15 250);
  --primary-foreground: oklch(1 0 0);
  /* ... sketch theme tokens */
}
```

## Phosphor Icons

```typescript
import { Check, X, ChevronDown } from '@phosphor-icons/react';

// In generated HTML, use icon sprites or inline SVG
```
