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
