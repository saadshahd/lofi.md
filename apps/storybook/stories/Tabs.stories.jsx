import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Tabs",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `tabs
  tab "Overview" active=1
  tab "Features"
  tab "Pricing"`,
  },
};

export const ManyTabs = {
  args: {
    source: `tabs
  tab "General" active=1
  tab "Security"
  tab "Notifications"
  tab "Billing"
  tab "Advanced"`,
  },
};

export const WithContent = {
  args: {
    source: `card
  tabs
    tab "Details" active=1
    tab "Reviews"
    tab "FAQ"
  section
    heading "Product Details"
    text "Detailed product information goes here."`,
  },
};
