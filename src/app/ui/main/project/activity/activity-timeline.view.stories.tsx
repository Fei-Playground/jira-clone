import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ActivityTimelineView } from "./activity-timeline.view";

const withProviders = (Story: React.ComponentType) =>
  withRemixStub(withMainContext(() => <Story />));

const meta: Meta<typeof ActivityTimelineView> = {
  title: "Pages/Main/Project/ActivityTimelineView",
  component: ActivityTimelineView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withProviders],
  args: {
    projectName: "Toy Story",
  },
};

export default meta;
type Story = StoryObj<typeof ActivityTimelineView>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="h-[2200px] p-6">
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    activities: [],
  },
  decorators: [
    (Story) => (
      <div className="h-screen p-6">
        <Story />
      </div>
    ),
  ],
};
