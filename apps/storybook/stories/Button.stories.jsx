import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Button",
  component: LofiPreview,
};

export const Primary = {
  args: { source: 'button "Save" primary=1' },
};

export const Secondary = {
  args: { source: 'button "Cancel" secondary=1' },
};

export const Danger = {
  args: { source: 'button "Delete" danger=1' },
};

export const Disabled = {
  args: { source: 'button "Submit" disabled=1' },
};

export const Default = {
  args: { source: 'button "Click me"' },
};
