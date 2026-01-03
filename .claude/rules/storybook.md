---
paths: apps/storybook/**/*.{js,jsx}
---

# Storybook Patterns

## Purpose

Visual regression testing for generated HTML output. React is a test harness only.

## Location

Stories live in `apps/storybook/stories/`, NOT colocated with packages.

## Story Pattern

```jsx
// apps/storybook/stories/Button.stories.jsx
import { parse } from '@lofi/language';
import { generate } from '@lofi/html';

const meta = {
  title: 'Elements/Button',
  render: (args) => {
    const ast = parse(`button "${args.label}" ${args.variant}`);
    const html = generate(ast);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  },
};

export default meta;

export const Primary = { args: { label: 'Save', variant: 'primary' } };
export const Secondary = { args: { label: 'Cancel', variant: '' } };
export const Disabled = { args: { label: 'Submit', variant: 'disabled' } };
```

## Coverage

One story file per element type (31 total):
- Container: page, section, card, grid, modal, nav, tabs, menu, form, alert, breadcrumb
- Control: button, input, checkbox, radio, dropdown, textarea, link, tab, accordion, toggle, slider
- Content: heading, text, image, icon, badge, toast, avatar, progress, chart

## What to Test

1. **All variants** — primary, secondary, danger, disabled, etc.
2. **States** — hover, focus, error (via CSS classes)
3. **Nesting** — Elements inside containers
4. **Markdown blocks** — md content rendering

## NOT Tested Here

- Langium parser (unit tests in packages/language)
- CLI behavior (integration tests)
- VS Code extension (separate Storybook instance if needed)
