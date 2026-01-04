import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Modal",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `modal title="Confirm Action"
  text "Are you sure you want to proceed?"
  grid flow="horizontal" gap="2"
    button "Cancel"
    button "Confirm" primary=1`,
  },
};

export const CenterPosition = {
  args: {
    source: `modal title="Welcome" position="center"
  text "Welcome to the application!"
  button "Get Started" primary=1`,
  },
};

export const BottomPosition = {
  args: {
    source: `modal title="Cookie Notice" position="bottom"
  text "We use cookies to improve your experience."
  button "Accept" primary=1`,
  },
};

export const WithForm = {
  args: {
    source: `modal title="Edit Profile"
  form
    input "Name"
    input "Email" type="email"
    textarea "Bio" rows="3"
  grid flow="horizontal" gap="2"
    button "Cancel"
    button "Save" primary=1`,
  },
};
