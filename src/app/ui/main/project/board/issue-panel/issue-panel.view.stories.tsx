import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1 } from "@domain/issue";
import { usersMock } from "@domain/user";
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

// Story demonstrating @mention functionality with highlighted mentions in comments
const commentsWithMentions = [
  {
    id: "mention-comment-1",
    user: usersMock[1], // Woody
    message:
      "Hey @Buzz Lightyear, can you take a look at this issue? I think it needs your expertise.",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "mention-comment-2",
    user: usersMock[2], // Buzz Lightyear
    message:
      "Sure @Woody! I'll review it. @Jessie might also have some insights on this one.",
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: "mention-comment-3",
    user: usersMock[3], // Jessie
    message:
      "Thanks for the mention @Buzz Lightyear! I agree with the approach. @Mr Potato and @Ms Potato should also be looped in for the final review.",
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 900000,
  },
];

export const WithMentions: Story = {
  args: {
    issue: {
      ...issue,
      comments: commentsWithMentions,
    },
  },
};
