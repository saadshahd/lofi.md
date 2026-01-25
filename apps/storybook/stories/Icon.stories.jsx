import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Icon",
  component: LofiPreview,
};

export const Default = {
  args: { source: "icon name=star" },
};

export const Small = {
  args: { source: "icon name=heart size=small" },
};

export const Medium = {
  args: { source: "icon name=check size=medium" },
};

export const Large = {
  args: { source: "icon name=warning size=large" },
};

export const IconSet = {
  args: {
    source: `grid flow=row gap=2
  icon name=home
  icon name=user
  icon name=settings
  icon name=bell
  icon name=search`,
  },
};
