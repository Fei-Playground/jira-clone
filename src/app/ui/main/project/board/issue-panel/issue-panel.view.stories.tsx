import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
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
      comments: issue.comments.map((comment, index) => ({
        ...comment,
        replies:
          index === 0
            ? [
                {
                  id: "reply-1",
                  user: todoIssuesMock1[0].asignee,
                  message:
                    "Thanks for the tip! I noticed this helps with debugging cross-browser issues too.",
                  createdAt: comment.createdAt + 60000,
                  updatedAt: comment.createdAt + 60000,
                },
                {
                  id: "reply-2",
                  user: comment.user,
                  message:
                    "Absolutely! It's been a lifesaver for identifying 404 vs 500 errors quickly.",
                  createdAt: comment.createdAt + 120000,
                  updatedAt: comment.createdAt + 120000,
                },
              ]
            : undefined,
      })),
    },
  },
};
