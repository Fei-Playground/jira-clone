import type { Meta, StoryObj } from "@storybook/react";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectSort } from "./select-sort";

const meta: Meta<typeof SelectSort> = {
  title: "Pages/Main/Project/Board/SelectSort",
  component: SelectSort,
  parameters: {
    layout: "centered",
  },
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
type Story = StoryObj<typeof SelectSort>;

export const Default: Story = {};
