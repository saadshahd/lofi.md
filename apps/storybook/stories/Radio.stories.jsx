import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Radio",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'radio "Option A" name="choice"' },
};

export const Selected = {
  args: { source: 'radio "Option A" name="choice" selected=1' },
};

export const Disabled = {
  args: { source: 'radio "Unavailable" name="choice" disabled=1' },
};

export const RadioGroup = {
  args: {
    source: `form
    grid flow="vertical" gap="1"
      text "Select a plan:"
      radio "Free" name="plan" selected=1
      radio "Pro" name="plan"
      radio "Enterprise" name="plan"`,
  },
};
