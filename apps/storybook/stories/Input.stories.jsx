import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Input",
  component: LofiPreview,
};

export const Text = {
  args: { source: 'input "Username"' },
};

export const Email = {
  args: { source: 'input "Email" type="email" placeholder="you@example.com"' },
};

export const Password = {
  args: { source: 'input "Password" type="password"' },
};

export const Required = {
  args: { source: 'input "Required Field" required=1' },
};

export const Disabled = {
  args: { source: 'input "Disabled" disabled=1' },
};

export const WithError = {
  args: { source: 'input "Username" error=1' },
};
