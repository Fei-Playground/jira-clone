import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1, doneIssuesMock1 } from "@domain/issue";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";

/**
 * IssuePanel component with the following UX improvements:
 * - Unsaved changes warning dialog (appears when closing with unsaved edits)
 * - Click-to-copy issue ID (click the ID in header to copy)
 * - Fixed 'Submitting' text during form submission
 * - Comments empty state ("No comments yet. Be the first to comment!")
 * - Tooltip on Accept button (shows "Shift+S" keyboard shortcut)
 * - Visually distinct reporter field (rounded pill with avatar)
 */
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

const issueWithComments = todoIssuesMock1[0];
const issueNoComments = { ...doneIssuesMock1[0], comments: [] };

/**
 * Default view showing all UX improvements:
 * - Issue ID is clickable to copy (hover to see tooltip)
 * - Reporter field styled as pill with avatar
 * - Comments section with existing comments and user avatars
 * - Accept button with Shift+S tooltip
 * - Keyboard shortcuts displayed at bottom
 */
export const Default: Story = {
  args: {
    issue: issueWithComments,
  },
};

/**
 * Issue with comments showing:
 * - Multiple comments with different users
 * - Edit/Delete actions for user's own comments
 * - Comment timestamps
 */
export const WithComments: Story = {
  args: {
    issue: issueWithComments,
  },
};

/**
 * Comments empty state showing the message:
 * "No comments yet. Be the first to comment!"
 */
export const NoComments: Story = {
  args: {
    issue: issueNoComments,
  },
};
