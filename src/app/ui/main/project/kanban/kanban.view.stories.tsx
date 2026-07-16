import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { KanbanView } from "./kanban.view";

const meta: Meta<typeof KanbanView> = {
  title: "Pages/Main/Project/KanbanView",
  component: KanbanView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KanbanView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};
