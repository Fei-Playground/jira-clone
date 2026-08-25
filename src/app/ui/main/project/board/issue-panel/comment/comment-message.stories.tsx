import type { Meta, StoryObj } from "@storybook/react-vite";
import { usersMock } from "@domain/user";
import { CommentMessage } from "./comment-message";

const meta: Meta<typeof CommentMessage> = {
  title: "Pages/Main/Project/Board/IssuePanel/CommentMessage",
  component: CommentMessage,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] rounded-md bg-elevation-surface p-4 font-primary-light">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentMessage>;

export const SingleMention: Story = {
  args: {
    message: "Can you take a look at this, @Woody?",
    users: usersMock,
  },
};

export const MultipleMentions: Story = {
  args: {
    message:
      "Looping in @Buzz Lightyear and @Jessie on this. Thanks @Daniel Serrano!",
    users: usersMock,
  },
};

export const WithoutMentions: Story = {
  args: {
    message: "Plain comment with no mentions.",
    users: usersMock,
  },
};
