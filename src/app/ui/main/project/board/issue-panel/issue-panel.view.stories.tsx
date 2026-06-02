import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { todoIssuesMock1, inProgressIssuesMock1 } from "@domain/issue";
import { usersMock } from "@domain/user";
import { Comment } from "@domain/comment";
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

// Shows issue with basic comments (no replies)
export const WithComments: Story = {
  args: {
    issue: {
      ...issue,
      comments: issue.comments,
    },
  },
};

// Demonstrates the nested reply feature with multi-level comment threads
const now = Date.now();
const commentsWithReplies: Comment[] = [
  {
    id: "comment-1",
    user: usersMock[3], // Jessie
    message:
      "I've noticed that the comment system works great! Can we add a reply feature to make discussions more organized?",
    createdAt: now - 86400000 * 2, // 2 days ago
    updatedAt: now - 86400000 * 2,
    replies: [
      {
        id: "reply-1-1",
        user: usersMock[1], // Woody
        message:
          "Great idea! That would make it much easier to follow conversations.",
        createdAt: now - 86400000, // 1 day ago
        updatedAt: now - 86400000,
        parentId: "comment-1",
      },
      {
        id: "reply-1-2",
        user: usersMock[2], // Buzz Lightyear
        message:
          "I agree, nested replies would be a huge improvement for team collaboration.",
        createdAt: now - 43200000, // 12 hours ago
        updatedAt: now - 43200000,
        parentId: "comment-1",
      },
    ],
  },
  {
    id: "comment-2",
    user: usersMock[5], // Mr Potato
    message:
      "The Reply button is now visible on each comment. Click it to see the reply input area!",
    createdAt: now - 3600000, // 1 hour ago
    updatedAt: now - 3600000,
    replies: [
      {
        id: "reply-2-1",
        user: usersMock[6], // Ms Potato
        message:
          "This is a reply that appears indented under the parent comment.",
        createdAt: now - 1800000, // 30 minutes ago
        updatedAt: now - 1800000,
        parentId: "comment-2",
      },
    ],
  },
];

export const WithReplies: Story = {
  args: {
    issue: {
      ...inProgressIssuesMock1[1],
      comments: commentsWithReplies,
    },
  },
};

// Demonstrates @mention functionality with highlighted user references
// Type @ in any comment field to trigger the autocomplete dropdown
const commentsWithMentions: Comment[] = [
  {
    id: "mention-comment-1",
    user: usersMock[1], // Woody
    message:
      "Hey @Buzz Lightyear, can you take a look at this issue? I think @Jessie also had some thoughts on the implementation.",
    createdAt: now - 86400000 * 3, // 3 days ago
    updatedAt: now - 86400000 * 3,
    replies: [
      {
        id: "mention-reply-1-1",
        user: usersMock[2], // Buzz Lightyear
        message:
          "Thanks @Woody! I'll review it today. @Mr Potato mentioned this might be related to the previous sprint work.",
        createdAt: now - 86400000 * 2, // 2 days ago
        updatedAt: now - 86400000 * 2,
        parentId: "mention-comment-1",
      },
      {
        id: "mention-reply-1-2",
        user: usersMock[3], // Jessie
        message:
          "I agree with @Buzz Lightyear. Let me sync with @Emperor Zurg on this as well.",
        createdAt: now - 86400000, // 1 day ago
        updatedAt: now - 86400000,
        parentId: "mention-comment-1",
      },
    ],
  },
  {
    id: "mention-comment-2",
    user: usersMock[5], // Mr Potato
    message:
      "@Daniel Serrano @Andy Davis - the latest changes are ready for review. The @mentions feature is now fully working!",
    createdAt: now - 7200000, // 2 hours ago
    updatedAt: now - 7200000,
    replies: [
      {
        id: "mention-reply-2-1",
        user: usersMock[0], // Daniel Serrano
        message:
          "Looks great @Mr Potato! The mention dropdown with keyboard navigation works perfectly. @Ms Potato should test it too.",
        createdAt: now - 3600000, // 1 hour ago
        updatedAt: now - 3600000,
        parentId: "mention-comment-2",
      },
    ],
  },
];

export const WithMentions: Story = {
  args: {
    issue: {
      ...inProgressIssuesMock1[0],
      comments: commentsWithMentions,
    },
  },
};
