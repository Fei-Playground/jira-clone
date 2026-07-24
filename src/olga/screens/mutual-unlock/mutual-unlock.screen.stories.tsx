import type { Meta, StoryObj } from "@storybook/react-vite";
import { MutualUnlockScreen } from "./mutual-unlock.screen";
import { mockMatches } from "@olga/domain/mock-data";

const meta: Meta<typeof MutualUnlockScreen> = {
  title: "OLGA/Screens/07 Mutual Unlock",
  component: MutualUnlockScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MutualUnlockScreen>;

export const BeforeReveal: Story = {
  args: { match: mockMatches[0] },
};

export const AfterReveal: Story = {
  args: { match: mockMatches[0] },
  play: async () => {
    // Click the card to flip it
  },
};

export const SecondMatch: Story = {
  args: { match: mockMatches[1] },
};
