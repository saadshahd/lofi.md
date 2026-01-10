import { LofiPreview } from "./LofiPreview";

export default {
  title: "Containers/Grid",
  component: LofiPreview,
};

export const TwoColumns = {
  args: {
    source: `grid cols=2 gap=4
  card
    heading "Left"
  card
    heading "Right"`,
  },
};

export const ThreeColumns = {
  args: {
    source: `grid cols=3 gap=4
  card
    heading "One"
  card
    heading "Two"
  card
    heading "Three"`,
  },
};

export const JustifyBetween = {
  args: {
    source: `grid flow=row align=between
  button "Cancel" variant=secondary
  button "Save" variant=primary`,
  },
};

export const CenteredGrid = {
  args: {
    source: `grid cols=2 gap=4 place=center
  badge "A" type=info
  badge "B" type=success`,
  },
};
