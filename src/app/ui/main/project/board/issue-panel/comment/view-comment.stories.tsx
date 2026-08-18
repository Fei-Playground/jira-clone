import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { Comment } from "@domain/comment";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { withRemixStub } from "@app/stories/utils";
import { ViewComment } from "./view-comment";

const currentUser = {
  id: "user1",
  name: "Daniel Serrano",
  color: "#FF6B6B",
  image: undefined,
};

const now = Date.now();

const rootComment: Comment = {
  id: "comment-1",
  user: currentUser,
  message:
    "Depending on the user, some features are restricted. For example, only the reporter of an issue can edit the title and description.",
  createdAt: now,
  updatedAt: now,
};

const reply1: Comment = {
  id: "reply-1",
  user: {
    id: "user-woody",
    name: "Woody",
    image: "woody.webp",
  },
  message: "Good point — that keeps the workflow tidy and predictable.",
  createdAt: now,
  updatedAt: now,
  parentId: "comment-1",
};

const reply2: Comment = {
  id: "reply-2",
  user: {
    id: "user-buzz",
    name: "Buzz Lightyear",
    image: "buzz-lightyear.webp",
  },
  message: "Agreed. To infinity and beyond with these permissions!",
  createdAt: now,
  updatedAt: now,
  parentId: "comment-1",
};

const meta: Meta<typeof ViewComment> = {
  title: "Pages/Main/Project/Board/IssuePanel/Comment/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
  args: {
    removeComment: () => undefined,
    addComment: () => undefined,
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <UserContextProvider user={currentUser}>
          <ThemeProvider
            specifiedTheme={Theme.LIGHT}
            specifiedPreference={Preference.SELECTED}
          >
            <div className="w-full max-w-2xl">
              <Story />
            </div>
          </ThemeProvider>
        </UserContextProvider>
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

export const WithReplies: Story = {
  args: {
    comment: rootComment,
    replies: [reply1, reply2],
  },
};

export const WithReplyOpen: Story = {
  args: {
    comment: rootComment,
    replies: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const replyButton = await canvas.findByRole("button", {
      name: /reply to comment/i,
    });
    await userEvent.click(replyButton);
  },
};

export const Default: Story = {
  args: {
    comment: rootComment,
    replies: [],
  },
};
