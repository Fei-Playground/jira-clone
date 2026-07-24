import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import {
  commentMock1,
  commentMock1Reply1,
  commentMock2,
  commentMock2Reply1,
} from "@domain/comment";
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

/**
 * Comments section showcasing the threaded-reply UI:
 * - commentMock1 (Jessie) with one nested reply (Little Green Men)
 * - commentMock2 (Little Green Men) with one nested reply (Mr Potato)
 * Top-level comments expose a "Reply" button (alongside Edit/Delete for the
 * current user), and clicking it reveals an inline EditBox with the current
 * user's avatar. Replies render as compact nested items with smaller avatars.
 */
export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: [
        commentMock1,
        commentMock1Reply1,
        commentMock2,
        commentMock2Reply1,
      ],
    },
  },
};
