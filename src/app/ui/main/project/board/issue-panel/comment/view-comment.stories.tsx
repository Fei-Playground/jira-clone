import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { commentMock1, commentMock2, commentMock4 } from "@domain/comment";
import { usersMock } from "@domain/user";
import type { Comment } from "@domain/comment";
import { ViewComment } from "./view-comment";

const noop = () => undefined;

const replyToComment1First: Comment = {
  id: "reply-1a-3c1f0d2e-8b44-4a1e-9c77-2f5a1e6b9d01",
  user: usersMock[1], // Woody
  message: "Good point — that makes the permissions much clearer to me now.",
  parentId: commentMock1.id,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const replyToComment1Second: Comment = {
  id: "reply-1b-7e2a9c44-1f36-4d90-b0a2-6d8c3f4b5a02",
  user: usersMock[2], // Buzz Lightyear
  message: "Agreed. To infinity and beyond with these restrictions!",
  parentId: commentMock1.id,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const meta: Meta<typeof ViewComment> = {
  title: "Pages/Main/Project/Board/IssuePanel/Comment/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
  args: {
    removeComment: noop,
    addComment: noop,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

// 1. A top-level comment with the "Reply" button visible (no nested replies).
export const Default: Story = {
  args: {
    comment: commentMock2,
    replies: [],
  },
};

// 2. A top-level comment that has nested replies indented below it with a left border.
export const WithReplies: Story = {
  args: {
    comment: commentMock1,
    replies: [replyToComment1First, replyToComment1Second],
  },
};

// A self-authored comment: shows Reply + Edit + Delete actions.
export const SelfCommentWithActions: Story = {
  args: {
    comment: commentMock4, // authored by the current user (Daniel Serrano)
    replies: [],
  },
};
