import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1, projectMock2 } from "@domain/project";
import { GanttView } from "./gantt-view";

const meta: Meta<typeof GanttView> = {
  title: "Pages/Main/Project/Board/GanttView",
  component: GanttView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen flex-col p-4 [&>*]:flex [&>*]:h-full [&>*]:flex-col [&_.w-full]:flex [&_.w-full]:h-full [&_.w-full]:flex-col">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GanttView>;

export const Default: Story = {
  args: {
    categories: projectMock1.categories,
  },
};

export const FewerTasks: Story = {
  args: {
    categories: projectMock2.categories,
  },
};

export const Empty: Story = {
  args: {
    categories: [],
  },
};
