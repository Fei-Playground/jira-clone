import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { GanttView } from "./gantt-view";

const meta: Meta<typeof GanttView> = {
  title: "Pages/Main/Project/Board/GanttView",
  component: GanttView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-screen flex flex-col">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};
