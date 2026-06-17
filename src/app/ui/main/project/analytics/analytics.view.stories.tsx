import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { AnalyticsView } from "./analytics.view";

const meta: Meta<typeof AnalyticsView> = {
  title: "Pages/Main/Project/AnalyticsView",
  component: AnalyticsView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            padding: "24px 20px",
          }}
        >
          <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
            {withRemixStub(withMainContext(Story))}
          </div>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof AnalyticsView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};
