import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgingLevel } from "@domain/issue/issue";
import { AgingIndicator } from "./aging-indicator";

const meta: Meta<typeof AgingIndicator> = {
  title: "Components/AgingIndicator",
  component: AgingIndicator,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    level: {
      defaultValue: "aging",
      control: {
        type: "select",
        options: ["fresh", "aging", "stale"],
      },
    },
    ageInDays: {
      control: {
        type: "number",
      },
    },
    size: {
      control: {
        type: "number",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AgingIndicator>;

const levels: AgingLevel[] = ["fresh", "aging", "stale"];

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4 text-font">
      {levels.map((level) => (
        <div key={level} className="flex flex-col items-center gap-2">
          <span className="text-xs capitalize">{level}</span>
          <AgingIndicator level={level} ageInDays={10} />
        </div>
      ))}
    </div>
  ),
};

export const Fresh: Story = {
  args: {
    level: "fresh",
    ageInDays: 2,
  },
};

export const Aging: Story = {
  args: {
    level: "aging",
    ageInDays: 9,
  },
};

export const Stale: Story = {
  args: {
    level: "stale",
    ageInDays: 21,
  },
};
