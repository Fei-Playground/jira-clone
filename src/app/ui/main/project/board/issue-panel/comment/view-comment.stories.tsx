import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { commentMock1 } from "@domain/comment";
import { userMock1, usersMock } from "@domain/user";
import { ViewComment } from "./view-comment";

const meta: Meta<typeof ViewComment> = {
  title: "Pages/Main/Project/Board/IssuePanel/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

const mentionUsers = [
  userMock1,
  ...usersMock.filter((user) => user.id !== userMock1.id),
];

export const WithReplies: Story = {
  args: {
    comment: commentMock1,
    removeComment: () => {},
    mentionUsers,
  },
};

export const ReplyBoxOpen: Story = {
  args: {
    comment: commentMock1,
    removeComment: () => {},
    mentionUsers,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText("Reply to comment"));
  },
};

export const MentionDropdown: Story = {
  args: {
    comment: commentMock1,
    removeComment: () => {},
    mentionUsers,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText("Reply to comment"));
    const textarea = canvas.getByRole("combobox", {
      name: "Comment with user mentions",
    });
    await userEvent.type(textarea, "@mr");
  },
};
