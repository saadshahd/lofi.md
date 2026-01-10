import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Accordion",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `accordion
  section
    heading "What is lofi.md?"
    text "A wireframe DSL for quick prototyping."`,
  },
};

export const MultipleSections = {
  args: {
    source: `accordion
  section
    heading "Getting Started"
    text "Install via npm and run the CLI."
  section
    heading "Syntax"
    text "Use 2-space indentation and keywords."
  section
    heading "Output"
    text "Generates HTML with sketch styling."`,
  },
};

export const FAQ = {
  args: {
    source: `card
  heading "FAQ"
  accordion
    section
      heading "How do I install?"
      text "Run: npm install -g @lofi.md/cli"
    section
      heading "What formats are supported?"
      text "Currently HTML output only."
    section
      heading "Can I customize the theme?"
      text "Theming is planned for future releases."`,
  },
};
