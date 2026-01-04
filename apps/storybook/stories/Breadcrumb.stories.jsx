import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Breadcrumb",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `breadcrumb
  link "Home"
  link "Products"
  link "Electronics"`,
  },
};

export const WithCustomSeparator = {
  args: {
    source: `breadcrumb separator=">"
  link "Home"
  link "Settings"
  link "Profile"`,
  },
};

export const LongPath = {
  args: {
    source: `breadcrumb
  link "Home"
  link "Categories"
  link "Electronics"
  link "Computers"
  link "Laptops"`,
  },
};
