import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditBox } from "./edit-box";

const meta: Meta<typeof EditBox> = {
  title: "Pages/Main/Project/Board/IssuePanel/EditBox",
  component: EditBox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    save: { action: "save" },
    cancel: { action: "cancel" },
  },
};

export default meta;
type Story = StoryObj<typeof EditBox>;

export const Default: Story = {
  args: {
    defaultMessage: "",
    autofocus: true,
  },
};

export const WithMessage: Story = {
  args: {
    defaultMessage: "This is an existing comment message",
    autofocus: true,
  },
};

export const NotEditing: Story = {
  args: {
    defaultMessage: "",
    autofocus: false,
  },
};
