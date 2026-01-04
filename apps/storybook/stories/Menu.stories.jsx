import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Menu",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `menu
  link "Dashboard"
  link "Profile"
  link "Settings"
  link "Logout"`,
  },
};

export const WithActiveItem = {
  args: {
    source: `menu
  link "Dashboard" active=1
  link "Projects"
  link "Team"
  link "Reports"
  link "Settings"`,
  },
};

export const WithIcons = {
  args: {
    source: `menu
  link "Home"
  link "Users"
  link "Analytics"
  link "Settings"`,
  },
};
