import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Progress",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'progress value="50"' },
};

export const Empty = {
  args: { source: 'progress value="0"' },
};

export const Full = {
  args: { source: 'progress value="100"' },
};

export const Small = {
  args: { source: 'progress value="75" size="small"' },
};

export const Large = {
  args: { source: 'progress value="60" size="large"' },
};

export const InCard = {
  args: {
    source: `card
  heading "Upload Progress"
  progress value="67"
  text "67% complete" muted=1`,
  },
};
