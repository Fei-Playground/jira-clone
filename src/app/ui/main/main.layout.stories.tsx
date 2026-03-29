import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { userMock1 } from "@domain/user";
import { MainLayout } from "./main.layout";

const meta: Meta<typeof MainLayout> = {
  title: "Pages/Main/MainLayout",
  component: MainLayout,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

export const Default: Story = {
  args: {
    user: userMock1,
  },
};
