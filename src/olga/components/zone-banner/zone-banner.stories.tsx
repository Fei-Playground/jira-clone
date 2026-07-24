import type { Meta, StoryObj } from "@storybook/react-vite";
import { ZoneBanner } from "./zone-banner";

const meta: Meta<typeof ZoneBanner> = {
  title: "OLGA/ZoneBanner",
  component: ZoneBanner,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ZoneBanner>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    zoneName: "The Lounge",
    description: "Open seating, ideal for informal introductions",
  },
};
