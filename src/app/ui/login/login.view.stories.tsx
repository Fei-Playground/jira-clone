import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { usersMock } from "@domain/user";
import { LoginView } from "./login.view";

const meta: Meta<typeof LoginView> = {
  title: "Pages/Login",
  component: LoginView,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    users: {
      defaultValue: usersMock,
      control: {
        type: "object",
      },
    },
  },
  decorators: [
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: "/",
          Component: () => <Story />,
          action: async () => {
            return {
              status: 200,
            };
          },
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LoginView>;

export const Default: Story = {
  args: {
    users: usersMock,
  },
  render: (args) => <StoryComponent {...args} />,
};

function StoryComponent(args: typeof Default.args = { users: usersMock }) {
  return <LoginView users={args.users ?? usersMock} />;
}
