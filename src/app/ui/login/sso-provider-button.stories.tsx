import type { Meta, StoryObj } from "@storybook/react";
import { SsoProviderButton } from "./sso-provider-button";
import { SSO_PROVIDERS } from "./sso-config";

const meta: Meta<typeof SsoProviderButton> = {
  component: SsoProviderButton,
  title: "Login/SsoProviderButton",
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-[300px]">
      <SsoProviderButton {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof SsoProviderButton>;

export const Google: Story = {
  args: {
    provider: SSO_PROVIDERS[0], // Google
    onClick: () => console.log("Google SSO clicked"),
  },
};

export const GitHub: Story = {
  args: {
    provider: SSO_PROVIDERS[1], // GitHub
    onClick: () => console.log("GitHub SSO clicked"),
  },
};

export const Microsoft: Story = {
  args: {
    provider: SSO_PROVIDERS[2], // Microsoft
    onClick: () => console.log("Microsoft SSO clicked"),
  },
};

export const Apple: Story = {
  args: {
    provider: SSO_PROVIDERS[3], // Apple
    onClick: () => console.log("Apple SSO clicked"),
  },
};
