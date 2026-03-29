import type { Meta, StoryObj } from "@storybook/react";
import { projectMock1 } from "@domain/project";
import { CategoryType } from "@domain/category";
import { ProjectContextProvider } from "@app/ui/main/project";
import { SelectStatus } from "./select-status";

const meta: Meta<typeof SelectStatus> = {
  title: "Pages/Main/Project/Board/IssuePanel/SelectStatus",
  component: SelectStatus,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    initStatus: {
      control: {
        type: "select",
        options: ["TODO", "IN_PROGRESS", "DONE"],
      },
    },
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
type Story = StoryObj<typeof SelectStatus>;

export const Todo: Story = {
  args: {
    initStatus: "TODO" as CategoryType,
  },
};

export const InProgress: Story = {
  args: {
    initStatus: "IN_PROGRESS" as CategoryType,
  },
};

export const Done: Story = {
  args: {
    initStatus: "DONE" as CategoryType,
  },
};
