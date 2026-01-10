import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Button",
  component: LofiPreview,
};

export const Primary = {
  args: { source: 'button "Save" variant=primary' },
};

export const Secondary = {
  args: { source: 'button "Cancel" variant=secondary' },
};

export const Danger = {
  args: { source: 'button "Delete" variant=danger' },
};

export const Disabled = {
  args: { source: 'button "Submit" disabled=1' },
};

export const Default = {
  args: { source: 'button "Click me"' },
};
