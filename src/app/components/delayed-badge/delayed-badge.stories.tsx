import type { Meta, StoryObj } from "@storybook/react-vite";
import { DelayedBadge } from "./delayed-badge";

const meta: Meta<typeof DelayedBadge> = {
  title: "Components/DelayedBadge",
  component: DelayedBadge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: {
        type: "number",
      },
    },
    showLabel: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DelayedBadge>;

export const IconOnly: Story = {
  args: {
    size: 18,
    showLabel: false,
  },
};

export const WithLabel: Story = {
  args: {
    size: 14,
    showLabel: true,
  },
};
