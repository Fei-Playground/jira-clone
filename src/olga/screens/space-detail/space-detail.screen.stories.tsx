import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpaceDetailScreen } from "./space-detail.screen";
import { mockSpaces } from "@olga/domain/mock-data";

const meta: Meta<typeof SpaceDetailScreen> = {
  title: "OLGA/Screens/04 Space Detail",
  component: SpaceDetailScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SpaceDetailScreen>;

export const SohoWorks: Story = {
  args: { space: mockSpaces[0] },
};

export const ProteinStudios: Story = {
  args: { space: mockSpaces[1] },
};

export const DensitySuppressed: Story = {
  args: { space: mockSpaces[4] },
};
