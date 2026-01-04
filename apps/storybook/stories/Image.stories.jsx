import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Image",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'image src="https://picsum.photos/300/200" alt="Sample image"' },
};

export const WithAlt = {
  args: {
    source: 'image src="https://picsum.photos/400/300" alt="A beautiful landscape"',
  },
};

export const InCard = {
  args: {
    source: `card
  image src="https://picsum.photos/400/200" alt="Product photo"
  heading "Product Name"
  text "Product description goes here."
  button "Buy Now" primary=1`,
  },
};
