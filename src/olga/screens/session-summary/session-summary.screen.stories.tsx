import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionSummaryScreen } from "./session-summary.screen";

const meta: Meta<typeof SessionSummaryScreen> = {
  title: "OLGA/Screens/Session Summary",
  component: SessionSummaryScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SessionSummaryScreen>;

export const Default: Story = {
  args: {
    venueName: "Soho Works White City",
    proposalsReviewed: 4,
    proposalsApproved: 2,
    matchesMade: 1,
    // onDone left undefined so it doesn't auto-redirect in Storybook
  },
};

export const HighActivity: Story = {
  args: {
    venueName: "Protein Studios Shoreditch",
    proposalsReviewed: 10,
    proposalsApproved: 6,
    matchesMade: 3,
  },
};

export const NoMatches: Story = {
  args: {
    venueName: "WeWork Monument",
    proposalsReviewed: 3,
    proposalsApproved: 0,
    matchesMade: 0,
  },
};
