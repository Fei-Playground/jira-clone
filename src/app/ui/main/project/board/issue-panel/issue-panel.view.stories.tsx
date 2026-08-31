import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { userMock1, userMock2, usersMock } from "@domain/user";
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

const issue = {
  ...todoIssuesMock1[0],
  dueDate: new Date("2022-02-01").valueOf(),
  estimate: "2d",
  timeLogged: "4h",
  watchers: [userMock1, userMock2, usersMock[2]],
  activities: [
    {
      id: "act-1",
      type: "created" as const,
      message: "created this issue",
      user: todoIssuesMock1[0].reporter,
      createdAt: todoIssuesMock1[0].createdAt,
    },
    {
      id: "act-2",
      type: "status_changed" as const,
      message: "changed status to Done",
      user: todoIssuesMock1[0].asignee,
      createdAt: todoIssuesMock1[0].updatedAt,
    },
    {
      id: "act-3",
      type: "comment_added" as const,
      message: "added a comment",
      user: todoIssuesMock1[0].comments[0]?.user || todoIssuesMock1[0].reporter,
      createdAt: todoIssuesMock1[0].updatedAt,
    },
  ],
};

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

export const EmptyComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: [],
      activities: issue.activities.filter((a) => a.type !== "comment_added"),
    },
  },
};

export const CreateNew: Story = {
  args: {
    issue: undefined,
  },
};
