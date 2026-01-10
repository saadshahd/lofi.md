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
5. **Attribute quoting** — Unquote simple values; quote strings with spaces/special chars.

## Attribute Conventions

### When to Quote

| Type | Quote? | Example |
|------|--------|---------|
| Boolean | No | `disabled=1`, `checked=1` |
| Number | No | `level=2`, `cols=3`, `gap=4` |
| Enum | No | `variant=primary`, `type=email`, `flow=row` |
| Identifier | No | `name=plan`, `name=rocket` |
| URL/path | Yes | `src="https://..."`, `href="/page"` |
| Text with spaces | Yes | `placeholder="you@example.com"` |
| Comma-separated | Yes | `options="USA,Canada,UK"` |
| Punctuation | Yes | `title="Delete Item?"` |

### Variant Attributes (Enums)

When an element has mutually exclusive visual variants (e.g., button styles), use a single enum attribute:

```lofi
button "Save" variant=primary      # Filled dark
button "Cancel"                    # Secondary (default)
button "Delete" variant=danger     # Filled error
```

In the renderer:

```typescript
const variant = getAttr(el.attrs, "variant") || "secondary";
const cls = styles.button({ variant });
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
alert type=error             # info | success | warning | error
heading "Title" level=2      # 1-6
grid cols=3 gap=4            # Numeric values
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
