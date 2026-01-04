import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Link",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'link "Click here"' },
};

export const WithHref = {
  args: { source: 'link "Visit Website" href="https://example.com"' },
};

export const Active = {
  args: { source: 'link "Current Page" active=1' },
};

export const InText = {
  args: {
    source: `text "Read our"
link "documentation"
text "for more information."`,
  },
};
