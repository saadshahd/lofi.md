import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Modal",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `modal title="Confirm Action"
  text "Are you sure you want to proceed?"
  grid flow=row gap=2
    button "Cancel"
    button "Confirm" variant=primary`,
  },
};

export const CenterPosition = {
  args: {
    source: `modal title="Welcome" position=center
  text "Welcome to the application!"
  button "Get Started" variant=primary`,
  },
};

export const BottomPosition = {
  args: {
    source: `modal title="Cookie Notice" position=bottom
  text "We use cookies to improve your experience."
  button "Accept" variant=primary`,
  },
};

export const WithForm = {
  args: {
    source: `modal title="Edit Profile"
  form
    input "Name"
    input "Email" type=email
    textarea "Bio" rows=3
  grid flow=row gap=2
    button "Cancel"
    button "Save" variant=primary`,
  },
};
