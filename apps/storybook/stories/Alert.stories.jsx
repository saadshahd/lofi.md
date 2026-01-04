import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Alert",
  component: LofiPreview,
};

export const Info = {
  args: {
    source: `alert type="info"
  text "This is an informational message."`,
  },
};

export const Success = {
  args: {
    source: `alert type="success"
  text "Operation completed successfully!"`,
  },
};

export const Warning = {
  args: {
    source: `alert type="warning"
  text "Please review before proceeding."`,
  },
};

export const Errors = {
  args: {
    source: `alert type="error"
  text "Something went wrong. Please try again."`,
  },
};
