import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { ViewComment } from "./view-comment";
import { UserContextProvider } from "@app/store/user.store";
import { commentMock1, commentMock2 } from "@domain/comment";
import { userMock1 } from "@domain/user";
import { Comment } from "@domain/comment";

const meta: Meta<typeof ViewComment> = {
  title: "Comment/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/*",
          element: (
            <UserContextProvider user={userMock1}>
              <Story />
            </UserContextProvider>
          ),
          action: () => ({}),
        },
      ]);
      return <RemixStub initialEntries={["/"]} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

// Comment with 2 replies (Jessie's comment with replies from Little Green Men and Daniel Serrano)
export const WithReplies: Story = {
  args: {
    comment: commentMock1,
    removeComment: () => {},
  },
};

// Comment without replies (Little Green Men's comment)
export const WithoutReplies: Story = {
  args: {
    comment: commentMock2,
    removeComment: () => {},
  },
};

// User's own comment (Daniel Serrano - shows Edit/Delete/Reply buttons)
const ownComment: Comment = {
  id: "user-own-comment",
  user: userMock1, // Daniel Serrano (current user)
  message: "This is my own comment, so I can edit and delete it, plus reply to it.",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const OwnComment: Story = {
  args: {
    comment: ownComment,
    removeComment: () => {},
  },
};

// Edited comment (shows EDITED label)
const editedComment: Comment = {
  id: "edited-comment",
  user: userMock1,
  message: "This comment has been edited - notice the EDITED label.",
  createdAt: Date.now() - 10000, // Created 10 seconds ago
  updatedAt: Date.now(), // Updated now (different from createdAt)
};

export const EditedComment: Story = {
  args: {
    comment: editedComment,
    removeComment: () => {},
  },
};
