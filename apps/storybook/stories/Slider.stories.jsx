import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Slider",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'slider "Volume"' },
};

export const WithRange = {
  args: { source: 'slider "Brightness" min="0" max="100" value="75"' },
};

export const Disabled = {
  args: { source: 'slider "Locked" disabled=1' },
};

export const InForm = {
  args: {
    source: `form
  text "Adjust settings:"
  slider "Volume" min="0" max="100" value="50"
  slider "Brightness" min="0" max="100" value="75"
  button "Apply" primary=1`,
  },
};
