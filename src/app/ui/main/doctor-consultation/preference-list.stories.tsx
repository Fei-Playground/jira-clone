import type { Meta, StoryObj } from "@storybook/react";
import { PreferenceList } from "./preference-list";

const meta = {
  title: "UI/Preference List",
  component: PreferenceList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PreferenceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        text: "You want a doctor who values your wellbeing.",
        isSelected: true,
      },
      {
        text: "You are looking for a doctor skilled in preventative medicine.",
        isSelected: true,
      },
      {
        text: "You need a doctor who offers virtual consultations.",
        isSelected: true,
      },
      {
        text: "You prefer a doctor who is known for clear communication.",
        isSelected: true,
      },
      {
        text: "You prefer a doctor who respects your cultural background.",
        isSelected: true,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};

export const MixedSelection: Story = {
  args: {
    items: [
      {
        text: "You want a doctor who values your wellbeing.",
        isSelected: true,
      },
      {
        text: "You are looking for a doctor skilled in preventative medicine.",
        isSelected: false,
      },
      {
        text: "You need a doctor who offers virtual consultations.",
        isSelected: true,
      },
      {
        text: "You prefer a doctor who is known for clear communication.",
        isSelected: false,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    items: [],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};
