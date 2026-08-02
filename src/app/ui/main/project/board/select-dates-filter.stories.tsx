import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectDatesFilter } from "./select-dates-filter";

const meta: Meta<typeof SelectDatesFilter> = {
  title: "Pages/Main/Project/Board/SelectDatesFilter",
  component: SelectDatesFilter,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SelectDatesFilter>;

export const Default: Story = {
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

/** Active filter state — selected preset uses the stronger selected background. */
export const Last7Days: Story = {
  decorators: [
    (Story) => (
      <ProjectContextProvider
        project={projectMock1}
        initialDateFilter="last_7_days"
      >
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
