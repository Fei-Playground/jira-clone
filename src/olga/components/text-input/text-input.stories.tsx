import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OlgaTextInput } from "./text-input";

const meta: Meta<typeof OlgaTextInput> = {
  title: "OLGA/TextInput",
  component: OlgaTextInput,
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export default meta;
type Story = StoryObj<typeof OlgaTextInput>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [value, setValue] = useState("");
    return (
      <OlgaTextInput
        id="default"
        label="What brings you here today?"
        placeholder="e.g. Looking to meet fintech founders…"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const WithCharCounter: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [value, setValue] = useState(
      "Looking to meet potential Series A partners in fintech."
    );
    return (
      <OlgaTextInput
        id="counter"
        label="Describe your intent (max 140 characters)"
        placeholder="What are you here for today?"
        value={value}
        onChange={setValue}
        maxLength={140}
      />
    );
  },
};

export const WithError: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [value, setValue] = useState("");
    return (
      <OlgaTextInput
        id="error"
        label="Intent"
        placeholder="Describe your intent…"
        value={value}
        onChange={setValue}
        error="Please describe your intent before continuing"
      />
    );
  },
};
