import type { Meta, StoryObj } from "@storybook/react";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { PriorityFilter } from "./priority-filter";

const meta: Meta<typeof PriorityFilter> = {
  title: "Pages/Main/Project/Board/PriorityFilter",
  component: PriorityFilter,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        <div className="p-4">
          {withRemixStub(
            <div>
              <Story />
            </div>
          )}
        </div>
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PriorityFilter>;

export const Default: Story = {};
