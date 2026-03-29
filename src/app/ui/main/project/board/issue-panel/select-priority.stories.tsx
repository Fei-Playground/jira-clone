import type { Meta, StoryObj } from "@storybook/react";
import { priorityLow, priorityMedium, priorityHigh, PriorityId } from "@domain/priority";
import { SelectPriority } from "./select-priority";

const meta: Meta<typeof SelectPriority> = {
  title: "Pages/Main/Project/Board/IssuePanel/SelectPriority",
  component: SelectPriority,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    initPriority: {
      control: {
        type: "select",
        options: ["LOW", "MEDIUM", "HIGH"],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectPriority>;

export const Low: Story = {
  args: {
    initPriority: priorityLow.id as PriorityId,
  },
};

export const Medium: Story = {
  args: {
    initPriority: priorityMedium.id as PriorityId,
  },
};

export const High: Story = {
  args: {
    initPriority: priorityHigh.id as PriorityId,
  },
};
