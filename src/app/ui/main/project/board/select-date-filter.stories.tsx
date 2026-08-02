import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectDateFilter } from "./select-date-filter";

const meta: Meta<typeof SelectDateFilter> = {
  title: "Pages/Main/Project/Board/SelectDateFilter",
  component: SelectDateFilter,
  parameters: {
    layout: "padded",
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
type Story = StoryObj<typeof SelectDateFilter>;

export const Default: Story = {};
