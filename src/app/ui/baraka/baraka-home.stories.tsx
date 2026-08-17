import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarakaHome } from "./baraka-home";

const meta: Meta<typeof BarakaHome> = {
  title: "Brand Pages/Baraka Dates Co.",
  component: BarakaHome,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BarakaHome>;

export const Homepage: Story = {};
