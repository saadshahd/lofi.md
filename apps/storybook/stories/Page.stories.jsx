import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Page",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `page "Dashboard"
  heading "Welcome"
  text "This is your dashboard."`,
  },
};

export const WithNavigation = {
  args: {
    source: `page "App"
  nav
    link "Home" active=1
    link "Settings"
    link "Profile"
  heading "Home"
  text "Main content area."`,
  },
};

export const WithSections = {
  args: {
    source: `page "Documentation"
  section
    heading "Getting Started"
    text "Introduction to the system."
  section
    heading "API Reference"
    text "Detailed API documentation."`,
  },
};
