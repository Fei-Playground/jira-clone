import type { Meta, StoryObj } from "@storybook/react";
import { usersMock } from "@domain/user";
import { UserAvatarList } from "./avatar-list";

const meta: Meta<typeof UserAvatarList> = {
  title: "Pages/Main/Project/Board/AvatarList",
  component: UserAvatarList,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    users: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatarList>;

export const Default: Story = {
  args: {
    users: usersMock.slice(0, 4),
  },
};

export const TwoUsers: Story = {
  args: {
    users: usersMock.slice(0, 2),
  },
};

export const ManyUsers: Story = {
  args: {
    users: usersMock,
  },
};

export const SingleUser: Story = {
  args: {
    users: [usersMock[0]],
  },
};
