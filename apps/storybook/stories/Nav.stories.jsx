import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Nav",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `nav
  link "Home"
  link "About"
  link "Contact"`,
  },
};

export const WithActiveLink = {
  args: {
    source: `nav
  link "Home" active=1
  link "Products"
  link "Services"
  link "Contact"`,
  },
};

export const WithButtons = {
  args: {
    source: `nav
  link "Home" active=1
  link "Features"
  link "Pricing"
  button "Sign In"
  button "Get Started" variant=primary`,
  },
};
