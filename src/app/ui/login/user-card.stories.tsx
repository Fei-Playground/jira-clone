import type { Meta, StoryObj } from "@storybook/react-vite";
import { usersMock } from "@domain/user";
import { UserCard } from "./user-card";

const meta: Meta<typeof UserCard> = {
  title: "Pages/Login/UserCard",
  component: UserCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    user: {
      control: { type: "object" },
    },
    isSelected: {
      control: { type: "boolean" },
    },
    onSelect: {
      action: "onSelect",
    },
    tabIndex: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const Default: Story = {
  args: {
    user: usersMock[0],
    isSelected: false,
    tabIndex: -1,
    onSelect: () => {},
  },
};

export const Selected: Story = {
  args: {
    user: usersMock[0],
    isSelected: true,
    tabIndex: 0,
    onSelect: () => {},
  },
};

export const WithImage: Story = {
  args: {
    user: usersMock[1],
    isSelected: false,
    tabIndex: -1,
    onSelect: () => {},
  },
};

export const WithImageSelected: Story = {
  args: {
    user: usersMock[1],
    isSelected: true,
    tabIndex: 0,
    onSelect: () => {},
  },
};

export const LongName: Story = {
  args: {
    user: {
      id: "test-id",
      name: "This Is A Very Long User Name",
    },
    isSelected: false,
    tabIndex: -1,
    onSelect: () => {},
  },
};

export const Focused: Story = {
  args: {
    user: usersMock[2],
    isSelected: false,
    tabIndex: 0,
    onSelect: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
