import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta: Meta<typeof Footer> = {
  title: "Pages/Main/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
