import { LofiPreview } from "./LofiPreview";

export default {
  title: "Controls/Dropdown",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'dropdown "Country" options="USA,Canada,UK,Australia"' },
};

export const WithPlaceholder = {
  args: {
    source: 'dropdown "Status" options="Active,Pending,Inactive" placeholder="Select status"',
  },
};

export const ManyOptions = {
  args: {
    source:
      'dropdown "Month" options="January,February,March,April,May,June,July,August,September,October,November,December"',
  },
};
