import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Projects", href: "/projects" },
      { label: "My Project", href: "/projects/1" },
      { label: "Board", href: "/projects/1/board" },
      { label: "Feature Development", current: true },
    ],
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: "Projects", href: "/projects" },
      { label: "My Project", current: true },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Projects", current: true }],
  },
};
