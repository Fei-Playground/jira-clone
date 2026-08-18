import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { commentMock1, commentMock2, commentMock4 } from "@domain/comment";
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
 * Demonstrates the new reply feature:
 * - Every comment shows a "Reply" button below the message.
 * - commentMock1 (Jessie) and commentMock2 (Little Green Men) have nested
 *   replies rendered with smaller 28px avatars, indented with a left border.
 * - The play() function clicks the first "Reply" button to open the inline
 *   reply editor beneath that comment.
 */
export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: [commentMock1, commentMock2, commentMock4],
    },
  },
  play: async ({ canvasElement }) => {
    // IssuePanel renders inside a Radix Dialog portal, so query the whole document.
    const canvas = within(canvasElement.ownerDocument.body);
    const replyButtons = await canvas.findAllByRole("button", {
      name: /reply to comment/i,
    });
    expect(replyButtons.length).toBeGreaterThan(0);
    await userEvent.click(replyButtons[0]);
  },
};
