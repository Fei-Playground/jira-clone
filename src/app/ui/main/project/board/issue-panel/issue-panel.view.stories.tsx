import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1, inProgressIssuesMock1 } from "@domain/issue";
import { userMock1 } from "@domain/user";
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

const unsavedComment = {
  id: "temp-preview-unsaved",
  user: userMock1,
  message: "Draft note about acceptance criteria — not saved yet.",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

/** Existing issue with Save label (disabled until dirty). */
export const Default: Story = {
  args: {
    issue: issue,
  },
};

/**
 * Comments list with delete-confirm on own comments and
 * "Not saved yet" cue on a temp comment, plus unsaved-comments helper text.
 */
export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: [...issue.comments, unsavedComment],
    },
  },
};

/**
 * Create-new-issue flow: Create label (not Accept), unsaved-changes banner,
 * and empty title ready for required validation on touch/submit.
 */
export const CreateNewIssue: Story = {
  args: {
    issue: undefined,
  },
};

/**
 * Non-reporter view: lock banner, read-only title/description/selects,
 * Save disabled — comments still allowed.
 */
export const ReadOnlyNonReporter: Story = {
  args: {
    issue: inProgressIssuesMock1[1], // reporter: Woody (userMock2)
  },
};
