import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

const InputWrapper = (props: React.ComponentProps<typeof Input>) => {
  const [value, setValue] = useState<string>((props.value as string) || "");

  return (
    <div className="w-96">
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "text",
  },
};

export const Email: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
};

export const Password: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
};

export const WithError: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    value: "invalid-email",
    error: "Please enter a valid email address",
  },
};

export const WithHelperText: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    helperText: "We'll never share your email with anyone else.",
  },
};

export const Disabled: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    value: "user@example.com",
    disabled: true,
  },
};

export const Required: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    required: true,
  },
};
