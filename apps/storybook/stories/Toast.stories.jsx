import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Toast",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `toast
  text "Your changes have been saved."`,
  },
};

export const Success = {
  args: {
    source: `toast type="success"
  text "Operation completed successfully!"`,
  },
};

export const Error = {
  args: {
    source: `toast type="error"
  text "Something went wrong. Please try again."`,
  },
};

export const TopPosition = {
  args: {
    source: `toast position="top"
  text "New notification received."`,
  },
};

export const BottomPosition = {
  args: {
    source: `toast position="bottom"
  text "Message sent."`,
  },
};
