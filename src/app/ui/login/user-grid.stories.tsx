import type { Meta, StoryObj } from "@storybook/react-vite";
import { usersMock } from "@domain/user";
import { UserGrid } from "./user-grid";

const meta: Meta<typeof UserGrid> = {
  title: "Pages/Login/UserGrid",
  component: UserGrid,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    users: {
      control: { type: "object" },
    },
    selectedUser: {
      control: { type: "object" },
    },
    onUserSelect: {
      action: "onUserSelect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserGrid>;

export const Default: Story = {
  args: {
    users: usersMock,
    selectedUser: usersMock[0],
    onUserSelect: () => {},
  },
};

export const SecondUserSelected: Story = {
  args: {
    users: usersMock,
    selectedUser: usersMock[1],
    onUserSelect: () => {},
  },
};

export const SingleUser: Story = {
  args: {
    users: [usersMock[0]],
    selectedUser: usersMock[0],
    onUserSelect: () => {},
  },
};

export const FewUsers: Story = {
  args: {
    users: usersMock.slice(0, 3),
    selectedUser: usersMock[0],
    onUserSelect: () => {},
  },
};

export const MobileLayout: Story = {
  args: {
    users: usersMock,
    selectedUser: usersMock[0],
    onUserSelect: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

export const TabletLayout: Story = {
  args: {
    users: usersMock,
    selectedUser: usersMock[0],
    onUserSelect: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: "ipad",
    },
  },
};
