import type { Meta, StoryObj } from "@storybook/react-vite";
import { SsoProviderButton } from "./sso-provider-button";
import { SSO_PROVIDERS } from "./sso-config";

const meta: Meta<typeof SsoProviderButton> = {
  title: "Login/SsoProviderButton",
  component: SsoProviderButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0d0d0d" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "320px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SsoProviderButton>;

// Individual provider stories
export const Google: Story = {
  args: {
    provider: SSO_PROVIDERS[0], // Google
  },
};

export const GitHub: Story = {
  args: {
    provider: SSO_PROVIDERS[1], // GitHub
  },
};

export const Microsoft: Story = {
  args: {
    provider: SSO_PROVIDERS[2], // Microsoft
  },
};

export const Apple: Story = {
  args: {
    provider: SSO_PROVIDERS[3], // Apple
  },
};

// Combined story showing all four providers
export const AllProviders: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {SSO_PROVIDERS.map((provider) => (
        <SsoProviderButton key={provider.id} provider={provider} />
      ))}
    </div>
  ),
};
