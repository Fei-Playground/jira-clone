import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OutcomeTagSelector } from "./outcome-selector";
import type { OutcomeValue } from "@olga/domain/types";

const meta: Meta<typeof OutcomeTagSelector> = {
  title: "OLGA/OutcomeTagSelector",
  component: OutcomeTagSelector,
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export default meta;
type Story = StoryObj<typeof OutcomeTagSelector>;

export const Unselected: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [value, setValue] = useState<OutcomeValue | undefined>(undefined);
    return <OutcomeTagSelector value={value} onChange={setValue} />;
  },
};

export const WithSelection: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [value, setValue] = useState<OutcomeValue>("exchanged-contacts");
    return <OutcomeTagSelector value={value} onChange={setValue} />;
  },
};
