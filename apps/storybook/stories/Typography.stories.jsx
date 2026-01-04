import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Typography",
  component: LofiPreview,
};

export const Headings = {
  args: {
    source: `heading "Heading 1" level="1"
heading "Heading 2" level="2"
heading "Heading 3" level="3"
heading "Heading 4" level="4"
heading "Heading 5" level="5"
heading "Heading 6" level="6"`,
  },
};

export const Text = {
  args: {
    source: `text "This is regular body text."
text "This is muted text." muted=1`,
  },
};

export const Badge = {
  args: {
    source: `badge "Info" type="info"
badge "Success" type="success"
badge "Warning" type="warning"
badge "Error" type="error"`,
  },
};
