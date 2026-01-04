import { LofiPreview } from "./LofiPreview";

export default {
  title: "Blocks/Markdown",
  component: LofiPreview,
};

export const BasicFormatting = {
  args: {
    source: `card
  md
    **Bold text** and *italic text*.

    This is a [link](https://example.com).`,
  },
};

export const Table = {
  args: {
    source: `md
    | Name | Role | Status |
    |------|------|--------|
    | Alice | Admin | Active |
    | Bob | User | Pending |
    | Carol | Editor | Active |`,
  },
};

export const List = {
  args: {
    source: `card
  md
    - First item
    - Second item
    - Third item

    1. Numbered one
    2. Numbered two
    3. Numbered three`,
  },
};

export const Mixed = {
  args: {
    source: `card
  heading "Welcome"
  md
    This card contains **markdown** content.

    ---

    > A blockquote for emphasis.`,
  },
};
