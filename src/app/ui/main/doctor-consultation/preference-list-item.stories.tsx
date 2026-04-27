import type { Meta, StoryObj } from "@storybook/react";
import { PreferenceListItem } from "./preference-list-item";

const meta = {
  title: "UI/Preference List Item",
  component: PreferenceListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PreferenceListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {
  args: {
    text: "You want a doctor who values your wellbeing.",
    isSelected: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
};

export const Unselected: Story = {
  args: {
    text: "You are looking for a doctor skilled in preventative medicine.",
    isSelected: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
};

export const LongText: Story = {
  args: {
    text: "You prefer a doctor who is known for clear communication and takes time to explain medical procedures in a way that is easy for patients to understand.",
    isSelected: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
};
