import type { Meta, StoryObj } from "@storybook/react-vite";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectAssignee } from "./select-assignee";

const meta: Meta<typeof SelectAssignee> = {
  title: "Pages/Main/Project/Board/IssuePanel/SelectAssignee",
  component: SelectAssignee,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        <div className="p-4">
          <Story />
        </div>
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SelectAssignee>;

const firstUser = projectMock1.users[0];
const secondUser = projectMock1.users[1];

export const Default: Story = {
  args: {
    initAssignee: firstUser,
  },
};

export const DifferentUser: Story = {
  args: {
    initAssignee: secondUser,
  },
};
