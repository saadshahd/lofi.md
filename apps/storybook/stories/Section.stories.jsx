import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Section",
  component: LofiPreview,
};

export const Default = {
  args: {
    source: `section
  heading "Section Title"
  text "Section content goes here."`,
  },
};

export const CenterAligned = {
  args: {
    source: `section align=center
  heading "Centered Section"
  text "This content is centered."`,
  },
};

export const RightAligned = {
  args: {
    source: `section align=right
  heading "Right Aligned"
  text "This content is right-aligned."`,
  },
};

export const NestedSections = {
  args: {
    source: `section
  heading "Parent Section"
  section
    heading "Child Section"
    text "Nested content."`,
  },
};
