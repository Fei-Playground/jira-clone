import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessengerScreen } from "./messenger.screen";

const meta: Meta<typeof MessengerScreen> = {
  title: "OLGA/Screens/08 Messenger",
  component: MessengerScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MessengerScreen>;

export const Default: Story = {
  args: { matchId: "match-01" },
};
