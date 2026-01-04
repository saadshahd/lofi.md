import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Form",
  component: LofiPreview,
};

export const LoginForm = {
  args: {
    source: `card
  heading "Login"
  form
    input "Email" type="email" placeholder="you@example.com"
    input "Password" type="password"
    checkbox "Remember me"
    button "Sign In" primary=1`,
  },
};

export const CompleteForm = {
  args: {
    source: `card
  heading "Account Settings"
  form
    input "Email" type="email" placeholder="you@example.com"
    input "Password" type="password"
    input "Phone" type="tel"
    textarea "Bio" rows="3" placeholder="Tell us about yourself"
    dropdown "Country" options="USA,Canada,UK,Australia" placeholder="Select country"
    checkbox "Receive notifications" checked=1
    checkbox "Enable dark mode"
    radio "Standard Plan" name="plan" selected=1
    radio "Pro Plan" name="plan"
    toggle "Two-factor auth" checked=1
    slider "Volume" min="0" max="100" value="50"
  grid flow="row" justify="between"
    button "Cancel" secondary=1
    button "Save Changes" primary=1`,
  },
};

export const WithValidation = {
  args: {
    source: `card
  heading "Register"
  form
    input "Username" error=1
    alert type="error"
      text "Username already taken"
    input "Email" type="email"
    input "Password" type="password"
    button "Register" primary=1`,
  },
};
