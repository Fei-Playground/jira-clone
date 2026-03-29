import type { Meta, StoryObj } from "@storybook/react";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectAsignee } from "./select-asignee";

const meta: Meta<typeof SelectAsignee> = {
  title: "Pages/Main/Project/Board/IssuePanel/SelectAsignee",
  component: SelectAsignee,
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
type Story = StoryObj<typeof SelectAsignee>;

const firstUser = projectMock1.users[0];
const secondUser = projectMock1.users[1];

export const Default: Story = {
  args: {
    initAsignee: firstUser,
  },
};

export const DifferentUser: Story = {
  args: {
    initAsignee: secondUser,
  },
};
