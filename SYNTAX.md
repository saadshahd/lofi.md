# lofi Syntax Reference

> Version 0.1.0 | LLM-first wireframe DSL

## Quick Start

```lofi
card
  heading "Login"
  input "Email" type=email required=1
  input "Password" type=password required=1
  button "Sign In" primary=1
```

## Rules

1. **2-space indentation** — Children indented 2 spaces from parent (tabs rejected; indentation is structure, tab width is ambiguous)
2. **One element per line** — Each element on its own line
3. **Attributes follow element** — `element "content" attr=value`
4. **Quotes for content** — String content in double quotes
5. **All attributes use `=`** — Boolean attributes use `=1` (e.g., `primary=1`, `required=1`)

---

## Elements

All keywords map to 3 internal primitives: `container`, `control`, `content`.

### Container

| Element | Attributes |
|---------|------------|
| `page` | `"title"` |
| `section` | `align=center/left/right` |
| `card` | |
| `grid` | `flow=horizontal/vertical`, `cols=N`, `gap=1-6`, `align=start/center/end/between`, `items=start/center/end/stretch`, `place=center` |
| `form` | |
| `modal` | `title=`, `position=center/left/right/bottom` |
| `alert` | `type=info/success/warning/error`, `hidden=1` |
| `nav` | |
| `breadcrumb` | `separator=` |
| `tabs` | |
| `menu` | |

> **Grid modes:** Use `cols` for explicit column layouts (CSS Grid). Use `flow` for content-sized items in a row/column (flexbox). Don't combine both.

### Control

| Element | Attributes |
|---------|------------|
| `button` | `"text"`, `primary=1`, `secondary=1`, `danger=1`, `disabled=1` |
| `input` | `"label"`, `type=text/email/password/tel/url/number/date`, `placeholder=`, `required=1`, `disabled=1`, `error=1` |
| `checkbox` | `"label"`, `checked=1`, `disabled=1` |
| `radio` | `"label"`, `name=`, `selected=1`, `disabled=1` |
| `dropdown` | `"label"`, `options="a,b,c"`, `placeholder=` |
| `textarea` | `"label"`, `rows=N`, `placeholder=` |
| `link` | `"text"`, `href=`, `active=1` |
| `tab` | `"label"`, `active=1` |
| `accordion` | (children are `section`s with titles) |
| `toggle` | `"label"`, `checked=1`, `disabled=1` |
| `slider` | `"label"`, `min=`, `max=`, `value=`, `disabled=1` |

### Content

| Element | Attributes |
|---------|------------|
| `heading` | `"text"`, `level=1-6` |
| `text` | `"content"`, `muted=1` |
| `image` | `src=`, `alt=` |
| `icon` | `name=`, `size=small/medium/large` |
| `badge` | `"text"`, `type=info/success/warning/error` |
| `toast` | `type=`, `position=top/bottom` |
| `avatar` | `src=`, `alt=`, `size=small/medium/large` |
| `progress` | `value=0-100`, `size=small/medium/large` |
| `chart` | `"label"`, `type=bar/line/pie/area/donut` |

---

## Blocks

### md (native)

Markdown is native — use for tables, lists, dividers, rich text.

```lofi
card
  md
    | Name | Role |
    |------|------|
    | Alice | Admin |

    - Item one
    - Item two

    ---

    **Bold**, *italic*, [links](url).
```

Inline: `md: Welcome back, **John**!`

### html (escape hatch)

For elements not in vocabulary:

```lofi
card
  html
    <video src="demo.mp4" controls></video>
```

---

## CLI

```bash
lofi input.lofi              # → input.html
lofi --watch input.lofi      # Watch mode
lofi --serve input.lofi      # Dev server
```

Extension: `.lofi`
