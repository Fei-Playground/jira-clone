import type { Meta, StoryObj } from "@storybook/react";
import { SsoProviders } from "./sso-providers";

const meta: Meta<typeof SsoProviders> = {
  component: SsoProviders,
  title: "Login/SsoProviders",
  tags: ["autodocs"],
  render: () => (
    <div className="w-[300px]">
      <SsoProviders />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof SsoProviders>;

export const Default: Story = {};

export const Mobile: Story = {
  render: () => (
    <div className="w-full max-w-[300px]">
      <SsoProviders />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
