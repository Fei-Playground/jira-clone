import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpsDashboard } from "./ops-dashboard";

const meta: Meta<typeof OpsDashboard> = {
  title: "Brand Pages/Ops Dashboard",
  component: OpsDashboard,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof OpsDashboard>;

export const Default: Story = {};
