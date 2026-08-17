import type { Meta, StoryObj } from "@storybook/react-vite";
import { NutriDateHome } from "./nutridate-home";

const meta: Meta<typeof NutriDateHome> = {
  title: "Brand Pages/NutriDate",
  component: NutriDateHome,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NutriDateHome>;

export const Homepage: Story = {};
