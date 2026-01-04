# lofi DSL Syntax

See @SYNTAX.md for complete element reference.

## Primitives

All 31 keywords map to 3 internal primitives:

| Primitive | Elements |
|-----------|----------|
| `container` | page, section, card, grid, modal, nav, tabs, menu, form, alert, breadcrumb |
| `control` | button, input, checkbox, radio, dropdown, textarea, link, tab, accordion, toggle, slider |
| `content` | heading, text, image, icon, badge, toast, avatar, progress, chart |

## Syntax Rules

1. **2-space indentation** — Mandatory. Tabs and other spacing will fail parsing.
2. **One element per line** — Each element on its own line.
3. **Attributes follow element** — `element "content" attr=value`
4. **Quotes for content** — String content in double quotes.
5. **No quotes for keywords** — Boolean attributes have no value.

## Attribute Conventions

### Mutually Exclusive Variants

When an element has multiple visual variants (e.g., button styles), use **mutually exclusive boolean attributes**:

```lofi
button "Save" primary=1      # Filled dark
button "Cancel"              # Secondary (default)
button "Delete" danger=1     # Filled error
```

In the DSL, these are boolean flags. In the renderer, they map to a single `intent` enum:

```typescript
// Renderer selects ONE intent
let intent: "primary" | "secondary" | "danger" = "secondary";
if (hasAttr(el.attrs, "primary")) intent = "primary";
else if (hasAttr(el.attrs, "danger")) intent = "danger";
```

### State Attributes

Attributes that modify state (not style):

```lofi
button "Submit" disabled=1   # Non-interactive
checkbox "Agree" checked=1   # Pre-selected
input "Name" error=1         # Validation failed
```

### Value Attributes

Attributes with specific values:

```lofi
alert "Error" type="error"   # info | success | warning | error
heading "Title" level="2"    # 1-6
grid cols="3" gap="4"        # Numeric values
```

## Blocks

### md (Markdown)

Native markdown for tables, lists, dividers:

```lofi
card
  md
    | Name | Role |
    |------|------|
    | Alice | Admin |
```

Inline: `md: Welcome, **user**!`

### html (Escape Hatch)

For elements outside vocabulary:

```lofi
card
  html
    <video src="demo.mp4" controls></video>
```

## Design Philosophy (Panel Consensus)

1. **Closed vocabulary by design** — Wireframes should be fast, not polished
2. **No raw Tailwind classes** — The sketch aesthetic IS the constraint
3. **LLM-first means bounded output** — Constraints improve generation quality
4. **`html` block is the escape hatch** — Only way to use arbitrary HTML/Tailwind

## Deferred Decisions

| Feature | Status | Reconsider When |
|---------|--------|-----------------|
| `tw=` attribute for spacing utilities | DEFERRED | 10+ users request it |
| Custom element definitions | DEFERRED | Clear use case emerges |
| Theming beyond sketch style | DEFERRED | Production use cases |
