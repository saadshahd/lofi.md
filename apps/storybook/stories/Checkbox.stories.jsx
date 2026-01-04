import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Checkbox",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'checkbox "Accept terms"' },
};

export const Checked = {
  args: { source: 'checkbox "Remember me" checked=1' },
};

export const Disabled = {
  args: { source: 'checkbox "Unavailable option" disabled=1' },
};

export const CheckedDisabled = {
  args: { source: 'checkbox "Locked setting" checked=1 disabled=1' },
};
