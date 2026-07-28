import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ActivityTimelineView } from "./activity-timeline.view";

const meta: Meta<typeof ActivityTimelineView> = {
  title: "Pages/Main/Project/Activity/ActivityTimelineView",
  component: ActivityTimelineView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-elevation-surface p-6">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityTimelineView>;

export const Default: Story = {
  args: {
    projectName: "JIRA Clone",
  },
};

export const Empty: Story = {
  args: {
    projectName: "JIRA Clone",
    activities: [],
  },
};
