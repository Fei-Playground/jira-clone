import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1, inProgressIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel/IssuePanelView",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(withMainContext(Story))}
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

const issue = todoIssuesMock1[0];
const issueWithMetadata = inProgressIssuesMock1[0];

export const Default: Story = {
  args: {
    issue: issue,
    allIssues: [...todoIssuesMock1, ...inProgressIssuesMock1],
  },
};

export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
    allIssues: [...todoIssuesMock1, ...inProgressIssuesMock1],
  },
};

export const WithLinksLabelsWatchers: Story = {
  args: {
    issue: issueWithMetadata,
    allIssues: [...todoIssuesMock1, ...inProgressIssuesMock1],
  },
};
