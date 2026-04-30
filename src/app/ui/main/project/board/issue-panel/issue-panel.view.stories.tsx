import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { usersMock } from "@domain/user";
import { priorityMedium } from "@domain/priority";
import { ProjectContextProvider } from "@app/ui/main/project";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";
import type { Issue } from "@domain/issue";

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

// Issue with multiple comments to showcase the Reply functionality
const issueWithMultipleComments: Issue = {
  id: "4db55cbf-222d-424a-b23b-08e61534c706",
  name: "Feature: Comment Reply Functionality",
  description:
    "Each comment now has a Reply button that expands a CreateComment input below the comment with proper indentation. When Reply is clicked, a comment input box appears below the comment with a Cancel button.",
  reporter: usersMock[0], // Daniel Serrano
  asignee: usersMock[1], // Woody
  comments: [
    {
      id: "comment-1",
      user: usersMock[2], // Buzz Lightyear
      message:
        "This is the first comment. Try clicking the Reply button below to see how the reply functionality works!",
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: "comment-2",
      user: usersMock[3], // Jessie
      message:
        "Great feature! The Reply button expands a CreateComment input with proper indentation.",
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: "comment-3",
      user: usersMock[5], // Mr Potato
      message:
        "I like how the Cancel button appears when replying. It makes it easy to dismiss the reply input if needed.",
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: "comment-4",
      user: usersMock[1], // Woody
      message:
        "The indentation on the reply input makes it clear which comment you are replying to.",
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 3600000,
    },
  ],
  priority: priorityMedium,
  categoryType: "IN_PROGRESS",
  createdAt: Date.now() - 86400000 * 7,
  updatedAt: Date.now() - 3600000,
};

export const Default: Story = {
  args: {
    issue: issueWithMultipleComments,
  },
};

export const WithReplyFunctionality: Story = {
  name: "With Reply Buttons",
  args: {
    issue: issueWithMultipleComments,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the IssuePanel with multiple comments. Each comment has a Reply button that when clicked, expands a CreateComment input below the comment with proper indentation and a Cancel button.",
      },
    },
  },
};
