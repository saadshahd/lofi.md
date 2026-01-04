import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Tab",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'tab "Overview"' },
};

export const Active = {
  args: { source: 'tab "Overview" active=1' },
};

export const TabGroup = {
  args: {
    source: `grid flow="horizontal" gap="1"
  tab "Overview" active=1
  tab "Features"
  tab "Pricing"`,
  },
};
