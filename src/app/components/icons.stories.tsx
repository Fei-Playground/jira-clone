import type { Meta, StoryObj } from "@storybook/react";
import { TaskIcon } from "./icons";

const meta: Meta<typeof TaskIcon> = {
  title: "Components/Icons",
  component: TaskIcon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: {
        type: "number",
      },
    },
    className: {
      control: {
        type: "text",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaskIcon>;

export const Default: Story = {
  args: {
    size: 24,
  },
};

export const Small: Story = {
  args: {
    size: 16,
  },
};

export const Large: Story = {
  args: {
    size: 32,
  },
};

export const WithCustomClass: Story = {
  args: {
    size: 24,
    className: "opacity-75",
  },
};
