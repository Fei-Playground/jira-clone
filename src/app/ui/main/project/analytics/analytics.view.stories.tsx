import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { AnalyticsView } from "./analytics.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof AnalyticsView> = {
  title: "Pages/Main/Project/AnalyticsView",
  component: AnalyticsView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};

export default meta;
type Story = StoryObj<typeof AnalyticsView>;

export const Default: Story = {};
