import type { Meta, StoryObj } from "@storybook/react-vite";

import NotFound404Route from "./404";

/**
 * Storybook configuration for the 404 Not Found route.
 * Displays the full error page in fullscreen mode.
 */
const meta: Meta<typeof NotFound404Route> = {
  title: "Routes/404",
  component: NotFound404Route,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NotFound404Route>;

/**
 * Default story showing the 404 error page as users would see it.
 */
export const Default: Story = {};
