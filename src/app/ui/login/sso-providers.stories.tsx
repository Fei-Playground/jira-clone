import type { Meta, StoryObj } from "@storybook/react-vite";
import { SSOProviders } from "./sso-providers";

const meta: Meta<typeof SSOProviders> = {
  title: "Login/SSOProviders",
  component: SSOProviders,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SSOProviders>;

export const Default: Story = {};
