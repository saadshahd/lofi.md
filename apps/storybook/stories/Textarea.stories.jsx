import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Textarea",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'textarea "Description"' },
};

export const WithPlaceholder = {
  args: {
    source: 'textarea "Bio" placeholder="Tell us about yourself..."',
  },
};

export const CustomRows = {
  args: { source: 'textarea "Notes" rows="6"' },
};

export const SmallRows = {
  args: { source: 'textarea "Comment" rows="2" placeholder="Add a comment"' },
};
