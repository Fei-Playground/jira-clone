import type { Meta, StoryObj } from "@storybook/react";
import { ProjectContextProvider } from "../project.store";
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
      <ProjectContextProvider project={projectMock1}>
        <div className="h-screen p-4">
          <Story />
        </div>
      </ProjectContextProvider>
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

export const WithDifferentProject: Story = {
  args: {
    categories: projectMock2.categories,
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock2}>
        <div className="h-screen p-4">
          <Story />
        </div>
      </ProjectContextProvider>
    ),
  ],
};

export const EmptyState: Story = {
  args: {
    categories: [],
  },
};
