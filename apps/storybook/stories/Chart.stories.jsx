import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Chart",
  component: LofiPreview,
};

export const Bar = {
  args: { source: 'chart "Sales" type="bar"' },
};

export const Line = {
  args: { source: 'chart "Revenue" type="line"' },
};

export const Pie = {
  args: { source: 'chart "Distribution" type="pie"' },
};

export const Area = {
  args: { source: 'chart "Traffic" type="area"' },
};

export const Donut = {
  args: { source: 'chart "Usage" type="donut"' },
};

export const InDashboard = {
  args: {
    source: `card
  heading "Analytics"
  grid cols="2" gap="4"
    chart "Revenue" type="line"
    chart "Users" type="bar"`,
  },
};
