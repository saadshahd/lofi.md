# lofi.md

> Think in wireframes. Ship in HTML.

LLM-first wireframe DSL. Generate UI mockups from simple text, optimized for AI generation and human tweaking.

## Installation

```bash
npm install -g @lofi.md/cli
# or
bun add -g @lofi.md/cli
```

## Quick Start

```bash
# Generate HTML
lofi example.lofi

# Output to file
lofi example.lofi -o out.html

# Dev server with hot reload
lofi example.lofi --serve
```

### From Source

```bash
git clone https://github.com/lofi-md/wiremd.git
cd wiremd && bun install
bun packages/cli/src/index.ts example.lofi --serve
```

## Example

```lofi
card
  heading "Login"
  form
    input "Email" type="email"
    input "Password" type="password"
    checkbox "Remember me"
    button "Sign In" variant="primary"
```

Output: Hand-drawn sketch-style HTML with wobble effects.

## Syntax

**2-space indentation.** Children nested under parents.

```lofi
page "Dashboard"
  nav
    link "Home" active=1
    link "Settings"
  grid cols="3" gap="4"
    card
      heading "Users"
      text "1,234"
      badge "+12%" type="success"
```

### Elements (31 keywords)

| Category | Elements |
|----------|----------|
| **Containers** | page, section, card, grid, form, modal, alert, nav, breadcrumb, tabs, menu |
| **Controls** | button, input, checkbox, radio, dropdown, textarea, link, tab, accordion, toggle, slider |
| **Content** | heading, text, image, icon, badge, toast, avatar, progress, chart |

### Attributes

```lofi
button "Save" variant="primary"   # Enum: primary/secondary/danger
button "Submit" disabled=1        # Boolean: use =1
input "Email" type="email"        # String value
grid cols="3" gap="4"             # Numeric value
badge "New" type="success"        # Enum: info/success/warning/error
```

### Markdown Block

Tables, lists, and rich text via native markdown:

```lofi
card
  md
    | Name | Role |
    |------|------|
    | Alice | Admin |

    - Item one
    - Item two
```

### HTML Escape Hatch

For elements outside the vocabulary:

```lofi
card
  html
    <video src="demo.mp4" controls></video>
```

## CLI

```bash
lofi <file.lofi>              # Output HTML to stdout
lofi <file.lofi> -o out.html  # Output to file
lofi <file.lofi> --serve      # Dev server (port 3000)
lofi <file.lofi> --watch      # Watch and regenerate
lofi <file.lofi> --serve -p 8080  # Custom port
```

## Philosophy

1. **LLM-first** — Syntax optimized for machine generation
2. **One way** — Each concept has exactly one representation
3. **Closed vocabulary** — 31 elements, no arbitrary CSS
4. **Lo-fi by design** — Sketch aesthetic prevents bikeshedding

See [PHILOSOPHY.md](PHILOSOPHY.md) for axioms, [SYNTAX.md](SYNTAX.md) for full reference.

## Development

```bash
bun install          # Install dependencies
bun test             # Run tests
bun run storybook    # Visual component browser
```

## License

MIT
