import type { Meta, StoryObj } from "@storybook/react-vite";

import NotFound404Route from "./404";

const meta: Meta<typeof NotFound404Route> = {
  title: "Routes/NotFound404",
  component: NotFound404Route,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NotFound404Route>;

export const Default: Story = {};
