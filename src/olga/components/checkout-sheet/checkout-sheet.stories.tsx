import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckOutSheet } from "./checkout-sheet";

const meta: Meta<typeof CheckOutSheet> = {
  title: "OLGA/CheckOutSheet",
  component: CheckOutSheet,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "surface" },
  },
};

export default meta;
type Story = StoryObj<typeof CheckOutSheet>;

export const Open: Story = {
  args: {
    venueName: "Soho Works White City",
    isOpen: true,
    onConfirm: () => {},
    onCancel: () => {},
  },
};
