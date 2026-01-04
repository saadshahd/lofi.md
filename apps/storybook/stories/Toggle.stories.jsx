import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Toggle",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'toggle "Enable notifications"' },
};

export const Checked = {
  args: { source: 'toggle "Dark mode" checked=1' },
};

export const Disabled = {
  args: { source: 'toggle "Premium feature" disabled=1' },
};

export const CheckedDisabled = {
  args: { source: 'toggle "Always on" checked=1 disabled=1' },
};
