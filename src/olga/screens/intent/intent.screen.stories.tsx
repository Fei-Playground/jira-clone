import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntentScreen } from "./intent.screen";

const meta: Meta<typeof IntentScreen> = {
  title: "OLGA/Screens/02 Intent Declaration",
  component: IntentScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof IntentScreen>;

export const Default: Story = {};
