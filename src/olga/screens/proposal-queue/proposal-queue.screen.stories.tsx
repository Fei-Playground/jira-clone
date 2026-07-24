import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProposalQueueScreen } from "./proposal-queue.screen";

const meta: Meta<typeof ProposalQueueScreen> = {
  title: "OLGA/Screens/06 Proposal Queue",
  component: ProposalQueueScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ProposalQueueScreen>;

export const Default: Story = {
  args: {
    venueName: "Soho Works White City",
    secondsRemaining: 3600,
    onCheckOut: () => {},
  },
};

export const Expiring: Story = {
  args: {
    venueName: "Second Home Spitalfields",
    secondsRemaining: 420,
    onCheckOut: () => {},
  },
};
