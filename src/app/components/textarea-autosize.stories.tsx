import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextareaAutosize } from "./textarea-autosize";

interface TextareaWrapperProps {
  name: string;
  value: string;
  placeholder: string;
  readOnly?: boolean;
}

const meta: Meta<typeof TextareaAutosize> = {
  title: "Components/TextareaAutosize",
  component: TextareaAutosize,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: {
      control: {
        type: "text",
      },
    },
    placeholder: {
      control: {
        type: "text",
      },
    },
    readOnly: {
      control: {
        type: "boolean",
      },
    },
    autofocus: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextareaAutosize>;

const TextareaWrapper = (props: TextareaWrapperProps) => {
  const [value, setValue] = useState<string>(props.value || "");

  return (
    <div className="w-96">
      <TextareaAutosize {...props} value={value} setValue={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TextareaWrapper {...args} />,
  args: {
    name: "description",
    value: "",
    placeholder: "Enter your description here...",
    readOnly: false,
  },
};

export const WithInitialValue: Story = {
  render: (args) => <TextareaWrapper {...args} />,
  args: {
    name: "description",
    value:
      "This is a sample description that will automatically " +
      "expand as you type.",
    placeholder: "Enter your description here...",
    readOnly: false,
  },
};

export const ReadOnly: Story = {
  render: (args) => <TextareaWrapper {...args} />,
  args: {
    name: "description",
    value:
      "This is a read-only description. You cannot edit this " +
      "text.",
    placeholder: "Enter your description here...",
    readOnly: true,
  },
};

export const MultilineContent: Story = {
  render: (args) => <TextareaWrapper {...args} />,
  args: {
    name: "description",
    value: "Line 1\nLine 2\nLine 3\nLine 4\nLine 5",
    placeholder: "Enter your description here...",
    readOnly: false,
  },
};
