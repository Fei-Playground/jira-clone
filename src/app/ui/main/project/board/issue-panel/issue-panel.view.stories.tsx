import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import {
  todoIssuesMock1,
  inProgressIssuesMock1,
} from "@domain/issue";
import {
  commentMock1,
  commentMock2,
  commentMock3,
} from "@domain/comment";
import { projectMock1 } from "@domain/project";
import { IssuePanel } from "./issue-panel.view";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        {withRemixStub(
          <ProjectContextProvider project={projectMock1}>
            {withMainContext(Story)}
          </ProjectContextProvider>
        )}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

// Story 1: Issue with replies on comments
export const Default: Story = {
  args: {
    issue: {
      ...todoIssuesMock1[0],
      comments: [commentMock1, commentMock2],
    },
  },
};

// Story 2: Issue with empty replies
export const WithEmptyReplies: Story = {
  args: {
    issue: {
      ...inProgressIssuesMock1[0],
      comments: [commentMock3],
    },
  },
};

// Story 3: Issue with multiple comment variations
export const WithVariousComments: Story = {
  args: {
    issue: {
      ...todoIssuesMock1[0],
      comments: [commentMock1, commentMock2, commentMock3],
    },
  },
};
