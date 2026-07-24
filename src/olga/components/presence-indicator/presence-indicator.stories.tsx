import type { Meta, StoryObj } from "@storybook/react-vite";
import { PresenceIndicator } from "./presence-indicator";

const meta: Meta<typeof PresenceIndicator> = {
  title: "OLGA/PresenceIndicator",
  component: PresenceIndicator,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PresenceIndicator>;

export const Active: Story = {
  args: { status: "active", venueName: "Soho Works White City" },
};

export const Expiring: Story = {
  args: { status: "expiring", minutesLeft: 8 },
};

export const Inactive: Story = {
  args: { status: "inactive" },
};
