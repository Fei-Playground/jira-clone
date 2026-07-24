import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpaceDiscoveryScreen } from "./space-discovery.screen";

const meta: Meta<typeof SpaceDiscoveryScreen> = {
  title: "OLGA/Screens/03 Space Discovery",
  component: SpaceDiscoveryScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SpaceDiscoveryScreen>;

export const Default: Story = {};
