---
paths: packages/html/src/**/*.ts
---

# HTML Generator Patterns

## Output Architecture

```
lofi DSL → Langium Parser → AST → HTML Generator → HTML + CSS classes
                                                      ↓
                                              + lofi.css (theme + components)
```

## Styling Strategy

lofi uses a **hybrid approach**: Tailwind utilities for simple styling, CSS classes for complex stateful components.

### When to Use What

| Complexity | Approach | Example |
|------------|----------|---------|
| Simple (no states) | Tailwind utilities in CVA | `card`, `badge`, `text` |
| Complex (hover/active/focus) | CSS classes in `lofi.css` | `button`, interactive controls |
| Theme tokens | `@theme` in CSS | Colors, fonts, radii |
| Sketch effects | `@utility` or CSS classes | `wobble`, `shadow-hard` |

### Why CSS for Complex Components

Tailwind limitations for sketch aesthetic:
1. No `active:` pseudo-class by default
2. Complex shadows need CSS variables anyway
3. "Press effect" (transform + shadow) requires coordinated state changes
4. CSS is more readable for multi-property transitions

## Component Patterns

### Pattern A: Simple Element (Tailwind utilities)

For elements without complex interaction states:

```typescript
// styles.ts
export const card = cva(
  "rounded-lofi border-2 border-lofi-border bg-lofi-bg p-4 wobble shadow-hard"
);

export const badge = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-hand wobble",
  {
    variants: {
      type: {
        info: "bg-lofi-accent/15 text-lofi-accent",
        success: "bg-lofi-success/15 text-lofi-success",
        error: "bg-lofi-error/15 text-lofi-error",
      },
    },
    defaultVariants: { type: "info" },
  }
);
```

### Pattern B: Interactive Element (CSS classes)

For elements with hover, active, focus states:

```css
/* lofi.css */
.btn {
  /* Base styles - layout, typography, transitions */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lofi);
  border-width: 2px;
  padding: 0.5rem 1rem;
  font-family: var(--font-hand);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease;
  filter: url(#lofi-wobble);
}

.btn:focus-visible {
  outline: 2px solid var(--color-lofi-accent);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Intent modifiers with full state handling */
.btn-primary {
  background-color: var(--color-lofi);
  border-color: var(--color-lofi);
  color: var(--color-lofi-bg);
  box-shadow: 3px 3px 0 0 var(--color-lofi-border);
}

.btn-primary:hover {
  background-color: color-mix(in srgb, var(--color-lofi) 85%, white);
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 0 var(--color-lofi-border);
}

.btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 var(--color-lofi-border);
}
```

```typescript
// styles.ts - CVA just composes class names
export const button = cva("btn", {
  variants: {
    variant: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-danger",
    },
  },
  defaultVariants: { variant: "secondary" },
});
```

```typescript
// renderer - read variant attribute directly
export function renderButton(el: Element): string {
  const text = stripQuotes(el.content);
  const variant = getAttr(el.attrs, "variant") || "secondary";
  const cls = styles.button({ variant });
  const disabled = hasAttr(el.attrs, "disabled");

  return `<button class="${cls}"${disabled ? " disabled" : ""}>${escapeHtml(text)}</button>`;
}
```

## Theme Tokens

All design tokens live in `lofi.css` under `@theme`:

```css
@theme {
  /* Colors */
  --color-lofi: #2B2B2B;
  --color-lofi-bg: #FFFDF5;
  --color-lofi-border: #4A4A4A;
  --color-lofi-accent: #0984E3;
  --color-lofi-error: #C0392B;
  --color-lofi-success: #0A7A5C;
  --color-lofi-warning: #B45309;

  /* Typography */
  --font-sketch: 'Kalam', cursive;
  --font-hand: 'Kalam', cursive;

  /* Spacing */
  --radius-lofi: 6px;
}
```

These create Tailwind utilities: `bg-lofi`, `text-lofi-bg`, `border-lofi-border`, `font-hand`, `rounded-lofi`.

## File Organization

```
packages/html/src/
├── lofi.css           # Theme tokens, utilities, component classes
├── styles.ts          # CVA definitions (compose classes)
├── index.ts           # Generator entry, SVG filters
└── renderers/
    ├── containers.ts  # page, card, modal, etc.
    ├── controls.ts    # button, input, checkbox, etc.
    └── content.ts     # heading, text, badge, etc.
```

## Constraints

1. **Closed vocabulary** — No arbitrary Tailwind classes in output
2. **CSS for states** — Use CSS classes for hover/active/focus, not Tailwind variants
3. **Theme tokens** — All colors/fonts/radii from `@theme`, never hardcoded
4. **Single variant** — Use enum attribute (`variant="primary"`) not boolean flags
5. **Transitions in CSS** — Complex transitions belong in CSS, not utility classes
