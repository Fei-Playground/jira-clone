import type { Meta, StoryObj } from "@storybook/react-vite";
import { OlgaButton } from "./button";

const meta: Meta<typeof OlgaButton> = {
  title: "OLGA/Button",
  component: OlgaButton,
  parameters: {
    layout: "centered",
    backgrounds: { default: "light" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "verified", "destructive", "ghost"],
    },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof OlgaButton>;

export const Primary: Story = {
  args: { variant: "primary", children: "Continue" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
};

export const Verified: Story = {
  args: { variant: "verified", children: "Check In" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Decline" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Skip" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Save Intent", disabled: true },
};

export const FullWidth: Story = {
  args: { variant: "primary", children: "Approve", fullWidth: true },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <OlgaButton variant="primary">Primary</OlgaButton>
      <OlgaButton variant="secondary">Secondary</OlgaButton>
      <OlgaButton variant="verified">Verified (Check In)</OlgaButton>
      <OlgaButton variant="destructive">Destructive</OlgaButton>
      <OlgaButton variant="ghost">Ghost</OlgaButton>
      <OlgaButton variant="primary" disabled>
        Disabled
      </OlgaButton>
    </div>
  ),
};
