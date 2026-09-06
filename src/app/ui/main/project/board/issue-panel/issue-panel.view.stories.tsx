import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
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

export const Default: Story = {
  args: {
    issue: issue,
  },
};

export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
  },
};

const issueWithReplies = inProgressIssuesMock1[1];

export const MentionDropdownOpen: Story = {
  args: {
    issue: issueWithReplies,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textboxes = canvas.getAllByPlaceholderText("Add your comment...");
    const textarea = textboxes[0];
    await userEvent.click(textarea);
    await userEvent.type(textarea, "@");
  },
};

export const WithReplies: Story = {
  args: {
    issue: issueWithReplies,
  },
};
