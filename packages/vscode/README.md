# lofi.md for VS Code

> Add wireframes to your markdown specs.

Language support and live preview for the lofi wireframe DSL—optimized for AI generation and human tweaking.

## Features

- **Syntax highlighting** for `.lofi` files
- **Live preview** with instant updates as you type
- **Sketch aesthetic** output—hand-drawn wireframe style

## Quick Start

1. Open any `.lofi` file
2. Press `Cmd+K V` (Mac) or `Ctrl+K V` (Windows/Linux) to open preview
3. Edit and watch the preview update live

## Example

```lofi
card
  heading "Login"
  form
    input "Email" type=email
    input "Password" type=password
    checkbox "Remember me"
    button "Sign In" variant=primary
```

## Learn More

- [Full syntax reference](https://github.com/moo-md/lofi.md/blob/main/SYNTAX.md)
- [CLI for batch generation](https://www.npmjs.com/package/@lofi.md/cli)
- [Philosophy & design](https://github.com/moo-md/lofi.md/blob/main/PHILOSOPHY.md)
