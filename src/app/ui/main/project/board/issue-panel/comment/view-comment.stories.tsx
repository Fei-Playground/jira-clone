import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { ViewComment } from "./view-comment";
import { UserContextProvider } from "@app/store/user.store";
import { usersMock, userMock1 } from "@domain/user";
import { Comment } from "@domain/comment";

const createdAt = Date.now() - 1000 * 60 * 30; // 30 minutes ago
const updatedAt = createdAt;

// Comment with 2 replies
const commentWithTwoReplies: Comment = {
  id: "comment-1",
  user: usersMock[3], // Jessie
  message:
    "Depending on the user, some features are restricted. For example, only the reporter of an issue can edit the title and description.",
  createdAt,
  updatedAt,
  replies: [
    {
      id: "reply-1-1",
      user: usersMock[5], // Mr. Potato
      message: "That makes sense for security and data integrity!",
      createdAt: createdAt + 1000 * 60 * 5, // 5 minutes later
      updatedAt: createdAt + 1000 * 60 * 5,
    },
    {
      id: "reply-1-2",
      user: usersMock[6], // Ms. Potato
      message: "Thanks for explaining! This really helps with understanding the permissions model.",
      createdAt: createdAt + 1000 * 60 * 10, // 10 minutes later
      updatedAt: createdAt + 1000 * 60 * 10,
    },
  ],
};

// Comment with 1 reply
const commentWithSingleReply: Comment = {
  id: "comment-2",
  user: usersMock[7], // Little Green Men
  message: "And only the original poster of a comment can edit or delete it!",
  createdAt,
  updatedAt,
  replies: [
    {
      id: "reply-2-1",
      user: userMock1, // Daniel Serrano
      message: "Exactly! This helps maintain accountability.",
      createdAt: createdAt + 1000 * 60 * 10, // 10 minutes later
      updatedAt: createdAt + 1000 * 60 * 10,
    },
  ],
};

// Comment with no replies
const commentWithNoReplies: Comment = {
  id: "comment-3",
  user: usersMock[5], // Mr. Potato
  message:
    "This is not the only accessible feature implemented. By using Radix UI, components like select, dialog or checkboxes are accessible by default.",
  createdAt,
  updatedAt,
};

const withContext = (
  children: JSX.Element,
  currentUser = userMock1
): JSX.Element => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: (
        <UserContextProvider user={currentUser}>{children}</UserContextProvider>
      ),
      action: async () => ({ status: 200 }),
    },
  ]);

  return <RemixStub />;
};

const meta: Meta<typeof ViewComment> = {
  title: "Main/Project/Board/IssuePanel/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

export const Default: Story = {
  render: () =>
    withContext(
      <ViewComment
        comment={commentWithTwoReplies}
        removeComment={(id) => console.log("Remove comment:", id)}
      />
    ),
};

export const WithSingleReply: Story = {
  render: () =>
    withContext(
      <ViewComment
        comment={commentWithSingleReply}
        removeComment={(id) => console.log("Remove comment:", id)}
      />
    ),
};

export const NoReplies: Story = {
  render: () =>
    withContext(
      <ViewComment
        comment={commentWithNoReplies}
        removeComment={(id) => console.log("Remove comment:", id)}
      />
    ),
};
