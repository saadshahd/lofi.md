import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Card",
  component: LofiPreview,
};

export const Basic = {
  args: {
    source: `card
  heading "Card Title"
  text "Card content goes here."`,
  },
};

export const WithForm = {
  args: {
    source: `card
  heading "Login"
  form
    input "Email" type="email"
    input "Password" type="password"
    button "Sign In" primary=1`,
  },
};

export const WithBadge = {
  args: {
    source: `card
  badge "New" type="success"
  heading "Feature"
  text "This is a new feature."`,
  },
};
