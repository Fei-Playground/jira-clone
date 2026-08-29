import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { LoginView } from "./login.view";

const meta: Meta<typeof LoginView> = {
  title: "Pages/Login",
  component: LoginView,
  parameters: {
    layout: "centered",
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

export const Default: Story = {};
