import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { ViewComment } from "./view-comment";
import { UserContextProvider } from "@app/store/user.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { commentMock1, commentMock2 } from "@domain/comment";
import { userMock1, usersMock } from "@domain/user";
import { projectMock1 } from "@domain/project";
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
              <ProjectContextProvider project={projectMock1}>
                <Story />
              </ProjectContextProvider>
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

// Comment with mentions - displays mentioned users as avatar chips below the comment text
const commentWithMentions: Comment = {
  id: "comment-with-mentions",
  user: usersMock[3], // Jessie
  message: "Great work @Buzz Lightyear and @Woody on the implementation! Let's sync with @Mr Potato as well.",
  mentions: [
    usersMock[2].id, // Buzz Lightyear
    usersMock[1].id, // Woody
    usersMock[5].id, // Mr Potato
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const WithMentions: Story = {
  args: {
    comment: commentWithMentions,
    removeComment: () => {},
  },
};

// Comment with mentions and replies - showing full mention functionality
const replyWithMention: Comment = {
  id: "reply-with-mention",
  user: usersMock[2], // Buzz Lightyear
  message: "Thanks @Jessie! I'll follow up with @Andy Davis on the details.",
  mentions: [
    usersMock[3].id, // Jessie
    usersMock[9].id, // Andy Davis
  ],
  createdAt: Date.now() + 1000,
  updatedAt: Date.now() + 1000,
};

const commentWithMentionsAndReplies: Comment = {
  id: "comment-mentions-replies",
  user: usersMock[1], // Woody
  message: "Hey @Emperor Zurg can you review this? Cc @Ms Potato",
  mentions: [
    usersMock[4].id, // Emperor Zurg
    usersMock[6].id, // Ms Potato
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  replies: [replyWithMention],
};

export const WithMentionsAndReplies: Story = {
  args: {
    comment: commentWithMentionsAndReplies,
    removeComment: () => {},
  },
};
