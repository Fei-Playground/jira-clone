import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { milestonesMock, milestoneMock1 } from "@domain/milestone";
import { ganttTasksMock } from "@domain/gantt";
import { GanttView } from "./gantt.view";

const meta: Meta<typeof GanttView> = {
  title: "Pages/Main/Project/GanttView",
  component: GanttView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="box-border h-screen w-max min-w-[1620px] max-w-none p-6">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttView>;

export const Default: Story = {
  args: {
    tasks: ganttTasksMock,
    initialMilestones: milestonesMock,
  },
};

export const EmptyMilestones: Story = {
  args: {
    tasks: ganttTasksMock,
    initialMilestones: [],
  },
};

export const SingleMilestone: Story = {
  args: {
    tasks: ganttTasksMock,
    initialMilestones: [milestoneMock1],
  },
};
