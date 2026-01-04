import { LofiPreview } from "./LofiPreview";

export default {
  title: "Content/Avatar",
  component: LofiPreview,
};

export const Default = {
  args: { source: 'avatar src="https://i.pravatar.cc/150" alt="User avatar"' },
};

export const Small = {
  args: { source: 'avatar src="https://i.pravatar.cc/150" alt="User" size="small"' },
};

export const Medium = {
  args: { source: 'avatar src="https://i.pravatar.cc/150" alt="User" size="medium"' },
};

export const Large = {
  args: { source: 'avatar src="https://i.pravatar.cc/150" alt="User" size="large"' },
};

export const AvatarGroup = {
  args: {
    source: `grid flow="horizontal" gap="1"
  avatar src="https://i.pravatar.cc/150?u=a" alt="Alice"
  avatar src="https://i.pravatar.cc/150?u=b" alt="Bob"
  avatar src="https://i.pravatar.cc/150?u=c" alt="Carol"`,
  },
};
