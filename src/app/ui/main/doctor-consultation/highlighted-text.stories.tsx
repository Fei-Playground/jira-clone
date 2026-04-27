import type { Meta, StoryObj } from "@storybook/react";
import { HighlightedText } from "./highlighted-text";

const meta = {
  title: "UI/Highlighted Text",
  component: HighlightedText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HighlightedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleHighlight: Story = {
  args: {
    text: "You need a doctor who offers virtual consultations.",
    highlights: ["offers virtual consultations"],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};

export const MultipleHighlights: Story = {
  args: {
    text: "You need a doctor who offers virtual consultations and respects your time.",
    highlights: ["offers virtual consultations", "respects your time"],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};

export const NoHighlights: Story = {
  args: {
    text: "You need a doctor who offers virtual consultations.",
    highlights: [],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};

export const CaseInsensitive: Story = {
  args: {
    text: "You need a doctor who OFFERS VIRTUAL consultations.",
    highlights: ["offers virtual"],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-elevation-surface p-6">
        <Story />
      </div>
    ),
  ],
};
